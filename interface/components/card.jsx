import { Rule, Metadata } from "@interface/components";
import { useTheme, css } from "@emotion/react";

export default ({ feature, props }) => {
  const { colors, classes } = useTheme();
  return (
    <div
      css={css`
        border: 1px solid ${colors.accent};
        header {
          padding: 5px;
          border-bottom: 1px solid ${colors.accent};
        }
        section:first-of-type {
          font-size: 12px;
          padding: 5px;
        }
      `}>
      <Rule data={feature}>
        <Metadata
          feature={feature}
          props={props}
        />
      </Rule>
    </div>
  );
};
