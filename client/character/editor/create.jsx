import { Backgrounds, Classes, Stats } from "@client/options";
import { Notif, Tabs } from "@interface/ui";
import { characterContext, useUser } from "contexts";

import { Bio } from "@client/character";
import _ from "lodash";
import { cost } from "@components/options/stats";
import { useImmer } from "use-immer";
import { useTheme } from "@emotion/react";
import { v4 } from "uuid";

export default () => {
  const { user_id, username } = useUser();
  const { classes } = useTheme();
  const [character, update] = useImmer({
    id: v4(),
    user: {
      id: user_id,
    },
    str: -2,
    dex: -2,
    con: -2,
    int: -2,
    wis: -2,
    cha: -2,
    classes: [],
    backgrounds: [],
    biography: {
      name: `${username}'s Character`,
      gender: "",
      alignment: "lg",
      backstory: "",
      appearance: "",
    },
  });
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
    });
    window.location.assign(`/character/${character.id}`);
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
