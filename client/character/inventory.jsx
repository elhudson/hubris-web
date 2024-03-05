import { Create, List } from "@client/item";

import { Layouts } from "@interface/ui";
import _ from "lodash";
import { css } from "@emotion/react";
import { useCharacter } from "contexts";

export default () => {
  const { character, update } = useCharacter();
  const { items, armor, weapons } = character.inventory;
  return (
    <Layouts.Sections>
      <Bin
        items={armor}
        type="armor"
        update={update}
      />
      <Bin
        items={weapons}
        type="weapons"
        update={update}
      />
      <Bin
        items={items}
        type="items"
        update={update}
      />
    </Layouts.Sections>
  );
};

const Bin = (props) => {
  const title = props.type.charAt(0).toUpperCase() + props.type.slice(1);
  return (
    <section
      css={css`
        > button {
          float: right;
        }
      `}
    >
      <h3>{title}</h3>
      <Create table={props.type} />
      <List {...props} />
    </section>
  );
};
