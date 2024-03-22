import { collectPaginatedAPI, Client } from "@notionhq/client";

import { Prisma } from "@prisma/client";

import { get_fields, notion, parse_page } from "notion";

import "dotenv/config";

import _ from "lodash";

import { db, prisma } from "~db/prisma.js";

import progress from "cli-progress";

import rules from "~db/rules.json" with { type: "json" };
import { prisma_safe, sql_safe } from "~db/utils.js";

import { DateTime } from "luxon";

async function sync({ client = notion } = {}) {
  const model = Prisma.getExtensionContext(this);
  const timestamp = await model.last_updated();
  const cutoff = DateTime.now().minus({ hours: 12 });
  if (timestamp < cutoff) {
    const fields = get_fields(model.$name);
    const notion_id = await client.databases
      .query({
        database_id: process.env.NOTION_CORE_RULES,
        filter_properties: ["Page"],
        filter: {
          property: "Page",
          title: {
            equals: model.$name.replace("_", " "),
          },
        },
      })
      .then((r) => r.results.at(0).id);

    const pages = await collectPaginatedAPI(client.databases.query, {
      database_id: notion_id,
    });

    console.log(`Downloading entries from table ${model.$name}...`);

    const bar = new progress.SingleBar({}, progress.Presets.shades_classic);
    bar.start(pages.length, 0);

    for (var page of pages) {
      const data = await parse_page(page, client);
      model.write({ data, fields });
      bar.update(pages.indexOf(page) + 1);
    }

    bar.stop();

    await db.rules.update({
      where: {
        title: model.$name.replace("_", " "),
      },
      data: {
        last_updated: DateTime.now().toJSDate(),
      },
    });
  }
}

function relations() {
  const model = Prisma.getExtensionContext(this);
  return db.rules.fields({ name: model.$name });
}

async function last_updated() {
  const model = Prisma.getExtensionContext(this);
  const { last_updated } = await db.rules.findFirst({
    where: {
      title: model.$name.replace("_", " "),
    },
    select: {
      last_updated: true,
    },
  });
  return DateTime.fromJSDate(last_updated);
}

function resurface(tbl, result) {
  const { ones, manys, scalars } = db.rules.fields({ name: tbl });
  var current = {};
  if (result?.entry) {
    current = _.omit(
      {
        ...result,
        ...result.entry,
        description:
          result.entry?.description?.content?.map((c) => ({
            ...c,
            link: c.link
              ? {
                  id: c.link.target.id,
                  title: c.link.target.title,
                  src: _.find(
                    Object.keys(c.link.target),
                    (key) => rules.includes(key) && c.link.target[key] != null
                  ),
                }
              : null,
          })) ?? [],
      },
      [
        "entry",
        ...scalars.filter((s) => s.name.includes("Id")).map((s) => s.name),
      ]
    );
  }
  for (var one of ones.filter((m) => _.has(result, m.name))) {
    current[one.name] = resurface(one.type, result[one.name]);
  }
  for (var many of manys.filter((m) => _.has(result, m.name))) {
    current[many.name] = [];
    for (var r of result[many.name]) {
      const res = resurface(many.type, r);
      current[many.name].push(res);
    }
  }
  return current;
}

