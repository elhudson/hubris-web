import { Prisma } from "@prisma/client";
import { collectPaginatedAPI } from "@notionhq/client";
import {
  parse_page,
  get_description,
  get_fields,
  get_page,
  notion
} from "notion";
import _ from "lodash";
import progress from "cli-progress";

async function sync({ client = notion }) {
  const model = Prisma.getExtensionContext(this);
  const { scalars, ones, manys } = get_fields(model.$name);

  const notion_id = await client.databases
    .query({
      database_id: process.env.NOTION_CORE_RULES,
      filter_properties: ["Page"],
      filter: {
        property: "Page",
        title: {
          equals: model.$name.replace("_", " ")
        }
      }
    })
    .then((r) => r.results.at(0).id);
  const pages = await collectPaginatedAPI(client.databases.query, {
    database_id: notion_id
  }).then((p) => p.map((i) => i.id));

  console.log(`Downloading entries from table ${model.$name}...`);

  const bar = new progress.SingleBar({}, progress.Presets.shades_classic);
  bar.start(pages.length, 0);

  for (var id of pages) {
    const page = await get_page(client, id);
    const data = await parse_page(page, client);

    if (scalars.includes("description")) {
      data.description = await get_description(id, client);
    }

    const query = {};

    scalars.forEach((field) => {
      query[field] = data[field];
    });

    ones.forEach((one) => {
      data[one] = Array.isArray(data[one]) ? data[one].at(0) : data[one];
      data[one] &&
        (query[one] = {
          connectOrCreate: {
            where: {
              id: data[one].id
            },
            create: data[one]
          }
        });
    });

    manys
      .filter((m) => _.has(data, m))
      .forEach((many) => {
        query[many] = {
          connectOrCreate: data[many].map((d) => ({
            where: {
              id: d.id
            },
            create: d
          }))
        };
      });

    await model.upsert({
      where: {
        title: data.title,
        id: data.id
      },
      create: query,
      update: query
    });

    bar.update(pages.indexOf(id) + 1);
  }
  bar.stop();
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
          equals: model.$name.replace("_", " ")
        }
      }
    })
    .then((r) => r.results.at(0).id);
  const items = await collectPaginatedAPI(client.databases.query, {
    database_id: notion_id
  }).then((p) => p.map((i) => i.id));
  const tdl = await model
    .findMany({
      select: {
        id: true
      }
    })
    .then((f) => f.filter((c) => !items.includes(c.id)));
  tdl.forEach(
    async (t) =>
      await model.delete({
        where: {
          id: t.id
        }
      })
  );
}

export default {
  sync: sync,
  purge: purge
};
