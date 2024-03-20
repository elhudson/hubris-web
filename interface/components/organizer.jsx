import { Tabs } from "@interface/ui";

export default ({ options, render }) => {
  const names = options.map((path) => path?.title).filter(f=> f!=undefined)
  return (
    <Tabs
      names={names}
      def={names[0]}
    >
      {options
        .filter((o) => options.indexOf(o) < names.length)
        .map((o) => render(o))}
    </Tabs>
  );
};
