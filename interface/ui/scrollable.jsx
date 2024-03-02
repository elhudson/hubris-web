import { useTheme, css } from "@emotion/react";

export default ({ children }) => {
  const { colors, palette, classes } = useTheme();
  return (
    <div
      css={css`
        height: inherit;
        max-height: inherit;
        width: inherit;
        max-width: inherit;
        width: auto;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: transparent transparent;
        &:hover {
          scrollbar-width: thin;
          scrollbar-color: ${palette.accent2} transparent;
          
        }
      `}>
      {children}
    </div>
  );
};
