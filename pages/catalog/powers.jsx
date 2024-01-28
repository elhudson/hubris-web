import { useAsync } from "react-async-hook";
import Link from "@components/link";
import { useUser } from "@contexts/user";
import Dialog from "@ui/dialog";
import Multi from "@ui/multi";
import { htmlToText } from "html-to-text";
import { get_power_cost } from "utilities";
import { css } from "@emotion/css";
import { useImmer } from "use-immer";
import _ from "lodash";
import { useState } from "react";
export default () => {
  const powers = useAsync(
    async () => await fetch("/data/powers").then((j) => j.json())
  ).result;
  return (
    <div>
      <h1 className="pagetitle">Powers</h1>
      {powers && (
        <table
          className={css`
            /* thead th:last-child {
                display:none;
            } */
          `}>
          <thead>
            <th>Name</th>
            <th>Description</th>
            <th>Creator</th>
            <th>Effects</th>
            <th>Ranges</th>
            <th>Durations</th>
            <th>Cost</th>
          </thead>
          <tbody>
            {powers.map((p) => (
              <Entry power={p} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export const Entry = ({ power }) => {
  return (
    <tr>
      <td>{power.name}</td>
      <td>{htmlToText(power.flavortext)}</td>
      <td>{power.creator.username}</td>
      <td>
        {power.effects.map((e) => (
          <Link
            feature={e}
            table="effects"
          />
        ))}
      </td>
      <td>
        {power.ranges.map((e) => (
          <Link
            feature={e}
            table="ranges"
          />
        ))}
      </td>
      <td>
        {power.durations.map((e) => (
          <Link
            feature={e}
            table="durations"
          />
        ))}
      </td>
      <td>{get_power_cost(power)}</td>
      <CharactersMenu power={power} />
    </tr>
  );
};

function canUsePower(character, power) {
  if (_.intersectionBy(character.effects, power.effects, "id").length > 0) {
    if (_.intersectionBy(character.ranges, power.ranges, "id").length > 0) {
      if (
        _.intersectionBy(character.durations, power.durations, "id").length > 0
      ) {
        return true;
      }
    }
  } else {
    return false;
  }
}

const CharactersMenu = ({ power }) => {
  const user = useUser();
  const characters = useAsync(
    async () =>
      await fetch("/data/query?method=findMany&table=characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          where: {
            user: {
              id: user.user_id
            }
          },
          select: {
            biography: true,
            id: true,
            effects: true,
            ranges: true,
            durations: true
          }
        })
      })
        .then((r) => r.json())
        .then((f) => f.filter((c) => canUsePower(c, power)))
  ).result;
  const [chosen, setChosen] = useState(characters ? [characters[0]] : []);
  const handleChange = (e) => {
    setChosen(e.map((c) => _.find(characters, (ch) => ch.id == c.value)));
  };
  const handleSubmit = async () => {
    for (var c of chosen) {
      const pw = {
        charactersId: c.id,
        powers: {
          connect: {
            id: power.id
          }
        }
      };
      await fetch("/data/query?method=upsert&table=powerSet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          where: {
            charactersId: c.id
          },
          create: pw,
          update: pw
        })
      });
    }
  };
  return (
    <Dialog trigger="Add">
      <label>Select a character</label>
      {characters && (
        <Multi
          items={characters}
          currents={chosen}
          valuePath="id"
          labelPath="biography.name"
          onChange={handleChange}
        />
      )}
      <button onClick={handleSubmit}>Save</button>
    </Dialog>
  );
};
