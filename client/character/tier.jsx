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
    { label: "Tier 1", value: 1, icon: <PiNumberOne /> },
    { label: "Tier 2", value: 2, icon: <PiNumberTwo /> },
    { label: "Tier 3", value: 3, icon: <PiNumberThree /> },
    { label: "Tier 4", value: 4, icon: <PiNumberFour /> }
  ];
  return (
    <Radio
      data={data}
      current={{ value: get_tier(character) }}
      getIcon={(item) => item.icon}
      valuePath="value"
      labelPath="label"
    />
  );
};
