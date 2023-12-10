import { useContext } from "react";
import { characterContext } from "../../user";
import { useAsync } from "react-async-hook";
import _ from "lodash";
import { is_proficient, get_bonus } from "utilities";

const Skills = () => {
  const { character } = useContext(characterContext);
  const abilities = useAsync(
    async () => await fetch("/data/rules?table=abilities").then((j) => j.json())
  );
  const skills = useAsync(
    async () => await fetch("/data/rules?table=skills").then((j) => j.json())
  );
  return (
    <>
      <h3>Skills & Abilities</h3>
      {abilities.result &&
        abilities.result.map((a) => (
          <div>
            <b>{a.title}</b>: <input type="number" value={character[a.code]} />
            <ul>
              {skills.result &&
                skills.result
                  .filter((f) => f.abilities.code == a.code)
                  .map((s) => (
                    <li>
                      <input
                        type="checkbox"
                        checked={is_proficient(character, s)}
                      />
                      <input type="number" value={get_bonus(character, s)} />
                      {s.title}
                    </li>
                  ))}
            </ul>
          </div>
        ))}
    </>
  );
};

export default Skills;
