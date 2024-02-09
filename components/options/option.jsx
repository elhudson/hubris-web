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
import Description from "@components/description";

export const OptionHeader = ({
  data,
  table = null,
  showTags = false,
  showTree = false
}) => {
  const handling = useHandler();
  const character = useCharacter();
  var tags;
  if (!_.isNull(character)) {
    if (_.has(data, "tags")) {
      const chartags = _.flatMap(character.character.classes, (c) => c.tags);
      tags = _.intersectionBy(chartags, data.tags, "id");
    }
  }
  if (handling) {
    table = handling.table;
  } else {
    table = table == null ? useParams().table : table;
  }
  if (tags == null) {
    tags = data.tags;
  }
  return (
    <div
      css={css`
        margin: 5px;
        position: relative;
      `}>
      {!_.isNull(character) && (
        <Checkbox
          checked={owned(data, handling.table, character.character)}
          value={data.id}
          onChange={(e) => handling.handler(e, data.id)}
        />
      )}
      <h4>
        <Link
          feature={data}
          table={table}>
          {data.title}
        </Link>
      </h4>
      <div>
        <Tooltip preview={data.xp}>XP</Tooltip>
        {_.has(data, "power") && (
          <>
            {" "}
            / <Tooltip preview={data.power}>Power</Tooltip>
          </>
        )}
      </div>
      <div
        css={css`
          position: absolute;
          right: 0;
        `}>
        {showTree &&
          data.trees.map((t) => (
            <Tag
              id={t.id}
              name={t.title}
            />
          ))}
        {_.has(data, "tags") &&
          (showTags ? (
            tags.map((t) => (
              <Tag
                id={t.id}
                name={t.title}
              />
            ))
          ) : (
            <Dropdown
              trigger={<IoPricetagsSharp />}
              dir={"left"}>
              {tags.map((t) => (
                <Tag
                  id={t.id}
                  name={t.title}
                />
              ))}
            </Dropdown>
          ))}
      </div>
    </div>
  );
};

export default ({ data, table = null, withHeader = true }) => {
  const handling = useHandler();
  const character = useCharacter();
  const { classes } = useTheme();
  var cl;
  if (!_.isNull(character)) {
    if (
      !(
        affordable(data, character.character) &&
        satisfies_prereqs(data, handling.table, character.character)
      )
    ) {
      cl = "disabled";
      if (owned(data, handling.table, character.character)) {
        cl = "owned";
      }
    }
  } else {
    cl = "";
  }

  return (
    <div className={cl}>
      {withHeader && (
        <OptionHeader
          data={data}
          table={table}
        />
      )}
      <div css={[classes.decorations.dashed, classes.elements.description]}>
        {data.description && <Description text={data.description} />}
      </div>
    </div>
  );
};
