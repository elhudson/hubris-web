import Link from "@components/link";
import { BiTargetLock } from "react-icons/bi";
import { GiStarSwirl } from "react-icons/gi";
import { IoHourglassOutline } from "react-icons/io5";
import { usePower } from "@contexts/power";
import { css } from "@emotion/react";
import { useTheme } from "@emotion/react";

export default () => {
  const { power } = usePower();
  const { colors } = useTheme();
  return (
    <section
      css={css`
        border: 1px solid ${colors.accent};
        margin: 5px;
        padding: 5px;
        > div {
          display: flex;
          gap: 5px;
        }
      `}>
      <div>
        <BiTargetLock />
        <span>
          {power.ranges.map((e) => (
            <Link
              feature={e}
              table="ranges"
            />
          ))}
        </span>
      </div>
      <div>
        <IoHourglassOutline />
        <span>
          {power.durations.map((e) => (
            <Link
              feature={e}
              table="durations"
            />
          ))}
        </span>
      </div>
      <div>
        <GiStarSwirl />
        <span>
          {power.effects.map((e) => (
            <Link
              feature={e}
              table="effects"
            />
          ))}
        </span>
      </div>
    </section>
  );
};
