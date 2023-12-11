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
  const tier=get_tier(ch)
  const con=ch.con
  return 3*tier+con
}

