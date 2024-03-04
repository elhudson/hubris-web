import Link from "@components/link";
import Tooltip from "@ui/tooltip";
import Description from "@components/description";
import { useCharacter } from "@contexts/character";
import { useUser } from "@contexts/user";
import { get_power_cost, generate_power_description } from "utilities";
import { BiTargetLock } from "react-icons/bi";
import { GiStarSwirl } from "react-icons/gi";
import { IoHourglassOutline } from "react-icons/io5";
import _ from "lodash";
import { useTheme, css } from "@emotion/react";
import { powerContext } from "@contexts/power";
import { useImmer } from "use-immer";
import Tags from "./tags";
import Components from "./components";

import Actions from "@components/catalog/powers/actions";

export default ({ pwr }) => {
  const { character } = useCharacter();
  const [power, update] = useImmer(pwr);
  const { colors } = useTheme();
  const { classes } = useTheme();
  return (
    <powerContext.Provider value={{ power: power, update: update }}>
      <Actions>
        <div
          css={css`
            border: 1px solid ${colors.accent};
            min-width: 100px;
            display: grid;
            grid-template-areas:
              "header header header header header"
              "desc desc desc desc props"
              "desc desc desc desc props";
          `}>
          <div
            css={css`
              grid-area: header;
              position: relative;
              border-bottom: 1px solid ${colors.accent};
              padding: 2px 5px;
            `}>
            <h6 style={{ display: "flex" }}>
              {power.name}
              <Tags />
            </h6>
            <div
              css={css`
                position: absolute;
                top: 2px;
                right: 5px;
              `}>
              <Tooltip preview={get_power_cost(power)}>Power</Tooltip>
              <span> / </span>
              <Tooltip preview={10 + character.burn + get_power_cost(power)}>
                DC
              </Tooltip>
            </div>
          </div>
          <Components />
          <section
            css={[classes.decorations.dashed, classes.elements.description]}>
            <Description text={generate_power_description(power)} />
          </section>
        </div>
      </Actions>
    </powerContext.Provider>
  );
};
