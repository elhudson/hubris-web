import * as tabs from "@radix-ui/react-tabs";

export default ({ names, children, def }) => {
  const toVal = (name) => name.toLowerCase().replace(" ", "_");
  return (
    <tabs.Root defaultValue={toVal(def)}>
      <tabs.List className="buttons">
        {names.map((n) => (
          <tabs.Trigger value={toVal(n)}>{n}</tabs.Trigger>
        ))}
      </tabs.List>
      {children.map((c) => (
        <tabs.Content value={toVal(names[children.indexOf(c)])}>
          {c}
        </tabs.Content>
      ))}
    </tabs.Root>
  );
};
