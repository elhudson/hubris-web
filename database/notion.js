import { Client } from "@notionhq/client";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import _ from "lodash";
import {
  prisma_safe,
  sql_danger,
  sql_safe,
  toProperCase,
  relationless,
  relations,
  not_relations,
  simple_relations,
  complex_relations
} from "utilities";

const prisma = new PrismaClient();
String.prototype.toProperCase = toProperCase;

async function load_notion(number = 20) {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN
  });
  const dbs = await notion.databases
    .query({
      database_id: process.env.NOTION_DB
    })
    .then((r) =>
      r.results
        .filter((r) => r.object == "database")
        .map(
          async (r) => await notion.databases.retrieve({ database_id: r.id })
        )
    )
    .then((r) => Promise.all(r));

  const property_parser = ([label, data]) => {
    var extracted;
    const handler = (property, alg) => {
      try {
        return alg(property);
      } catch (Error) {
        return property.type == "number" ? 0 : "";
      }
    };
    switch (data.type) {
      case "title": {
        extracted = handler(data, (d) => d.title[0].plain_text);
        break;
      }
      case "checkbox": {
        extracted = handler(data, (d) => (d.checkbox == true ? true : false));
        break
      }
      case "rich_text": {
        extracted = handler(data, (d) => d.rich_text[0].plain_text);
        break;
      }
      case "select": {
        extracted = handler(data, (d) =>
          label == "Tier"
            ? Number(d.select.name.split("T").at(-1))
            : d.select.name
        );
        break;
      }
      case "number": {
        extracted = handler(data, (d) => d.number);
        break;
      }
      case "relation": {
        extracted = handler(data, (d) => d.relation.map((a) => a.id));
        break;
      }
    }
    return [sql_safe(label), extracted];
  };

  const tables = {};
  for (var table of dbs.slice(0, number)) {
    const title = sql_safe(table.title[0].text.content);
    await notion.databases
      .query({
        database_id: table.id
      })
      .then((c) =>
        c.results.map((a) =>
          Object.fromEntries(
            [["id", a.id]].concat(
              Object.entries(a.properties)
                .filter((f) => f[0] != "Text")
                .map((j) => property_parser(j))
            )
          )
        )
      )
      .then((c) => (tables[title] = c));
  }

  const nestify = (table) => {
    const props = relations(table);
    table.forEach((entry) => {
      props.forEach((prop) => {
        prop == "requires" || prop == "required_for"
          ? (entry[prop] = entry[prop].map((t) =>
              _.find(table, (ta) => ta.id == t)
            ))
          : (entry[prop] = entry[prop].map((t) =>
              _.find(tables[prop], (ta) => ta.id == t)
            ));
      });
    });
  };
  Object.values(tables).forEach((t) => nestify(t));
  return tables;
}

const simple = (entry) => {
  const basics = Object.keys(entry)
    .filter((f) => !Array.isArray(entry[f]))
    .filter((f) => f != "ticks");
  return Object.fromEntries(basics.map((b) => [b, entry[b]]));
};

function prismafy([title, entries]) {
  const singles = simple_relations(entries);
  const basics = not_relations(entries);
  const complex = complex_relations(entries);
  const prismafied = [];
  entries.forEach(function (entry) {
    const prism = simple(Object.fromEntries(basics.map((s) => [s, entry[s]])));
    singles.forEach((item) => {
      if (entry[item].filter((f) => f != null && f != undefined).length > 0) {
        const p = simple(entry[item][0]);
        prism[item] = {
          connectOrCreate: {
            where: {
              id: p.id
            },
            create: p
          }
        };
      }
    });
    complex.forEach((item) => {
      const values = entry[item]
        .filter((n) => n != null && n != undefined)
        .map((i) => simple(i));
      prism[item] = {
        connectOrCreate: values.map((v) => ({
          where: {
            id: v.id
          },
          create: v
        }))
      };
    });
    this.push(prism);
  }, prismafied);
  return {
    title: title,
    entries: prismafied
  };
}

const data = await load_notion();

for (var [title, entries] of Object.entries(data)) {
  const parsed = prismafy([title, entries]);
  const db = prisma[prisma_safe(parsed.title)];
  for (var e of parsed.entries) {
    console.log(e.title);
    await db.upsert({
      where: {
        id: e.id
      },
      update: e,
      create: e
    });
  }
}
