import { Client } from "@notionhq/client";
import "dotenv/config";
import fs from "fs";

const client = new Client({
  auth: process.env.NOTION_TOKEN
});

const notion = await client.databases
  .query({
    database_id: process.env.NOTION_DB
  })
  .then((r) =>
    r.results
      .filter((r) => r.object == "database")
      .map(async (r) => await client.databases.retrieve({ database_id: r.id }))
  )
  .then((r) => Promise.all(r));

for (var table of notion) {
  const pages = await client.databases.query({
    database_id: table.id
  });
  const icons_urls = pages.results
    .map((page) => ({
      id: page.id,
      url: page.icon?.file.url
    }))
    .filter((f) => f.url != undefined);
  icons_urls.forEach(async ({ id, url }) => {
    const data = await fetch(url).then((res) => res.text());
    fs.writeFileSync(`./public/icons/${id}.svg`, data);
  });
}
