import { useCharacter } from "@contexts/character";
import Radio from "@ui/radio";
import { get_tier } from "utilities";

export default () => {
  const { character } = useCharacter();
  const data = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 }
  ];
  return (
    <div className="inline">
      <h4>Tier</h4>
      <Radio
        data={data}
        current={{ value: get_tier(character) }}
        valuePath="value"
        labelPath="label"
      />
    </div>
  );
};
