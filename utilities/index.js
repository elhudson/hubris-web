import _ from "lodash";

export const prisma_safe = (title) => {
  if (title.includes("_")) {
    const s = title.split("_");
    const first = s.at(0);
    var last = s.at(-1).at(0).toUpperCase() + s.at(-1).slice(1);
    return [first, last].join("_");
  } else {
    return title;
  }
};

export function toProperCase() {
  if (this.length == 2) {
    return this.toUpperCase();
  }
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

String.prototype.toProperCase = toProperCase;

export const sql_safe = (title) => title.toLowerCase().replace(" ", "_");
export const sql_danger = (title) => title.replace("_", " ").toProperCase();

export const not_relations = (table) =>
  Object.keys(table[0]).filter((f) => !Array.isArray(table[0][f]));

export const simple_relations = (table) => {
  return relations(table).filter((item) => {
    const entries = table
      .map((f) => f[item])
      .map((e) => e.length)
      .filter((i) => ![0, 1].includes(i));
    return entries.length < 1;
  });
};

export const complex_relations = (table) =>
  relations(table).filter((f) => !simple_relations(table).includes(f));

export const relations = (table) =>
  Object.keys(table[0]).filter((f) => Array.isArray(table[0][f]));

export const relationless = (table) => {
  return table.map((d) =>
    Object.fromEntries(not_relations(table).map((n) => [n, d[n]]))
  );
};

const always_hide = (entry, p) =>
  !p.toLowerCase().includes("id") &&
  !_.isNull(entry[p]) &&
  !["title", "description", "id"].includes(p);

export const basic_props = (entry) =>
  Object.keys(entry).filter(
    (p) =>
      always_hide(entry, p) && !Array.isArray(entry[p]) && !_.isObject(entry[p])
  );

export const single_link_props = (entry) =>
  Object.keys(entry).filter(
    (p) =>
      always_hide(entry, p) && _.isObject(entry[p]) && !Array.isArray(entry[p])
  );

export const multi_link_props = (entry) =>
  Object.keys(entry).filter(
    (p) => always_hide(entry, p) && Array.isArray(entry[p])
  );

export const prop_sorter = (entry) => {
  return {
    basic: basic_props(entry),
    links: {
      single: single_link_props(entry),
      multi: multi_link_props(entry)
    }
  };
};

export function is_proficient(ch, skill) {
  return _.filter(ch.skills, { id: skill.id }).length > 0;
}

export function get_bonus(ch, skill) {
  const base = ch[skill.abilities.code];
  return is_proficient(ch, skill) ? base + get_proficiency(ch) : base;
}

export function get_tier(ch) {
  if (ch.xp_spent < 25) {
    return 1;
  } else if (25 <= ch.xp_spent < 75) {
    return 2;
  } else if (75 <= ch.xp_spent < 125) {
    return 3;
  } else if (125 <= ch.xp_spent < 200) {
    return 4;
  }
}

export function get_proficiency(ch) {
  return get_tier(ch) + 1;
}

export function get_max_hp(ch) {
  const tier = get_tier(ch);
  const con = ch.con;
  return 3 * tier + con;
}

export function get_ac(character, armor) {
  if (armor.class == "None") {
    return 10 + character.dex;
  } else if (armor.class == "Light") {
    return 10 + get_proficiency(character) + character.dex;
  } else if (armor.class == "Medium") {
    return 14 + get_proficiency(character);
  } else {
    return 18 + get_proficiency(character);
  }
}

export const character_update_query = (item) => {
  return {
    biography: item.biography,
    health: {
      update: {
        hp: item.health.hp,
        injuries: {
          connect: item.health.injuries
        }
      }
    },
    xp_earned: item.xp_earned,
    xp_spent: item.xp_spent,
    burn: item.burn,
    classes: {
      connect: item.classes.map((i) => ({
        id: i.id
      }))
    },
    backgrounds: {
      connect: item.backgrounds.map((i) => ({
        id: i.id
      }))
    },
    effects: {
      connect: item.effects.map((i) => ({
        id: i.id
      }))
    },
    ranges: {
      connect: item.ranges.map((i) => ({
        id: i.id
      }))
    },
    durations: {
      connect: item.durations.map((i) => ({
        id: i.id
      }))
    },
    class_features: {
      connect: item.class_features.map((i) => ({
        id: i.id
      }))
    },
    tag_features: {
      connect: item.tag_features.map((i) => ({
        id: i.id
      }))
    },
    skills: {
      connect: item.skills.map((i) => ({
        id: i.id
      }))
    },
    str: item.str,
    dex: item.dex,
    con: item.con,
    int: item.int,
    wis: item.wis,
    cha: item.cha
  };
};

export const update_inventory = async (engine, inventory) => {
  for (var table of ["armor", "weapons", "items"]) {
    for (var item of inventory[table]) {
      if (item.damage_types) {
        item = {
          ...Object.fromEntries(
            Object.keys(item)
              .filter((f) => !f.includes("Id"))
              .map((k) => [k, item[k]])
          ),
          damage_types: {
            connect: item.damage_types
          }
        };
      }
      await engine[table].upsert({
        where: {
          id: item.id
        },
        update: item,
        create: item
      });
    }
  }
};

export const update_hd = async (engine, hd) => {
  for (var kind of hd) {
    const data = {
      used: Number(kind.used),
      max: Number(kind.max),
      src: kind.src,
      owner: {
        connect: {
          id: kind.charactersId
        }
      },
      die: {
        connect: kind.die
      }
    };
    await engine.HD.upsert({
      where: {
        id: kind.id
      },
      update: data,
      create: data
    });
  }
};

export const boost = (c, code) => {
  return c.backgrounds.map((c) => c.abilities.code).includes(code);
};

export const owned = (feature, tabl, char) => {
  return _.isUndefined(char[tabl])
    ? false
    : char[tabl].map((f) => f.id).includes(feature.id);
};

export const affordable = (feature, char) => {
  const budget = char.xp_earned - char.xp_spent;
  return _.isUndefined(feature.xp) || feature.xp <= budget;
};

export const satisfies_prereqs = (feature, table, char) => {
  if (_.isUndefined(feature.requires)) {
    return true;
  } else if (feature.requires.length == 0) {
    return true;
  } else {
    return _.intersectionBy(feature.requires, char[table], "id").length > 0;
  }
};

export const has_tree = (tree, char) => {
  return char.effects.map((c) => c.trees.id).includes(tree.id);
};

export const get_power_cost = ({ ranges, durations, effects }) => {
  const div =
    _.sumBy(ranges, "power") *
    _.sumBy(durations, "power") *
    _.sumBy(effects, "power");
  return div / 5 < 1 ? 1 : Math.floor(div / 5);
};
