import actions from "@actions/item";
import Context from "@ui/context";

export default ({ children }) => {
  const acts = actions();
  return (
    <Context
      items={acts}
      trigger={children}
    />
  );
};
