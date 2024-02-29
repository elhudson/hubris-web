import "dotenv/config";
import { notion } from "notion";
import { db } from "~db/prisma.js";

async function sync({ client = notion }) {
  const rules = await client.databases
    .query({
      database_id: process.env.NOTION_CORE_RULES,
      filter: {
        property: "Config",
        checkbox: {
          equals: true
        }
      }
    })
    .then((c) =>
      c.results.map((c) => ({
        id: c.id,
        title: c.title[0].plain_text,
        config: true
      }))
    )
    .then(async (j) =>
      j.concat(
        await client.databases
          .query({
            database_id: process.env.NOTION_CORE_RULES,
            filter: {
              property: "Config",
              checkbox: {
                equals: false
              }
            }
          })
          .then((a) =>
            a.results.map((c) => ({
              id: c.id,
              title: c.title[0].plain_text,
              config: false
            }))
          )
      )
    );
  rules.forEach(async (rule) => {
    await db.rules.upsert({
      where: {
        id: rule.id
      },
      update: rule,
      create: rule
    });
  });
}

export default { sync };
