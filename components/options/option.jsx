import Checkbox from "@ui/checkbox";

export default ({ data, avail, owned, buy }) => {
  return (
    <div>
      <Checkbox
        disabled={!avail}
        checked={owned}
        value={data.id}
        onChange={buy}
      />
      {data.title}
    </div>
  );
};