function nestInclude(query, desc = false) {
  const current = {
    entry: true,
  };
  if (desc) {
    current.entry = {
      include: {
        description: {
          include: {
            content: {
              include: {
                link: {
                  include: {
                    target: {
                      include: Object.fromEntries(rules.map((r) => [r, true])),
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
  }
  if (typeof query == "object") {
    const inclusions = Object.keys(query?.include ?? {}) ?? [];
    inclusions.forEach((inclus) => {
      current[inclus] = nestInclude(query.include[inclus]);
      if (current[inclus]?.where) {
        current[inclus].where = parseWhere(current[inclus]);
      }
    });
  }
  return {
    include: current,
  };
}

function nestWhere(where) {
  Object.keys(where).forEach((key) => {
    if (
      _.intersectionBy(Object.keys(where[key]), ["AND", "OR", "NOT", "lte"])
        .length > 0
    ) {
      where[key] = nestWhere(where[key]);
    }
    if (
      _.intersectionBy(Object.keys(where[key]), ["title", "id", "description"])
        .length > 0
    ) {
      where[key] = _.omit(where[key], ["title", "id", "description"]);
      where[key]?.id && (where[key].entryId = id);
      where[key]?.title &&
        (where[key] = {
          entry: {
            title,
          },
        });
    }
  });
  return where;
}

function parseWhere(query) {
  const where = query?.where ?? {};

  return nestWhere(where);
}

function parseInclude(query) {
  return {
    where: parseWhere(query),
    ...nestInclude(query, true),
  };
}

function withRelations() {
  const model = Prisma.getExtensionContext(this);
  const { ones, manys } = model.relations();
  return Object.fromEntries([...ones, ...manys].map((o) => [o.name, true]));
}

async function all({ relations = true, query = {} } = {}) {
  const model = Prisma.getExtensionContext(this);
  if (relations) {
    query.include = {
      ...query?.include,
      ...model.withRelations(),
    };
  }
  const res = await model.queryMany(query);
  return res;
}

async function get({ id }) {
  const model = Prisma.getExtensionContext(this);
  return await model.queryOne({
    where: {
      entry: {
        id: id,
      },
    },
    include: model.withRelations(),
  });
}

function fields() {
  const self = Prisma.getExtensionContext(this);
  const schema = db.schema();
  return _.find(schema, (f) => f.name == self.$name);
}

async function write({ data, fields: { scalars, ones, manys } }) {
  const model = Prisma.getExtensionContext(this);
  const query = {
    entry: {
      connect: {
        id: data.id,
      },
    },
  };
  scalars.forEach((field) => {
    query[field] = data[field];
  });
  ones.forEach((one) => {
    data[one] = Array.isArray(data[one]) ? data[one].at(0) : data[one];
    data[one] &&
      (query[one] = {
        connectOrCreate: {
          where: {
            entryId: data[one].id,
          },
          create: {
            ..._.omit(data[one], ["id", "description", "title"]),
            entry: {
              connectOrCreate: {
                where: {
                  id: data[one].id,
                },
                create: {
                  id: data[one].id,
                  title: data[one].title,
                },
              },
            },
          },
        },
      });
  });
  manys
    .filter((m) => _.has(data, m))
    .forEach((many) => {
      query[many] = {
        connectOrCreate: data[many].map((d) => ({
          where: {
            entryId: d.id,
          },
          create: {
            ..._.omit(d, ["id", "description", "title"]),
            entry: {
              connect: {
                id: d.id,
              },
            },
          },
        })),
      };
    });
  await prisma.$transaction(async (tx) => {
    await tx[prisma_safe(sql_safe(model.$name))].upsert({
      where: {
        entryId: data.id,
      },
      create: query,
      update: query,
    });
    data?.description &&
      (await db.description.save({
        entryId: data.id,
        description: data.description,
      }));
  });
}

async function purge({ client = notion }) {
  const model = Prisma.getExtensionContext(this);
  const notion_id = await client.databases
    .query({
      database_id: process.env.NOTION_CORE_RULES,
      filter_properties: ["Page"],
      filter: {
        property: "Page",
        title: {
          equals: model.$name.replace("_", " "),
        },
      },
    })
    .then((r) => r.results.at(0).id);
  const items = await collectPaginatedAPI(client.databases.query, {
    database_id: notion_id,
  }).then((p) => p.map((i) => i.id));
  const tdl = await model
    .findMany({
      select: {
        id: true,
      },
    })
    .then((f) => f.filter((c) => !items.includes(c.id)));
  tdl.forEach(
    async (t) =>
      await model.delete({
        where: {
          id: t.id,
        },
      })
  );
}

export default {
  sync,
  purge,
  resurface,
  relations,
  write,
  get,
  all,
  withRelations,
  parseWhere,
  nestInclude,
  parseInclude,
  last_updated,
  fields,
};
