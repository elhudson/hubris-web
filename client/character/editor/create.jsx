import { Backgrounds, Classes, Stats } from "@client/options";
import { Notif, Tabs } from "@interface/ui";
import { characterContext, useUser } from "contexts";
import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";

import { Bio } from "@client/character";
import _ from "lodash";
import { cost } from "utilities";
import { useImmer } from "use-immer";
import { useTheme } from "@emotion/react";

export default () => {
  const { classes } = useTheme();
  const [character, update] = useImmer(useLoaderData().character);
  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (_.isUndefined(character.classes) || character.classes.length < 1) {
      return "Please select a class.";
    }
    if (
      _.isUndefined(character.backgrounds) ||
      character.backgrounds.length < 2
    ) {
      return "Please select two backgrounds.";
    }
    var sum = 0;
    for (var code of ["str", "dex", "con", "int", "wis", "cha"]) {
      if (!_.isUndefined(character[code])) {
        sum += cost(character[code]);
      }
    }
    if (sum < 28) {
      return "Please allocate all ability score points.";
    }

    await fetch("/data/character/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(character),
    }).then(() => navigate(`/character/${character.id}`));
  };
  return (
    <characterContext.Provider
      value={{
        character: character,
        update: update,
      }}
    >
      <Tabs
        names={["Classes", "Backgrounds", "Stats", "Biography"]}
        def={"Classes"}
        disabled={character.backgrounds.length < 2 ? ["Stats"] : []}
      >
        <Classes />
        <Backgrounds />
        <Stats />
        <Bio />
      </Tabs>
      <Notif
        func={handleSubmit}
        btn="Submit"
        css={classes.elements.post}
      />
    </characterContext.Provider>
  );
};
