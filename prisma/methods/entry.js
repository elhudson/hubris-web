import "dotenv/config";

import { Prisma } from "@prisma/client";
import _ from "lodash";
import { collectPaginatedAPI } from "@notionhq/client";
import { db } from "~db/prisma.js";
import { get_description } from "notion";
import progress from "cli-progress";

async function sync({ client }) {
  const model = Prisma.getExtensionContext(this);
  const pages = await client.databases
    .query({
      database_id: process.env.NOTION_CORE_RULES,
    })
    .then(({ results }) =>
      results.map((result) =>
        collectPaginatedAPI(client.databases.query, {
          database_id: result.id,
        })
      )
    )
    .then((p) => Promise.all(p))
    .then((a) => a.flat(1));
  const bar = new progress.SingleBar({}, progress.Presets.shades_classic);
  bar.start(pages.length, 0);
  for (var page of pages) {
    const title = page.properties.Title.title[0].plain_text;
    const entry = {
      id: page.id,
      title: title,
    };
    await model.upsert({
      where: {
        id: page.id,
      },
      update: entry,
      create: entry,
    });
    await db.description.sync({ client, entry });
    bar.update(pages.indexOf(page) + 1);
  }
  bar.stop();
}

export default { sync };
