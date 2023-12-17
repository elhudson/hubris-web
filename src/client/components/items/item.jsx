import { rename } from "@components/items/ui";
import { css } from "@emotion/css";

const Item = ({ item, editable = false, update = null }) => {
  const handleRename = editable ? rename(update) : null;
  return (
    <Base
      id={item.id}
      name={item.name}
      description={item.description}
      handleRename={handleRename}
    />
  );
};

export default Item;

export const Base = ({
  id,
  name,
  description,
  handleRename = null,
  children
}) => {
  return (
    <div>
      <input
        type="text"
        id={id}
        value={name}
        onChange={handleRename}
      />
      <div
        className={css`
          [role="radiogroup"] {
            display: flex;
          }
        `}>
        {children}
      </div>
      <p>{description}</p>
    </div>
  );
};
