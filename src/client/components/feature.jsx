import { useState } from "react";
import { useAsync } from "react-async-hook";
import { useParams } from "react-router-dom";
import { prop_sorter, sql_danger } from "utilities";
import { css } from "@emotion/css";
import Icon from "@ui/icon";

export default ({ feature = null, table = null }) => {
  const excl = ["code", "characters", "damage", "weapons"];
  if (feature == null) {
    const params = useParams();
    feature = params.feature;
    table = params.table;
  }
  const shared_icons = {
    background_features: "backgrounds",
    class_features: "classes"
  };
  const [icon, setIcon] = useState(null);
  const [props, setProps] = useState(null);
  const data = useAsync(async () => {
    const query = {
      where: {
        id: feature
      }
    };
    const data = await fetch(
      `/data/rules?table=${table}&query=${JSON.stringify(query)}&relations=true`
    )
      .then((j) => j.json())
      .then((d) => d[0]);
    if (shared_icons[table]) {
      setIcon(data[shared_icons[table]].id);
    } else {
      setIcon(feature);
    }
    setProps(prop_sorter(data));
    return data;
  });
  return (
    <>
      {data.result && (
        <div
          className={css`
            svg {
              position: absolute;
              float: left;
            }
            > *:not(svg) {
              margin-left: 35px;
            }
          `}>
          <Icon
            id={icon}
            sz={30}
          />
          <h2>{data.result.title}</h2>

          <div
            className={css`
              display: grid;
              grid-template-columns: minmax(min-content, max-content) auto;
              grid-column-gap: 10px;
            `}>
            {props.basic
              .filter((f) => !excl.includes(f))
              .map((p) => (
                <Prop
                  label={sql_danger(p)}
                  value={data.result[p]}
                />
              ))}
            {props.links.single
              .filter((f) => !excl.includes(f))
              .map((p) => (
                <Prop
                  label={sql_danger(p)}
                  value={
                    <a href={`/srd/${p}/${data.result[p].id}`}>
                      {data.result[p].title}
                    </a>
                  }
                />
              ))}
            {props.links.multi
              .filter((f) => !excl.includes(f))
              .map((p) => (
                <Prop
                  label={sql_danger(p)}
                  value={data.result[p].map((v) => (
                    <a
                      href={`/srd/${
                        p == "requires" || p == "required_for" ? table : p
                      }/${v.id}`}>
                      {v.title}
                    </a>
                  ))}
                />
              ))}
          </div>
          <p>{data.result.description}</p>
        </div>
      )}
    </>
  );
};

export const Prop = ({ label, value }) => {
  return (
    <>
      <div
        className={css`
          text-transform: uppercase;
          font-weight: bold;
        `}>
        {label}
      </div>
      <div
        className={css`
          a {
            margin-right: 5px;
          }
        `}>
        {value}
      </div>
    </>
  );
};
