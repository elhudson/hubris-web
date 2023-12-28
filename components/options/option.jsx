import Checkbox from "@ui/checkbox";
import { useHandler } from "@contexts/options";
import { useCharacter } from "@contexts/character";
import { affordable, owned, satisfies_prereqs } from "utilities";
import Tooltip from "@ui/tooltip";
import { css } from "@emotion/css";

import _ from "lodash";

export default ({ data }) => {
  const handling=useHandler()
  const character=useCharacter()
  var cl;
  if (!(!_.isNull(character) && affordable(data, character.character) && satisfies_prereqs(data, handling.table, character.character))) {
    cl="disabled"
  }
  else {
    cl=""
  }
  return (
    <div className={cl}>
      <div className="inline">
        {!_.isNull(character) && (
          <Checkbox
            disabled={!affordable(data, character.character)}
            checked={owned(data, handling.table, character.character)}
            value={data.id}
            onChange={(e) => handling.handler(e, data.id)}
          />
        )}
        <h4>{data.title}</h4>
        <div>
          <Tooltip preview={data.xp}>XP</Tooltip>{" "}
          {_.has(data, "power") && (
            <>
              / <Tooltip preview={data.power}>Power</Tooltip>
            </>
          )}
        </div>
      </div>
      <div className="description dashed">{data.description}</div>
    </div>
  );
};
