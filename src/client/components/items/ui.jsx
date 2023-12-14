
export const ItemProperty = ({ title, children }) => {
  return (
    <div>
      <h6>{title}</h6>
      <div>{children}</div>
    </div>
  );
};

export const rename = (update) => {
  const handleNameChange = (e) => {
    update((draft) => {
      draft.name = e.target.value;
    });
  };
  return handleNameChange;
};
