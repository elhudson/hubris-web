import { useAsync } from "react-async-hook";
import { useParams } from "react-router-dom";
import { characterContext } from "@contexts/character";
import { useImmer } from "use-immer";
import Tabs from "@ui/tabs";
import Character from "@character";
import { Row } from "@ui/layouts";
import { useTheme, css} from "@emotion/react";

const components = () => {
  const { classes } = useTheme();
  return [
    { title: "Skills & Abilities", content: <Character.skills /> },
    { title: "Health", content: <Character.health /> },
    {
      title: "Progression",
      content: (
        <div css={css`
          >* {
            margin-bottom: 5px;
          }
        `}>
          <Character.proficiency />
          <Character.xp />
          <div css={classes.elements.selectbox}>
            <label>Tier</label>
            <Character.tier />
          </div>
        </div>
      )
    },
    {
      title: "Combat",
      content: (
        <div>
          <Row>
            <Character.ac />
            <Character.initiative />
          </Row>
          <Character.attacks />
        </div>
      )
    },
    { title: "Inventory", content: <Character.inventory /> },
    { title: "Bio", content: <Character.bio /> },
    { title: "Features", content: <Character.features /> },
    { title: "Powers", content: <Character.powers /> }
  ];
};

const Sheet = () => {
  const { id } = useParams();
  const [character, update] = useImmer(null);
  useAsync(
    async () =>
      await fetch(`/data/character?id=${id}`)
        .then((j) => j.json())
        .then((ch) => update(ch))
  );
  const comps = components();
  return (
    <>
      {character != null && (
        <characterContext.Provider
          value={{
            character: character,
            update: update
          }}>
          <Character.profile />
          <Tabs
            names={comps.map((c) => c.title)}
            def={comps[0].title}>
            {comps.map((c) => c.content)}
          </Tabs>
          <Character.save />
          
        </characterContext.Provider>
      )}
    </>
  );
};

export default Sheet;
