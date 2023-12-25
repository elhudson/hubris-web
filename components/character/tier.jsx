import { useCharacter } from "@contexts/character";
import Radio from "@ui/radio";
import { get_tier } from "utilities";

import {
  PiNumberOne,
  PiNumberTwo,
  PiNumberThree,
  PiNumberFour
} from "react-icons/pi";

export default () => {
  const { character } = useCharacter();
  const data = [
    { label: "1", value: 1, icon: <PiNumberOne /> },
    { label: "2", value: 2, icon: <PiNumberTwo /> },
    { label: "3", value: 3, icon: <PiNumberThree /> },
    { label: "4", value: 4, icon: <PiNumberFour /> }
  ];
  return (
    <div className="inline">
      <h4>Tier</h4>
      <Radio
        data={data}
        current={{ value: get_tier(character) }}
        getIcon={(item) => item.icon}
        valuePath="value"
        labelPath="label"
      />
    </div>
  );
};
