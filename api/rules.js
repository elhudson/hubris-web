import { Router } from "express";
import { db } from "~db/prisma.js";
import schema, { tables } from "~database/schema.js";
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
  const tables = await db.rules.findMany({
    where: {
      config: false
    }
  });
  res.send(tables.map((t) => t.title));
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
  const table = await db.index.findFirst({
    where: {
      id: req.query.id
    },
    select: {
      table: true
    }
  });
  res.send(table?.table);
});

export default app;
