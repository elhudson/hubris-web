import { Layouts, Loading, Tabs } from "@interface/ui";
import { css, useTheme } from "@emotion/react";

import Initiative from "./initiative";
import {
  Skills,
  Ac,
  Initiative,
  Proficiency,
  Tier,
  Xp,
  Health,
  Attacks,
  Inventory,
  Bio,
  Features,
  Powers,
  Save,
} from "@client/character";
import { characterContext } from "contexts";
import { useImmer } from "use-immer";
import { useParams } from "react-router-dom";
import Profile from "./profile";

const components = () => {
  const { classes } = useTheme();
  return [
    { title: "Skills & Abilities", content: <Skills /> },
    { title: "Health", content: <Health /> },
    {
      title: "Progression",
      content: (
        <div
          css={css`
            > * {
              margin-bottom: 5px;
            }
          `}
        >
          <Proficiency />
          <Xp />
          <div css={classes.elements.selectbox}>
            <label>Tier</label>
            <Tier />
          </div>
        </div>
      ),
    },
    {
      title: "Combat",
      content: (
        <>
          <Layouts.Row>
            <Ac />
            <Initiative />
          </Layouts.Row>
          <Attacks />
        </>
      ),
    },
    { title: "Inventory", content: <Inventory /> },
    { title: "Bio", content: <Bio /> },
    { title: "Features", content: <Features /> },
    { title: "Powers", content: <Powers /> },
  ];
};

const Sheet = ({ ch }) => {
  const [character, update] = useImmer(ch);
  const comps = components();
  return (
    <main>
      <characterContext.Provider
        value={{
          character: character,
          update: update,
        }}
      >
        <Profile buttons />
        <Tabs
          css={css`
            > [role="tabpanel"] {
              max-height: 65vh;
            }
          `}
          names={comps.map((c) => c.title)}
          def={comps[0].title}
        >
          {comps.map((c) => c.content)}
        </Tabs>
        <Save />
      </characterContext.Provider>
    </main>
  );
};

export default () => {
  const { id } = useParams();
  const getter = async () =>
    await fetch(`/data/character?id=${id}`).then((j) => j.json());
  return (
    <Loading
      getter={getter}
      render={(character) => <Sheet ch={character} />}
    />
  );
};
