import Link from "@components/link";
import Tooltip from "@ui/tooltip";
import { useCharacter } from "@contexts/character";
import { useUser } from "@contexts/user";
import { get_power_cost } from "utilities";
import { css } from "@emotion/css";
import { BiTargetLock } from "react-icons/bi";
import { GiStarSwirl } from "react-icons/gi";
import Tag from "@components/tag";
import { IoHourglassOutline } from "react-icons/io5";
import _ from "lodash";
import { useTheme } from "@emotion/react";
import Context from "@ui/context";
import { useRef } from "react";


export default ({ power }) => {
  const { character } = useCharacter();
  const user = useUser();
  const { colors } = useTheme();
  const ref = useRef();
  const menu = [
    {
      label: "Remove",
      action: async () => {
        await fetch("/data/query?table=powerSet&method=update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            where: {
              charactersId: character.id
            },
            data: {
              powers: {
                disconnect: {
                  id: power.id
                }
              }
            }
          })
        }).then((r) => ref.current.remove());
      }
    }
  ];
  if (power.creatorId == user.user_id) {
    menu.push({
      label: "Delete",
      action: async () => {
        await fetch("/data/query?table=powers&method=delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            where: {
              id: power.id
            }
          })
        }).then((r) => ref.current.remove());
      }
    });
  }
  return (
    <Context
      trigger={
        <div
          ref={ref}
          className={css`
            border: 1px solid ${colors.accent};
            min-width: 100px;
            display: grid;
            grid-template-areas:
              "header header header header header"
              "desc desc desc desc props"
              "desc desc desc desc props";
          `}>
          <div
            className={css`
              grid-area: header;
              position: relative;
              border-bottom: 1px solid ${colors.text};
              padding: 2px 5px;
            `}>
            <h6 style={{ display: "flex" }}>
              {power.name}
              <PowerTags power={power} />
            </h6>
            <div
              className={css`
                position: absolute;
                top: 2px;
                right: 5px;
              `}>
              <Tooltip preview={get_power_cost(power)}>Power</Tooltip>
              <span> / </span>
              <Tooltip preview={10 + character.burn + get_power_cost(power)}>
                DC
              </Tooltip>
            </div>
          </div>
          <div
            className={css`
              margin: 5px;
              grid-area: props;
              > div {
                display: flex;
                svg {
                  height: 18px;
                  width: 18px;
                  margin: 3px;
                }
              }
            `}>
            <div>
              <BiTargetLock />
              <div>
                {power.ranges.map((e) => (
                  <Link
                    feature={e}
                    table="ranges"
                  />
                ))}
              </div>
            </div>
            <div>
              <IoHourglassOutline />
              <div>
                {power.durations.map((e) => (
                  <Link
                    feature={e}
                    table="durations"
                  />
                ))}
              </div>
            </div>
            <div>
              <GiStarSwirl />
              <div>
                {power.effects.map((e) => (
                  <Link
                    feature={e}
                    table="effects"
                  />
                ))}
              </div>
            </div>
          </div>
          <div
            style={{ gridArea: "desc" }}
            className="dashed description">
            {generatePowerDescription(power)}
          </div>
        </div>
      }
      items={menu}
    />
  );
};

function generatePowerDescription(power) {
  return `${power.effects
    .map((e) => e.description)
    .join("\n")} ${power.ranges.map((r) => r.description)}`;
}

const PowerTags = ({ power }) => {
  const { character } = useCharacter();
  const tags = _.intersectionBy(
    _.flatten(character.classes.map((f) => f.tags)),
    _.flatten(power.effects.map((t) => t.tags)),
    "id"
  );
  return (
    <div
      className={css`
        margin-left: 5px;
        svg {
          height: 15px;
          width: 15px;
        }
      `}>
      {tags.map((t) => (
        <Tag
          id={t.id}
          name={t.title}
        />
      ))}
    </div>
  );
};
