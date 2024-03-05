import { Alignment, Avatar, Menu, Tier } from "@client/character";
import { css, useTheme } from "@emotion/react";

import { Buttons } from "./menu";
import { Link } from "@interface/components";
import { Metadata } from "@interface/ui";
import { Link as Route } from "react-router-dom";
import { calc_xp } from "utilities";
import { useCharacter } from "contexts";

export default ({ buttons = false }) => {
  const { character } = useCharacter();
  const { colors, classes } = useTheme();
  return (
    <div className="profile">
      <Menu>
        <div
          css={css`
            display: flex;
            gap: 5px;
            position: relative;
            padding: 5px;
            border: 1px solid ${colors.accent};
            background-color: ${colors.background};
            min-width: fit-content;
            [class*="Buttons"] {
              position: absolute;
              top: 5px;
              right: 5px;

            }
          `}>
          <Avatar
            id={character.id}
            sz={125}
          />
          <section>
            <Metadata
              css={css`
                span {
                  display: inline;
                  max-width: 100%;
                  min-width: 100px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              `}
              pairs={[
                [
                  "Name",
                  <Route to={`/character/${character.id}`}>
                    {character.biography.name}
                  </Route>
                ],
                character.campaign && [
                  "Campaign",
                  <Route to={`/campaign/${character.campaign.id}`}>
                    {character.campaign.name}
                  </Route>
                ],
                [
                  "Class",
                  character.classes.map((c) => (
                    <Link
                      feature={c}
                      table="classes"
                    />
                  ))
                ],
                [
                  "Backgrounds",
                  character.backgrounds.map((c) => (
                    <Link
                      feature={c}
                      table="backgrounds"
                    />
                  ))
                ],
                ["Alignment", <Alignment />],
                ["Tier", <Tier />],
                [
                  "XP",
                  <span>
                    {calc_xp(character)} / {character.xp_earned}
                  </span>
                ]
              ]}
            />
          </section>
          {buttons && <Buttons />}
        </div>
      </Menu>
    </div>
  );
};
