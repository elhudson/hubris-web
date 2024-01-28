import { useUser } from "@contexts/user";
import { useAsync } from "react-async-hook";
import ui from "interface";
import Link from "@components/link";
import { css } from "@emotion/css";
import { campaignContext } from "@contexts/campaign";

export default () => {
  const user = useUser();
  const campaigns = useAsync(
    async () =>
      await fetch(`/data/campaigns?user=${user.username}`).then((h) => h.json())
  ).result;
  return (
    <>
      {campaigns && (
        <div className="container inline">
          {campaigns.map((c) => (
            <campaignContext value={{ campaign: c }}>
              <div
                className={
                  "bordered " +
                  css`
                    width: fit-content;
                    h4 {
                      font-size: 16px;
                      text-align: center;
                      text-transform: uppercase;
                    }
                    label {
                      font-weight: bold;
                    }
                  `
                }>
                <h4>
                  <a href={`/campaign/${c.id}`}>{c.name}</a>
                </h4>
                <div className="thumbnail">
                  <img src={`/public/campaigns/${c.id}.jpg`} />
                </div>
                <ui.Notepad text={c.description} />
                <div>
                  <label>Settings</label>
                  <span>
                    {c.settings.map((s) => (
                      <Link
                        feature={s}
                        table="settings"
                      />
                    ))}
                  </span>
                </div>
              </div>
            </campaignContext>
          ))}
        </div>
      )}
    </>
  );
};
