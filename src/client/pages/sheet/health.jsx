import { useCharacter } from "@contexts/character";

import { get_max_hp } from "utilities";
import _ from "lodash";
import { useAsync } from "react-async-hook";
import * as radio from "@radix-ui/react-radio-group";
import * as select from "@radix-ui/react-select";

const Health = () => {
  const { character } = useCharacter();
  return (
    <>
      <h3>Health</h3>
      <div>
        <h4>HP</h4>
        <div>
          <b>Current:</b> {character.health.hp}
        </div>
        <div>
          <b>Max:</b> {get_max_hp(character)}
        </div>
      </div>
      <div>
        <h4>HD</h4>
        {character.HD.map((h) => (
          <Hit_Dice die={h} />
        ))}
      </div>
      <div>
        <h4>Injuries</h4>
        <Injuries injury={character.health.injuries} />
      </div>
    </>
  );
};

const Hit_Dice = ({ die }) => {
  const hd = useAsync(
    async () => await fetch("/data/rules?table=hit_dice").then((j) => j.json())
  );
  return (
    <div>
      <div>
        <input
          type="number"
          value={die.max}
        />
        Max
      </div>
      <div>
        <input
          type="number"
          value={die.used}
        />
        Used
      </div>
      <radio.Root value={die.die.title}>
        {hd.result &&
          hd.result.map((h) => (
            <div>
              <radio.Item
                value={h.title}
                id={h.id}>
                <radio.Indicator>x</radio.Indicator>
              </radio.Item>
              <label>{h.title}</label>
            </div>
          ))}
      </radio.Root>
    </div>
  );
};

const Injuries = ({ injury }) => {
  const { update } = useCharacter();
  const injuries = useAsync(
    async () => await fetch("/data/rules?table=injuries").then((j) => j.json())
  );
  const handleValueChange = (e) => {
    update((draft) => {
      draft.health.injuries = _.find(injuries.result, (i) => i.id == e);
    });
  };
  return (
    <select.Root
      defaultValue={injury.id}
      onValueChange={handleValueChange}>
      <select.Trigger>{injury.title}</select.Trigger>
      <select.Portal>
        <select.Content>
          <select.Viewport>
            {injuries.result &&
              injuries.result.map((i) => (
                <select.Item value={i.id}>{i.title}</select.Item>
              ))}
          </select.Viewport>
        </select.Content>
      </select.Portal>
    </select.Root>
  );
};

export default Health;
