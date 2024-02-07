import { get_tables } from "./helpers.js";
import { parse_page } from "./downloader.js";
import { Client, collectPaginatedAPI } from "@notionhq/client";
import { make_query, get_fields } from "./updater.js";
import { prisma_safe } from "utilities";
import { db } from "./connections.js";
import progress from "cli-progress";

const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

const tables = await get_tables(notion).then((t) =>
  t.map((a) => ({
    title: a.title[0].plain_text.replace(" ", "_"),
    id: a.id
  }))
);

for (var { title, id } of tables) {
  console.log(`Downloading entries from table ${title}...`);
  const bar = new progress.SingleBar({}, progress.Presets.shades_classic);

  const fields = get_fields(title);
  const db_name = prisma_safe(title);

  const pages=await collectPaginatedAPI(notion.databases.query, {
    database_id: id
  })

  bar.start(pages.length, 0);

  for (var page of pages) {
    const data = await parse_page(page, notion);
    const query = make_query(fields, data);

    const res=await db[db_name].upsert({
      where: {
        id: data.id
      },
      create: query,
      update: query
    });
    bar.update(pages.indexOf(page) + 1);
  }
  bar.stop();
  console.log(`All entries from table ${title} saved to database.`);
}
