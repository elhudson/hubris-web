import { get_fields, notion, parse_page } from "notion";

import { Prisma } from "@prisma/client";
import _ from "lodash";
import { collectPaginatedAPI } from "@notionhq/client";
import { db } from "~db/prisma.js";
import progress from "cli-progress";

async function sync({ client = notion }) {
  const model = Prisma.getExtensionContext(this);
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
    await model.write({ data, fields });
    bar.update(pages.indexOf(page) + 1);
  }
  bar.stop();
}

function relations() {
  const model = Prisma.getExtensionContext(this);
  return get_fields(model.$name);
}

async function all({ relations = true, query = {} }) {
  const model = Prisma.getExtensionContext(this);
  const { ones, manys } = model.relations();
  relations &&
    (query.include = Object.fromEntries(
      [...ones, ...manys].map((o) => [o, true])
    ));
  return await model.findMany(query);
}

async function get({ id }) {
  const model = Prisma.getExtensionContext(this);
  const { ones, manys } = model.relations();
  return await model.findFirst({
    where: {
      id: id,
    },
    include: Object.fromEntries([...ones, ...manys].map((o) => [o, true])),
  });
}

async function write({ data, fields: { scalars, ones, manys } }) {
  const model = Prisma.getExtensionContext(this);
  const query = {
    entry: {
      connect: {
        id: data.id,
        title: data.title,
        description: data.description,
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
              connect: {
                id: data[one].id,
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
  await model.upsert({
    where: {
      entryId: data.id,
    },
    create: query,
    update: query,
  });
  await db.description.save({
    entryId: data.id,
    description: data.description,
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

export default { sync, purge, relations, write, get, all };
