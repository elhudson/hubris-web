import { Router } from "express";
import { db, notion } from "../database/connections.js";
import schema from "../database/schema.js";
import { prisma_safe, sql_safe, sql_danger } from "utilities";
import _ from "lodash";

const app = Router();

app.get("/data/rules", async (req, res) => {
  const scheme = await schema();
  const table = db[prisma_safe(req.query.table)];
  const fields = scheme[prisma_safe(req.query.table)];
  if (req.query.relations) {
    var query = req.query.query
      ? await table.findMany({
          ...JSON.parse(req.query.query),
          include: Object.fromEntries(fields.map((f) => [f, true]))
        })
      : await table.findMany({
          include: Object.fromEntries(fields.map((f) => [f, true]))
        });
  } else {
    var query = req.query.query
      ? await table.findMany({
          ...JSON.parse(req.query.query)
        })
      : await table.findMany();
  }
  res.json(query);
});

app.get("/data/tables", async (req, res) => {
  const tabls = await notion.databases
    .query({
      database_id: process.env.NOTION_DB,
      filter: {
        property: "Wiki",
        checkbox: {
          equals: true
        }
      }
    })
    .then((t) =>
      t.results
        .filter((f) => f.title != undefined)
        .map((d) => d.title[0].plain_text)
    );
  res.json(tabls);
});

app.post("/data/query", async (req, res) => {
  const query = req.body;
  const method = req.query.method;
  const table = req.query.table;
  const q = query
    ? await db[prisma_safe(table)][method](query)
    : await db[prisma_safe(table)][method]();
  res.json(q);
});

app.get("/data/table", async (req, res) => {
  const feature = req.query.id;
  const data = await notion.pages
    .retrieve({
      page_id: feature
    })
    .then((page) => page.parent.database_id)
    .then(
      async (parent) => await notion.databases.retrieve({ database_id: parent })
    )
    .then((par) => sql_safe(par.title[0].plain_text));
  res.send(data);
});

export default app;
