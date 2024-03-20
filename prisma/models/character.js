import { get_proficiency, get_tier } from "utilities";

import _ from "lodash";
import { v4 } from "uuid";

export function create({ user_id, username }) {
  return {
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
  };
}

const character = (data) => ({
  ...data,
  tier: () => get_tier(data),
  proficiency: () => get_proficiency(data),
  tags: () =>
    _.uniqBy(
      _.flatMap(data.classes, (c) => c.tags),
      "id"
    ),
  create: create
});

export default character;
