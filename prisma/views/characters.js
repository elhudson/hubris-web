import { prisma, db } from "~db/prisma.js";
import _ from "lodash";
import { boost } from "utilities";

import rules from "~db/rules.json" with { type: "json" };

async function create({ model, operation, args, query }) {
  const data = args;
  for (var code of ["str", "dex", "con", "int", "wis", "cha"]) {
    if (_.isUndefined(data[code])) {
      data[code] = boost(data, code) ? -1 : -2;
    }
  }
  await prisma.$transaction([
    query({
      data: {
        ..._.omit(data, ["health", "HD", "inventories"]),
        xp_earned: 6,
        classes: {
          connect: data.classes.map((c) => ({
            entryId: c.id
          }))
        },
        skills: {
          connect: data.backgrounds
            .filter((c) => c.skills?.id)
            .map((s) => ({
              entryId: s.skills.id
            }))
        },
        burn: 0,
        backgrounds: {
          connect: data.backgrounds.map((c) => ({
            entryId: c.id
          }))
        },
        user: {
          connect: {
            id: data.user.id
          }
        }
      }
    }),
    prisma.health.create(data),
    prisma.inventories.create(data)
  ]);
}

function destructure({ fields, query = {} }) {
  Object.keys(query?.include ?? {})
    .filter((f) => fields.includes(f))
    .forEach((tbl) => {
      query.include[tbl] = prisma.characters.parseInclude(
        query.include[tbl],
        true
      );
    });
  query.include.inventory = {
    include: {
      weapons: {
        include: {
          entry: true
        }
      },
      armor: {
        include: {
          entry: true
        }
      },
      items: {
        include: {
          entry: true
        }
      }
    }
  };
  query.where = prisma.characters.parseWhere(query);
  return query;
}

function restructure({ fields, result }) {
  Object.keys(result)
    .filter((f) => fields.includes(f))
    .forEach((key) => {
      result[key] = result[key].map((k) => prisma.characters.resurface(key, k));
    });
  return _.omit(
    {
      ...result,
      inventory: {
        weapons: result.inventory.weapons.map((w) => ({
          ...w.entry,
          ...w
        })),
        armor: result.inventory.armor.map((w) => ({
          ...w.entry,
          ...w
        }))
      }
    },
    Object.keys(result).filter((r) => r.includes("Id"))
  );
}

function getFields() {
  return [
    ...prisma.characters
      .relations()
      .manys.filter((f) => rules.includes(f.type))
      .map((a) => a.name)
  ];
}

async function findMany({ model, operation, args, query }) {
  const fields = getFields();
  const res = await query(destructure({ query: args, fields })).then((result) =>
    result.map((r) => restructure({ fields, result: r }))
  );
  return res;
}

async function findFirst({ model, operation, args, query }) {
  const fields = getFields();
  const res = await query(destructure({ query: args, fields })).then((result) =>
    restructure({ fields, result })
  );
  return res;
}

async function update({ model, operation, args, query }) {
  const character = args;
  const campaign = await db.characters.campaign({
    id: character.id
  });
  await prisma.$transaction([
    query({
      where: {
        id: character.id
      },
      data: {
        biography: character.biography,
        xp_earned: campaign?.xp ?? character.xp_earned,
        burn: character.burn,
        classes: {
          set: character.classes.map((i) => ({
            entryId: i.id
          }))
        },
        backgrounds: {
          set: character.backgrounds.map((i) => ({
            entryId: i.id
          }))
        },
        effects: {
          set: character?.effects.map((i) => ({
            entryId: i.id
          }))
        },
        ranges: {
          set: character?.ranges.map((i) => ({
            entryId: i.id
          }))
        },
        durations: {
          set: character?.durations.map((i) => ({
            entryId: i.id
          }))
        },
        class_features: {
          set: character?.class_features.map((i) => ({
            entryId: i.id
          }))
        },
        tag_features: {
          set: character?.tag_features.map((i) => ({
            entryId: i.id
          }))
        },
        skills: {
          set: character.skills.map((i) => ({
            entryId: i.id
          }))
        },
        str: character.str,
        dex: character.dex,
        con: character.con,
        int: character.int,
        wis: character.wis,
        cha: character.cha
      }
    }),
    prisma.health.update(character),
    prisma.inventories.update(character)
  ]);
}

export default { create, findFirst, findMany, update };
