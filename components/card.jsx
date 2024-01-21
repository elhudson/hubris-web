import Link from "./link";
import Icon from "@ui/icon";
import Tooltip from "@ui/tooltip";
import Tag from "./tag";
import References from "./references";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";

export default ({ feature, table, customDesc = null, children = null }) => {
  const { colors } = useTheme();
  return (
    <div
      className={css`
        border: 1px solid ${colors.text};
        .references {
          border-left: 1px solid ${colors.accent};
          padding-left: 10px;
          margin-left: 5px;
        }
      `}>
      <div className={css`
        border-bottom:1px solid ${colors.text};
        padding:2px 3px;
        margin-bottom:3px;
        font-size:16px;
        font-weight:500;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        a {
          all:unset;
          &:hover {
            text-decoration:underline;
            text-underline-offset:2px;
            font-style:italic;
            cursor: pointer;
          }
        }
      `}>
        <Icon
          id={feature.id}
          sz={14}
        />
        <Link
          feature={feature}
          table={table}
        />
      </div>
      <References
        feature={feature}
        render={({ label, value }) => (
          <Prop
            label={label}
            value={value}
          />
        )}
      />
      <div className="description dashed">
        {customDesc ? customDesc(feature) : feature.description}
      </div>
      <div>{children}</div>
    </div>
  );
};

const Prop = ({ label, value }) => {
  return (
    <>
      <label
        className={css`
          text-transform: uppercase;
          font-weight: bold;
        `}>
        {label}
      </label>
      {Array.isArray(value) ? (
        <div
          className={css`
            display: inline-flex;
            overflow: scroll;
            button {
              height: fit-content;
              svg {
                height: 15px;
              }
            }
          `}>
          {value.map((v) => (
            <Tooltip
              preview={
                <Icon
                  id={v.id}
                  sz={15}
                />
              }>
              <Link
                feature={v}
                table={label}
              />
            </Tooltip>
          ))}
        </div>
      ) : typeof value == "object" ? (
        <div>
          <Link
            feature={value}
            table={label}
          />
        </div>
      ) : (
        <div>{value}</div>
      )}
    </>
  );
};
