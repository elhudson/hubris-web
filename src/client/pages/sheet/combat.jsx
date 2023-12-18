import { useCharacter } from "@contexts/character";
import { get_ac, get_proficiency, get_tier } from "utilities";
import _ from "lodash";
import { css } from "@emotion/css";
import Tag from "@components/tag";
import { useTheme } from "@emotion/react";

const Combat = () => {
  const { character } = useCharacter();
  const armor = _.find(character.inventory.armor, (f) => f.equipped);
  const ac = get_ac(character, armor);
  return (
    <>
      <div
        className={css`
          display: flex;
          > * {
            width: 50%;
            margin: 5px;
          }
        `}>
        <div>
          <h4>AC</h4>
          <div className="bordered number">{ac}</div>
        </div>
        <div>
          <h4>Initiative</h4>
          <div className="bordered number">+ {character.dex}</div>
        </div>
      </div>
      <div>
        <h4>Attacks</h4>
        <div>
          {character.inventory.weapons.map((w) => (
            <WeaponAttack using={w} />
          ))}
          {character.class_features
            .filter((c) => c.damage_types.length > 0)
            .map((c) => (
              <FeatureAttack using={c} />
            ))}
        </div>
      </div>
    </>
  );
};

export const Attack = ({ name, speed, dmg, dtypes, bonus }) => {
  const { colors } = useTheme();
  return (
    <div>
      <h4>{name}</h4>
      <div
        className={css`
          padding-left: 10px;
          border-left: 1.5px solid ${colors.accent};
          label {
            text-decoration: underline;
            text-underline-offset: 2px;
          }
        `}>
        <div>
          <label>Speed</label>
          {speed.fast ? (
            <span>
              {speed.fast} / {speed.slow}
            </span>
          ) : (
            speed
          )}
        </div>
        <div>
          <label>Damage</label>
          {dmg.slow ? (
            <span>
              {dmg.fast} / {dmg.slow}
            </span>
          ) : (
            dmg
          )}
          {dtypes.map((d) => (
            <Tag
              id={d.tagsId}
              name={d.title}
            />
          ))}
        </div>
        <div>
          <label>Bonus</label>
          {bonus}
        </div>
      </div>
    </div>
  );
};
export const WeaponAttack = ({ using }) => {
  const { character } = useCharacter();
  const speed = {
    fast: using.heavy ? 10 : 7,
    slow: using.heavy ? 13 : 10
  };
  const dmg = {
    slow: using.martial ? "2d6 adv" : "1d6 adv",
    fast: using.martial ? "2d6" : "1d6"
  };
  const bonus = character[using.uses] + get_proficiency(character);
  return (
    <Attack
      name={using.name}
      speed={speed}
      dmg={dmg}
      bonus={bonus}
      dtypes={[using.damage_types]}
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
  const dtypes = using.damage_types;
  return (
    <Attack
      name={using.title}
      bonus={bonus}
      speed={speed}
      dmg={dmg}
      dtypes={dtypes}
    />
  );
};

export default Combat;