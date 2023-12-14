import { rename } from "@components/items/ui";

const Item = ({ item, editable = false, update = null }) => {
  const handleRename = editable ? rename(update) : null;
  return (
    <>
      <input
        type="text"
        id={item.id}
        value={item.name}
        onChange={handleRename}
      />
      <div>{item.description}</div>
    </>
  );
};

export default Item;
