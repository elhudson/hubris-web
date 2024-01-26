import Alignment from "./alignment";
import { css } from "@emotion/css";
import Tier from "./tier";
import Actions, { Buttons } from "./actions";
import { useCharacter } from "@contexts/character";
import Icon from "@ui/icon";
import Avatar from "@components/character/avatar";

export default () => {
  const { character } = useCharacter();
  const inner = (
    <div
      className={
        "bordered inline " +
        css`
          position: relative;
    
          .actions {
            position: absolute;
            right: 0;
            bottom: 0;
          }
        `
      }
      style={{ marginBottom: 10 }}>
      <Avatar
        id={character.id}
        sz={125}
      />
      {character.HD && <Buttons />}
      <div>
        <h3>
          <a href={`/character/${character.id}`}>{character.biography.name}</a>
        </h3>
        <div>
          <b>Class</b>{" "}
          {character.classes.map((c) => (
            <a href={`/srd/classes/${c.id}`}>
              <Icon
                sz={15}
                id={c.id}
              />
              <label>{c.title}</label>
            </a>
          ))}
        </div>
        <div>
          <b>Backgrounds</b>{" "}
          {character.backgrounds.map((c) => (
            <a href={`/srd/backgrounds/${c.id}`}>
              <Icon
                sz={15}
                id={c.id}
              />
              <label>{c.title}</label>
            </a>
          ))}
        </div>
        <div>
          <b>Alignment</b> <Alignment />
        </div>
        <Tier />
        <div>
          <b>XP</b>{" "}
          <span>
            {character.xp_spent} / {character.xp_earned}
          </span>
        </div>
      </div>
    </div>
  );
  return <>{character.HD ? <Actions>{inner}</Actions> : inner}</>;
};
