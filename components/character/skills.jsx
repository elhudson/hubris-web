import { useCharacter } from "@contexts/character";
import { useAsync } from "react-async-hook";
import { useTheme } from "@emotion/react";
import Skill from "./skill";
import { css } from "@emotion/css";

const Skills = () => {
  const { colors } = useTheme();
  const { character } = useCharacter();
  const abilities = useAsync(
    async () =>
      await fetch("/data/rules?table=abilities&relations=true").then((j) =>
        j.json()
      )
  );
  const skills = useAsync(
    async () =>
      await fetch("/data/rules?table=skills&relations=true").then((j) =>
        j.json()
      )
  );
  return (
    <>
      {abilities.result && (
        <div
          className={css`
            display: grid;
            grid-template-columns: minmax(max-content, 15%) auto;
          `}>
          {abilities.result.map((a) => (
            <>
              <div
                className={css`
                  text-align: center;

                  margin-top: 5px;
                  border: 1px solid ${colors.text};
                  h4 {
                    border-bottom: 1px solid ${colors.text};
                  }
                  > div:last-child {
                    font-size: 40px;
                    height: 100%;
                    vertical-align: middle;
                  }
                `}>
                <h4>{a.title}</h4>
                <div>{character[a.code]}</div>
              </div>
              <ul>
                {skills.result &&
                  skills.result
                    .filter((f) => f.abilities.code == a.code)
                    .map((s) => <Skill skill={s} />)}
              </ul>
            </>
          ))}
        </div>
      )}
    </>
  );
};

export default Skills;
