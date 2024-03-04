import { useAsync } from "react-async-hook";
import Radio from "@ui/radio";

export default ({ die }) => {
  const hd = useAsync(
    async () => await fetch("/data/rules?table=hit_dice").then((j) => j.json())
  ).result;
  return (
    <>
      {hd &&
        <Radio
          current={die}
          data={hd}
          valuePath={"title"}
          labelPath={"title"}
          inline
        />
      }
    </>
  );
};
