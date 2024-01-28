import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";

export default ({ campaign }) => {
  const { colors } = useTheme();
  const path = `/public/campaigns/${campaign.id}`;
  return (
    <div
      className={css`
        img {
          object-fit: cover;
          padding: 3px;
        }
        border: 1px solid ${colors.accent};
      `}>
      <image src={path} />
    </div>
  );
};
