import { Metadata, Radio } from "@interface/ui";

import _ from "lodash";
import { useItem } from "contexts";

export default () => {
  const { edit, item } = useItem();
  const { enabled } = edit;
  const types = [
    { label: "None", value: "None" },
    { label: "Light", value: "Light" },
    { label: "Medium", value: "Medium" },
    { label: "Heavy", value: "Heavy" }
  ];
  const current = _.find(types, (a) => a.value == item.class);
  return (
    <Metadata
      pairs={[
        [
          "Class",
          <Radio
            data={types}
            current={current}
            valuePath={"value"}
            labelPath={"label"}
            onChange={enabled && edit.generator("class", (e) => e)}
          />
        ]
      ]}
    />
  );
};
