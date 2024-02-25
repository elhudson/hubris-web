import { useAsync } from "react-async-hook";
import List from "@components/list";
import Icon from "@ui/icon";

export default () => {
  const settings = useAsync(
    async () =>
      await fetch(
        `/data/rules?table=settings&query=${JSON.stringify({
          include: {
            backgrounds: true
          }
        })}`
      ).then((t) => t.json())
  ).result;
  return <>{settings && <List items={settings} />}</>;
};
