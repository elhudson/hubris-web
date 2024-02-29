import actions from "@actions/power";
import Context from "@ui/context";

export default ({ children }) => {
  const acts = actions();
  return (
    <>
      <Context
        items={acts}
        trigger={children}
      />
      {acts.map((i) => i.render)}
    </>
  );
};
