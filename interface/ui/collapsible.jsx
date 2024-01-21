import * as Collapsible from "@radix-ui/react-collapsible";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";

export default ({ preview, children }) => {
  const { colors } = useTheme();
  return (
    <Collapsible.Root
      className={css`
        border: 1px solid ${colors.accent};
        margin: 5px;
        > button {
          all: unset;
          padding: 5px;
          font-size: 16px;
          width:100%;
        }
      `}>
      <Collapsible.Trigger>{preview}</Collapsible.Trigger>
      <Collapsible.Content>{children}</Collapsible.Content>
    </Collapsible.Root>
  );
};
