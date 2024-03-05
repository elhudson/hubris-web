import { affordable, owned, satisfies_prereqs } from "utilities";
import { useCharacter, useHandler, useRule } from "contexts";

import { Checkbox } from "@interface/ui";
import { forwardRef } from "react";
import { useTheme } from "@emotion/react";

export default forwardRef(({ data }, ref) => {
  const { classes } = useTheme();
  const handling = useHandler();
  const { character } = useCharacter();
  const { table, location } = useRule();
  const cls = [];
  switch (location) {
    case "levelup": {
      if (
        !(
          affordable(data, character) &&
          satisfies_prereqs(data, table, character)
        )
      ) {
        cls.push(classes.decorations.disabled);
      }
      if (owned(data, table, character)) {
        cls.push(classes.decorations.owned);
      }
    }
  }
  return (
    <Checkbox
      checked={owned(data, table, character)}
      value={data.id}
      onChange={(e) => handling.handler(e, data.id)}
    />
  );
});
