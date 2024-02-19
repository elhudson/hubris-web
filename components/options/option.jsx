import Checkbox from "@ui/checkbox";
import { useHandler } from "@contexts/options";
import { useCharacter } from "@contexts/character";
import { affordable, owned, satisfies_prereqs } from "utilities";
import Tooltip from "@ui/tooltip";
import Link from "@components/link";
import Dropdown from "@ui/dropdown";
import Tag from "@components/tag";
import _ from "lodash";
import { IoPricetagsSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { css, useTheme } from "@emotion/react";
import { useRule } from "@contexts/rule";
import Description from "@components/description";
import { forwardRef, useEffect } from "react";

export default forwardRef(({ data }, ref) => {
  const { classes } = useTheme();
  const handling = useHandler();
  const character = useCharacter();
  const { table } = useRule();
  useEffect(() => {
    var cl;
    if (!_.isNull(character)) {
      if (
        !(
          affordable(data, character.character) &&
          satisfies_prereqs(data, handling.table, character.character)
        )
      ) {
        cl = classes.decorations.disabled;
      }
        if (owned(data, handling.table, character.character)) {
          cl = classes.decorations.owned;
        
      }
    }
  });
  return (
    <>
      {!_.isNull(character) && (
        <Checkbox
          checked={owned(data, table, character.character)}
          value={data.id}
          onChange={(e) => handling.handler(e, data.id)}
        />
      )}
    </>
  );
});

// export default ({ data, table = null, withHeader = true }) => {
//   const handling = useHandler();
//   const character = useCharacter();
//   const { classes } = useTheme();
//   var cl;
//

//   return (
//     <div className={cl}>
//       {withHeader && (
//         <OptionHeader
//           data={data}
//           table={table}
//         />
//       )}
//       <div css={[classes.decorations.dashed, classes.elements.description]}>
//         {data.description && <Description text={data.description} />}
//       </div>
//     </div>
//   );
// };
