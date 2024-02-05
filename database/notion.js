import { Client } from "@notionhq/client";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import _ from "lodash";
import fs from "fs";
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

async function load_notion(number = 40) {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN
  });
  const dbs = await get_tables(notion);
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
    await db.upsert({
      where: {
        id: e.id
      },
      update: e,
      create: e
    });
  }
}
