import { useAsync } from "react-async-hook";
import { useCampaign } from "@contexts/campaign";
import Multi from "@ui/multi";
import Notif from "@ui/notif";
import _ from "lodash";

export default () => {
  const { campaign, update } = useCampaign();
  const characters = useAsync(
    async () =>
      await fetch(`/data/query?method=findMany&table=characters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          include: {
            classes: true,
            backgrounds: true,
            effects: true,
            tag_features: true,
            class_features: true,
            ranges: true,
            durations: true,
            skills: true,
            HD: {
              include: {
                die: true
              }
            }
          }
        })
      }).then((ch) => ch.json())
  ).result;

  return (
    <>
      {characters && (
        <Multi
          items={characters}
          labelPath="biography.name"
          valuePath="id"
          currents={campaign.characters}
          onChange={(e) => {
            update((draft) => {
              draft.characters = e.map((v) =>
                _.find(characters, (c) => c.id == v.value)
              );
            });
          }}
        />
      )}
    </>
  );
};
