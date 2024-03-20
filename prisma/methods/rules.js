import "dotenv/config";
import { get_fields, notion } from "notion";
import { prisma_safe, sql_safe } from "utilities";
import { get_schema } from "~database/schema.js";

import rules from "~db/rules.json" with { type: "json" };

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

function fields({ name }) {
  const fields= get_schema(name)?.fields
  const scalars = fields.filter((f) => f.kind == "scalar");
  const rule_fields = fields.filter(
    (f) => f.kind == "object" && rules.includes(f.type)
  );
  return {
    scalars,
    ones: rule_fields.filter((r) => !r.isList),
    manys: rule_fields.filter((r) => r.isList)
  };
}

export default { sync, fields };
