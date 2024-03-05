import { Create, Menu } from "@client/power";
import { Description, Link } from "@interface/components";
import { Dialog, Loading, Multi } from "@interface/ui";
import { generate_power_description, get_power_cost } from "utilities";
import { powerContext, useUser } from "contexts";

import _ from "lodash";
import { css } from "@emotion/react";
import { useImmer } from "use-immer";
import { useState } from "react";

export default () => {
  const powers = async () => await fetch("/data/powers").then((j) => j.json());
  return (
    <main
      css={css`
        > button {
          width: 100%;
          margin: 5px 0px;
        }
        td {
          vertical-align: top;
          a:not(:last-child)::after {
            content: ", ";
          }
        }
      `}
    >
      <h2>Powers</h2>
      <Loading
        getter={powers}
        render={(powers) => (
          <table>
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
                <Entry pwr={p} />
              ))}
            </tbody>
          </table>
        )}
      />
      <Create />
    </main>
  );
};

export const Entry = ({ pwr }) => {
  const [power, update] = useImmer(pwr);
  return (
    <powerContext.Provider value={{ power, update }}>
      <tr
        css={css`
          > span {
            display: inline-block;
            height: 100%;
            > td {
              height: inherit;
            }
          }
        `}
      >
        <Menu>
          <td>{power.name}</td>
        </Menu>
        <td>
          <Description
            text={
              power.flavortext
                ? power.flavortext
                : generate_power_description(power)
            }
          />
        </td>
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
    </powerContext.Provider>
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          where: {
            user: {
              id: user.user_id,
            },
          },
          select: {
            biography: true,
            id: true,
            effects: true,
            ranges: true,
            durations: true,
          },
        }),
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
            id: power.id,
          },
        },
      };
      await fetch("/data/query?method=upsert&table=powerSet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          where: {
            charactersId: c.id,
          },
          create: pw,
          update: pw,
        }),
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
