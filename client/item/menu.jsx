import { Actions } from "@client/item";
import { Context } from "@interface/ui";
export default ({ children }) => {
  const acts = Actions();
  return (
    <>
      <Context
        items={acts}
        trigger={children}
      />
      {acts.map((i) => {
        i.render;
      })}
    </>
  );
};
