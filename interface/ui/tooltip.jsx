import * as tooltip from "@radix-ui/react-tooltip";
import { useTheme, css } from "@emotion/react";

export default ({ preview, children }) => {
  const { colors } = useTheme();
  return (
    <tooltip.Provider>
      <tooltip.Root>
        <tooltip.Trigger asChild>
          <button
            css={css`
              all: unset;
              &:hover {
                background-color: rgba(0, 0, 0, 0);
              }
            `}>
            {preview}
          </button>
        </tooltip.Trigger>
        <tooltip.Portal>
          <tooltip.Content
            css={css`
              z-index: 2;
              max-width: 50vw;
              border: 1px solid ${colors.text};
              padding: 5px;
              background-color: ${colors.background};
              .arrow {
                margin-top: -1px;
                polyline {
                  fill: ${colors.background};
                  stroke: ${colors.text};
                  stroke-width: 1.5px;
                }
              }
            `}>
            {children}
            <tooltip.Arrow
              className="arrow"
              asChild>
              <svg>
                <polyline points="0,0 15,10 30,0" />
              </svg>
            </tooltip.Arrow>
          </tooltip.Content>
        </tooltip.Portal>
      </tooltip.Root>
    </tooltip.Provider>
  );
};
