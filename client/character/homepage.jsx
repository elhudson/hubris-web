import {
  Ac,
  Attacks,
  Bio,
  Features,
  Health,
  Initiative,
  Inventory,
  Powers,
  Proficiency,
  Profile,
  Save,
  Skills,
  Tier,
  Xp,
} from "@client/character";
import { Layouts, Loading, Tabs } from "@interface/ui";
import { css, useTheme } from "@emotion/react";

import { characterContext } from "contexts";
import { useImmer } from "use-immer";
import { useParams } from "react-router-dom";

const Sheet = ({ ch }) => {
  const [character, update] = useImmer(ch);
  const {classes}=useTheme()
  const tabs=[
    { title: "Skills & Abilities", content: <Skills /> },
    { title: "Health", content: <Health /> },
    {
      title: "Progression",
      content: <div>
          <Proficiency />
          <Xp />
          <div css={classes.elements.selectbox}>
            <label>Tier</label>
            <Tier />
          </div>
        </div>
      
    },
    {
      title: "Combat",
      content: 
        <div>
          <Layouts.Row>
            <Ac />
            <Initiative />
          </Layouts.Row>
          <Attacks />
        </div>
      
    },
    { title: "Inventory", content: <Inventory /> },
    { title: "Bio", content: <Bio /> },
    { title: "Features", content: <Features /> },
    { title: "Powers", content: <Powers /> },
  ];
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
          names={tabs.map((c) => c.title)}
          def={tabs[0].title}
        >
          {tabs.map((c) => c.content)}
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
