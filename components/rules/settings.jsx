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
  return (
    <>
      {settings && (
        <List
          items={settings}
          render={(feat) => (
            <Setting
              setting={feat}
            />
          )}
        />
      )}
    </>
  );
};

export const Setting = ({ setting }) => {
  return (
    <div className="dashed">
        <div className="inline"> 
        <h4>{setting.title}</h4>
        <Icon id={setting.id} sz={16} />
        </div>
      <div className="dashed description">{setting.description}</div>
    </div>
  );
};
