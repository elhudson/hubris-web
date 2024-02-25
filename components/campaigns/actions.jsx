import campaign from "@actions/campaign.jsx";
import Context from "@ui/context";

export default ({ children }) => {
  const acts = campaign();
  return (
    <>
      <Context
        trigger={children}
        items={acts}
      />
      {acts.map((i) => i.render)}
    </>
  );
};
