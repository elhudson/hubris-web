import { get_proficiency, get_tier } from "../utils";

import { Characters } from "@prisma/client";
import _ from "lodash";
import { background } from "./rules/backgrounds";
import { cls } from "./rules/classes";
import { tag } from "./rules/tags";
import { user } from "./user";
import { v4 } from "uuid";

interface Character extends Characters {
  classes?: Array<cls>;
  backgrounds?: Array<background>;
  tags?: Array<tag>;
}

export class character implements Character {
  constructor(data: Character) {
    Object.assign(data, this);
  }
  create(user: user): Character {
    return {
      id: v4(),
      usersId: user.id,
      str: -2,
      dex: -2,
      con: -2,
      int: -2,
      wis: -2,
      cha: -2,
      classes: [],
      backgrounds: [],
      biography: {
        name: `${user.username}'s Character`,
        gender: "",
        alignment: "lg",
        backstory: "",
        appearance: "",
      },
      xp_earned: 6,
      burn: 0,
      font: null,
      campaignId: null,
      updated: new Date(),
    } satisfies Character;
  }
  proficiency(character: Character | this): number {
    return get_proficiency(character);
  }
  tier(character: Character | this): number | undefined {
    return get_tier(character);
  }
  // tags(character: Character | this): Array<tag> {
  //   return _.uniqBy(_.flatMap(character.tags, c=> c.id), "id")
  // }
}
