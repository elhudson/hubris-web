import { useCharacter } from "@contexts/character";
import Radio from "@ui/radio";
import _ from "lodash";
import List from "@items/set";
import Create from "@items/create";
import { useTheme, css } from "@emotion/react";
import { useState } from "react";

export default () => {
  const { character, update } = useCharacter();
  const { items, armor, weapons } = character.inventory;
  return (
    <>
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
    </>
  );
};

const Bin = (props) => {
  const { classes } = useTheme();
  const title = props.type.charAt(0).toUpperCase() + props.type.slice(1);
  return (
    <section
      css={css`
        h3 {
          ${classes.elements.subhead};
        }
        >button {
          float: right;
        }
      `}>
      <h3>{title}</h3>
      <Create table={props.type} />
      <List {...props} />
    </section>
  );
};
