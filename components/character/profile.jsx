import Alignment from "./alignment";
import Tier from "./tier";
import Actions, { Buttons } from "./actions";
import { useCharacter } from "@contexts/character";
import Icon from "@ui/icon";
import Avatar from "@components/character/avatar";
import { useTheme, css } from "@emotion/react";
import { calc_xp } from "utilities";

export default () => {
  const { character } = useCharacter();
  console.log(character)
  const { colors, classes } = useTheme();
  const inner = (
    <div
      css={css`
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        position: relative;
        padding: 5px;
        border: 1px solid ${colors.accent};
        background-color: ${colors.background};
        .actions {
          position: absolute;
          right: 0;
          bottom: 0;
        }
      `}>
      <Avatar
        id={character.id}
        sz={125}
      />
      <section>
        <h3>
          <a href={`/character/${character.id}`}>{character.biography.name}</a>
        </h3>
        <div>
          <b>Class </b>
          {character.classes.map((c) => (
            <a href={`/srd/classes/${c.id}`}>
              <label>{c.title}</label>
            </a>
          ))}
        </div>
        <div>
          <b>Backgrounds </b>
          {character.backgrounds.map((c) => (
            <a href={`/srd/backgrounds/${c.id}`}>
              <label>{c.title}</label>
            </a>
          ))}
        </div>
        <div>
          <b>Alignment </b> <Alignment />
        </div>
        <b>Tier </b> <Tier />
        <div>
          <b>XP </b>
          <span>
            {calc_xp(character)} / {character.xp_earned}
          </span>
        </div>
      </section>
    </div>
  );
  return (
    <div className="profile">
      {character.HD ? <Actions>{inner}</Actions> : inner}
    </div>
  );
};
