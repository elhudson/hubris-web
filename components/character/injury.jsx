import { useCharacter } from "@contexts/character";

import _ from "lodash";
import { useAsync } from "react-async-hook";
import Select from "@ui/select";

export default ({ injury }) => {
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
    <>
      {injuries.result && (
        <Select
          current={injury}
          options={injuries.result}
          valuePath={"id"}
          displayPath={"title"}
          onChange={handleValueChange}
        />
      )}
    </>
  );
};
