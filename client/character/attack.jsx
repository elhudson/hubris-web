import { Action, Description, Tag } from "@interface/components";
import { Icon, Metadata } from "@interface/ui";
import { css, useTheme } from "@emotion/react";

import { GiPlainDagger } from "react-icons/gi";
import _ from "lodash";
import { get_proficiency } from "utilities";
import { useCharacter } from "contexts";

export const Attack = ({
  name,
  speed,
  dmg,
  bonus,
  dtypes,
  icon = null,
  description = null,
}) => {
  return (
    <Action
      title={
        <>
          {icon}
          {name}
        </>
      }
    >
      <section>
        <Metadata
          css={css`
            svg {
              padding-left: 5px;
            }
          `}
          pairs={[
            [
              "Speed",
              <span>
                {speed.fast ? (
                  <>
                    {speed.fast} / {speed.slow}
                  </>
                ) : (
                  speed
                )}
              </span>,
            ],
            [
              "Damage",
              <span>
                {dmg.slow ? (
                  <>
                    {dmg.fast} / {dmg.slow}
                  </>
                ) : (
                  dmg
                )}
                {dtypes.map((d) => (
                  <Tag
                    id={d.id}
                    name={d.title}
                  />
                ))}
              </span>,
            ],
          ]}
        />
      </section>
      <section>{description && <Description text={description} />}</section>
    </Action>
  );
};

export const WeaponAttack = ({ using }) => {
  const { character } = useCharacter();
  const speed = {
    fast: using.heavy ? 10 : 7,
    slow: using.heavy ? 13 : 10,
  };
  const dmg = {
    slow: using.martial ? "2d6 adv" : "1d6 adv",
    fast: using.martial ? "2d6" : "1d6",
  };
  const bonus = character[using.uses] + get_proficiency(character);
  return (
    <Attack
      name={using.name}
      speed={speed}
      dmg={dmg}
      bonus={bonus}
      dtypes={[using.tags]}
      icon={<GiPlainDagger />}
    />
  );
};

export const FeatureAttack = ({ using }) => {
  const { character } = useCharacter();
  const attr = _.find(character.classes, (i) => i.id == using.classes.id)
    .abilities[0].code;
  const bonus = character[attr] + get_proficiency(character);
  const speed = using.ticks ? using.ticks : 10;
  const dmg = using.damage ? using.damage : "1d6";
  const dtypes = using?.tags ?? [];
  const desc = using.description;
  return (
    <Attack
      name={using.title}
      bonus={bonus}
      speed={speed}
      dmg={dmg}
      dtypes={dtypes}
      description={desc}
      icon={
        <Icon
          sz={16}
          id={using.class_PathsId}
        />
      }
    />
  );
};

export default {
  Weapon: WeaponAttack,
  Feature: FeatureAttack,
};
