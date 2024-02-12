import { useAsync } from "react-async-hook";
import Organizer from "@components/organizer";
import List from "@components/list";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useTheme } from "@emotion/react";
import Rule from "@components/rule";
import { css } from "@emotion/css";

export default () => {
  const { colors } = useTheme();
  const features = useAsync(
    async () =>
      await fetch(
        `/data/rules?table=injuries&query=${JSON.stringify({
          include: {
            conditions: true
          }
        })}`
      ).then((t) => t.json())
  ).result;
  return (
    <div>
      {features && (
        <List
          items={features}
          render={(f) => <Rule feature={f} table="injuries" customDesc={makeDesc} />}
        />
      )}
    </div>
  );
};

const makeDesc=(feature)=> {
  return feature.conditions.map(f=> f.description).join(" ")
}
