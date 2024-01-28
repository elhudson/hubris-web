import { useAsync } from "react-async-hook";
import Profile from "@components/character/profile";
import { characterContext } from "@contexts/character";
import { useCampaign } from "@contexts/campaign";
import Multi from "@ui/multi";
import Notif from "@ui/notif";
import _ from "lodash";
import { useState } from "react";
import { css } from "@emotion/css";
export default () => {
  const { campaign, update } = useCampaign();
  const [state, setState] = useState(false);
  const characters = useAsync(
    async () =>
      await fetch(`/data/query?method=findMany&table=characters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          where: {
            NOT: {
              Campaign: {
                id: campaign.id
              }
            }
          },
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
          }))
        }
      })
    }).then((b) => b.text());
  return (
    <div
      className={css`
        max-height: 75vh;
        overflow: scroll;
        div.profile {
            margin: 5px;
        }
      `}>
      <div>
        {campaign.characters.map((c) => (
          <characterContext.Provider value={{ character: c }}>
            <Profile />
          </characterContext.Provider>
        ))}
      </div>
      {characters && (
        <div>
          <button onClick={() => setState(!state)}>+</button>
          {state && (
            <div>
              <div>
                <label>Add Character</label>
                <Multi
                  items={characters}
                  labelPath="biography.name"
                  valuePath="id"
                  currents={campaign.characters.filter((c) =>
                    characters.map((a) => a.id).includes(c.id)
                  )}
                  onChange={(e) => {
                    update((draft) => {
                      draft.characters = e.map((ch) =>
                        _.find(characters, (c) => c.id == ch.value)
                      );
                    });
                  }}
                />
              </div>
              <Notif
                btn="Save Changes"
                func={handleSave}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
