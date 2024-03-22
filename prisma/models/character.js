import { get_proficiency, get_tier } from "~db/utils.js";

import _ from "lodash";

import { get_max_hp } from "utilities";

import { v4 } from "uuid";

class character {
  constructor(data) {
    Object.assign(this, data);
  }
  static tier = (ch = this) => get_tier(ch);
  static proficiency = (ch = this) => get_proficiency(ch);
  static tags = (ch = this) =>
    _.uniqBy(
      _.flatMap(ch.classes, (c) => c.tags),
      "id"
    );
  static max_hp = (ch = this) => get_max_hp(ch);
  static create = ({ user_id, username }) => ({
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
}

export default character;
