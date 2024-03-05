import _ from "lodash";
import { useCharacter } from "contexts"

const Field = ({ label, path }) => {
  const { character, update } = useCharacter();
  const isNumeric = !_.isNaN(_.get(character, path));
  const handleChange = (e) => {
    update((draft) => {
      _.set(draft, path, e.target.value);
    });
  };
  return (
    <div>
      <b>{label}</b>
      <input
        type={isNumeric ? "number" : "text"}
        value={_.get(character, path)}
        onChange={handleChange}
      />
    </div>
  );
};

export default Field;
