import { css } from "@emotion/react";
import { characterContext, useCampaign } from "context";
import { Profile } from "@client/character";
export default () => {
  const { campaign } = useCampaign();
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
    </div>
  );
};

