import { Components, Menu, Tags } from "@client/power";
import { css, useTheme } from "@emotion/react";
import { generate_power_description, get_power_cost } from "utilities";
import { powerContext, useCharacter } from "contexts";

import { Description } from "@interface/components";
import { Tooltip } from "@interface/ui";
import _ from "lodash";
import { useImmer } from "use-immer";

export default ({ pwr }) => {
  const { character } = useCharacter();
  const [power, update] = useImmer(pwr);
  const { colors } = useTheme();
  const { classes } = useTheme();
  return (
    <powerContext.Provider value={{ power: power, update: update }}>
      <Menu>
        <div
          css={css`
            border: 1px solid ${colors.accent};
            min-width: 100px;
            display: grid;
            grid-template-areas:
              "header header header header header"
              "desc desc desc desc props"
              "desc desc desc desc props";
          `}
        >
          <div
            css={css`
              grid-area: header;
              position: relative;
              border-bottom: 1px solid ${colors.accent};
              padding: 2px 5px;
            `}
          >
            <h6 style={{ display: "flex" }}>
              {power.name}
              <Tags />
            </h6>
            <div
              css={css`
                position: absolute;
                top: 2px;
                right: 5px;
              `}
            >
              <Tooltip preview={get_power_cost(power)}>Power</Tooltip>
              <span> / </span>
              <Tooltip preview={10 + character.burn + get_power_cost(power)}>
                DC
              </Tooltip>
            </div>
          </div>
          <Components />
          <section
            css={[classes.decorations.dashed, classes.elements.description]}
          >
            <Description text={generate_power_description(power)} />
          </section>
        </div>
      </Menu>
    </powerContext.Provider>
  );
};
