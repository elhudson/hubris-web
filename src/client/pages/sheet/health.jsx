import { useCharacter } from "@contexts/character";

import { get_max_hp } from "utilities";
import _ from "lodash";
import { useAsync } from "react-async-hook";
import { Radio } from "@ui/radio";
import { Select } from "@ui/select";
import Counter from "@ui/counter";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";

const Health = () => {
  const { character, update } = useCharacter();
  const { colors } = useTheme();
  const incrementHealth = (e) => {
    update((draft) => {
      if (draft.health.hp < get_max_hp(draft)) {
        draft.health.hp += 1;
      }
    });
  };
  const decrementHealth = (e) => {
    update((draft) => {
      if (draft.health.hp > 0) {
        draft.health.hp -= 1;
      }
    });
  };
  return (
    <div>
      <div>
        <h4>HP</h4>
        <Counter
          item={character.health}
          valuePath={"hp"}
          inc={incrementHealth}
          dec={decrementHealth}
          max={get_max_hp(character)}
        />
      </div>
      <div>
        <h4>HD</h4>
        {character.HD.map((h) => (
          <Hit_Dice index={_.indexOf(character.HD, h)} />
        ))}
      </div>
      <Injuries injury={character.health.injuries} />
    </div>
  );
};

const Hit_Dice = ({ index }) => {
  const { character, update } = useCharacter();
  const hd = useAsync(
    async () => await fetch("/data/rules?table=hit_dice").then((j) => j.json())
  );
  const incrementUsed = (e) => {
    update((draft) => {
      if (draft.HD[index].used < draft.HD[index].max) {
        draft.HD[index].used += 1;
      }
    });
  };
  const decrementUsed = (e) => {
    update((draft) => {
      if (draft.HD[index].used > 0) {
        draft.HD[index].used -= 1;
      }
    });
  };
  const current = character.HD[index].die;
  return (
    <>
      <Counter
        item={character.HD[index]}
        valuePath={"used"}
        inc={incrementUsed}
        dec={decrementUsed}
        max={character.HD[index].max}
      />
      {hd.result && (
        <Radio
          current={current}
          data={hd.result}
          valuePath={"title"}
          labelPath={"title"}
          inline
        />
      )}
    </>
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
    <div className="inline">
      <h4>Injuries</h4>
      {injuries.result && (
        <Select
          current={injury}
          options={injuries.result}
          valuePath={"id"}
          displayPath={"title"}
          onChange={handleValueChange}
        />
      )}
    </div>
  );
};

export default Health;
