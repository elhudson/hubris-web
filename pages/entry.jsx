import { useState } from "react";
import { useAsync } from "react-async-hook";
import { useParams } from "react-router-dom";
import { prop_sorter, sql_danger } from "utilities";
import { css } from "@emotion/css";
import Card from "@components/card";
import Link from "@components/link";
import Icon from "@ui/icon";
import Tooltip from "@ui/tooltip";
import References from "@components/references";
import { useTheme } from "@emotion/react";

import Collapsible from "@ui/collapsible";

export default () => {
  const { colors } = useTheme();
  const { feature, table } = useParams();
  const data = useAsync(async () => {
    const feat = await fetch(
      `/data/rules?table=${table}&query=${JSON.stringify({
        where: {
          id: feature
        }
      })}&relations=true`
    )
      .then((j) => j.json())
      .then((d) => d[0]);
    const props = prop_sorter(feat);
    const basic = Object.fromEntries(
      Object.keys(feat)
        .filter((f) => props.basic.includes(f))
        .map((prop) => [prop, feat[prop]])
    );
    const singles = Object.fromEntries(
      Object.keys(feat)
        .filter((f) => props.links.single.includes(f))
        .map((prop) => [prop, feat[prop]])
    );
    const multis = Object.fromEntries(
      Object.keys(feat)
        .filter((f) => props.links.multi.includes(f))
        .map((prop) => [prop, feat[prop]])
    );
    return {
      feat: feat,
      simple: basic,
      links: singles,
      multi: multis
    };
  }).result;
  console.log(data);
  return (
    <>
      {data && (
        <div
          className={css`
            > .references {
              all: unset;
            }
          `}>
          <h2 className="pagetitle">{data.feat.title}</h2>
          <div
            className={css`
              display: grid;
              grid-template-columns: min-content auto;
            `}>
            <div>
              {Object.keys(data.links).length > 0 && (
                <div
                  className={css`
                    border: 1px solid ${colors.accent};
                    padding: 10px;
                    margin: 5px;
                    label {
                      font-weight: 500;
                      text-transform: uppercase;
                    }
                  `}>
                  <References
                    feature={data.simple}
                    render={({ label, value }) => (
                      <SimpleProp
                        label={label}
                        value={value}
                      />
                    )}
                  />
                  <References
                    feature={data.links}
                    render={({ label, value }) => (
                      <LinkProp
                        label={label}
                        value={value}
                      />
                    )}
                  />
                </div>
              )}
            </div>
            <div className="description dashed">{data.feat.description}</div>
          </div>
          <div>
            <div
              className={css`
                > .references {
                  all: unset;
                }
              `}>
              <References
                feature={data.multi}
                render={({ label, value }) => (
                  <ComplexProp
                    label={label}
                    value={value}
                  />
                )}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const LinkProp = ({ label, value }) => {
  return (
    <>
      <label>{label}</label>
      <div>
        <Link
          feature={value}
          table={label}
        />
      </div>
    </>
  );
};

export const SimpleProp = ({ label, value }) => {
  return (
    <>
      <label>{label}</label>
      <div>{value}</div>
    </>
  );
};

export const ComplexProp = ({ label, value }) => {
  return (
    <Collapsible
      preview={
        <div
          className={css`
            width: 100%;
            text-transform: uppercase;
            font-weight: 500;
            &:hover {
              font-style: italic;
              text-decoration: underline;
              text-underline-offset: 2px;
            }
          `}>
          {label.replace("_", " ")}
        </div>
      }>
      <div
        className={css`
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 20vw));
          grid-gap: 10px;
          padding: 10px;
        `}>
        {value.map((v) => (
          <Card
            feature={v}
            table={label}
          />
        ))}
      </div>
    </Collapsible>
  );
};

export const FeatureTooltip = ({ feature, icon, table }) => {
  return (
    <li
      className={css`
        list-style: none;
      `}>
      <Tooltip
        preview={
          <div>
            <Icon
              id={icon}
              sz={18}
            />
            {feature.title}
          </div>
        }>
        <Card
          feature={feature.id}
          table={table}
        />
      </Tooltip>
    </li>
  );
};
