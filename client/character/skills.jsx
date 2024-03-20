import { css, useTheme } from "@emotion/react";

import { Loading } from "@interface/ui";
import { Skill } from "@client/character";
import { useCharacter } from "contexts";

const Skills = ({ onChange = null }) => {
  const { colors } = useTheme();
  const { character } = useCharacter();
  const data = async () => {
    const attrs = await fetch(
      "/data/rules?table=attributes&relations=true"
    ).then((j) => j.json());
    const skills = await fetch("/data/rules?table=skills&relations=true").then(
      (j) => j.json()
    );
    return { attrs, skills };
  };
  return (
    <Loading
      getter={data}
      render={({ attrs, skills }) => (
        <div
          css={css`
            display: grid;
            grid-template-columns: repeat(3, auto);
            grid-gap: 10px;
            .skills {
              margin-top: 5px;
              padding-left: 5px;
              border-left: 1px solid ${colors.accent};
            }
          `}>
          {attrs.map((a) => (
            <section>
              <div
                css={css`
                  text-align: center;
                  border: 1px solid ${colors.accent};
                  h4 {
                    border-bottom: 1px solid ${colors.accent};
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
              <div className="skills">
                {skills
                  .filter((f) => f.attributes.code == a.code)
                  .map((s) => (
                    <Skill
                      skill={s}
                      onCheck={onChange}
                    />
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}
    />
  );
};

export default Skills;
