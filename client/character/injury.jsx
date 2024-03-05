import { Loading, Select } from "@interface/ui";

import _ from "lodash";
import { useCharacter } from "contexts";

export default ({ injury }) => {
  const { update } = useCharacter();
  const injuries = async () =>
    await fetch("/data/rules?table=injuries").then((j) => j.json());
  return (
    <Loading
      getter={injuries}
      render={(injuries) => (
        <Select
          current={injury}
          options={injuries}
          valuePath={"id"}
          displayPath={"title"}
          onChange={(e) => {
            update((draft) => {
              draft.health.injuries = _.find(injuries.result, (i) => i.id == e);
            });
          }}
        />
      )}
    />
  );
};
