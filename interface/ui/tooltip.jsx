import * as tooltip from "@radix-ui/react-tooltip";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";

export default ({ preview, children }) => {
  const { colors } = useTheme();
  return (
    <tooltip.Provider>
      <tooltip.Root>
        <tooltip.Trigger asChild>
          <button
            className={css`
              all: unset;
              &:hover {
                background-color: rgba(0, 0, 0, 0);
              }
              padding: 5px;
            `}>
            {preview}
          </button>
        </tooltip.Trigger>
        <tooltip.Portal>
          <tooltip.Content
            className={
              "shadow " +css`
                max-width: 50vw;
                z-index: 3;
                border: 1px solid ${colors.text};
                padding: 5px;
                background-color: ${colors.background};
                .arrow {
                  fill: ${colors.background};
                }
              `
            }>
            {children}
            <tooltip.Arrow className="arrow" />
          </tooltip.Content>
        </tooltip.Portal>
      </tooltip.Root>
    </tooltip.Provider>
  );
};
