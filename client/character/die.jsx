import { Loading, Radio } from "@interface/ui";

export default ({ die }) => {
  const hd = async () =>
    await fetch("/data/rules?table=hit_dice").then((j) => j.json());
  return (
    <Loading
      getter={hd}
      render={(hd) => (
        <Radio
          current={die}
          data={hd}
          valuePath={"title"}
          labelPath={"title"}
          inline
        />
      )}
    />
  );
};
