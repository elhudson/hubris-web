import { useAsync } from "react-async-hook";
import { useCampaign } from "@contexts/campaign";
import Multi from "@ui/multi";
import Notif from "@ui/notif";
import _ from "lodash";
import Popover from "@ui/pop";
import { FaPlusCircle } from "react-icons/fa";

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
            backgrounds: true
          }
        })
      }).then((ch) => ch.json())
  ).result;
  const handleSave = async () =>
    await fetch(`/data/campaign?id=${campaign.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: campaign.name,
        description: campaign.description,
        characters: {
          connect: campaign.characters.map((c) => ({
            id: c.id
          })),
          disconnect: _.xorBy(campaign.characters, characters, "id")
            .map((char) => ({
              id: char.id
            }))
        }
      })
    }).then((b) => b.text());
  return (
    <Popover trigger={<FaPlusCircle />}>
      {characters && (
        <div>
          <label>Add Character</label>
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
        </div>
      )}
      <Notif
        btn="Save Changes"
        func={handleSave}
      />
    </Popover>
  );
};
