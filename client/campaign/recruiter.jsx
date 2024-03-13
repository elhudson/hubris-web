import { Loading, Multi } from "@interface/ui";

import _ from "lodash";
import { useCampaign } from "context";

export default () => {
  const { campaign, update } = useCampaign();
  const characters = async () =>
    await fetch(`/data/query?method=findMany&table=characters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        include: {
          classes: true,
          backgrounds: true,
          effects: {
            include: {
              range: true,
              duration: true
            }
          },
          tag_features: true,
          class_features: true,
          ranges: true,
          durations: true,
          skills: true,
          HD: {
            include: {
              die: true,
            },
          },
        },
      }),
    }).then((ch) => ch.json());

  return (
    <Loading
      getter={characters}
      render={(characters) => (
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
    />
  );
};
