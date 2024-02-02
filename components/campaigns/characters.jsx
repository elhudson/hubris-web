import Profile from "@components/character/profile";
import { characterContext } from "@contexts/character";
import { useCampaign } from "@contexts/campaign";
import { css } from "@emotion/css";

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

