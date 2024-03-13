import { Router } from "express";
import _ from "lodash";
import { db } from "~db/prisma.js";

const app = Router();

app.get("/data/rules", async (req, res) => {
  const { table, relations = false, query = "{}" } = req.query;
  const model = db.table({ name: table });
  const result = await model.all({
    relations: relations,
    query: JSON.parse(query),
  });
  res.json(result);
});

app.get("/data/tables", async (req, res) => {
  const tables = await db.rules.findMany({
    where: {
      config: false,
    },
  });
  res.send(tables.map((t) => t.title));
});

app.get("/data/entry", async (req, res) => {
  const { table, id } = req.query;
  const item = await db.table({ name: table }).get({ id });
  res.json(item);
});

app.post("/data/query", async (req, res) => {
  const { query, method, table } = req.query;
  const model = db.table({ name: table });
  const q = await model[method](query);
  res.json(q);
});

app.get("/data/table", async (req, res) => {
  const table = await db.index.findFirst({
    where: {
      id: req.query.id,
    },
    select: {
      table: true,
    },
  });
  res.send(table?.table);
});

export default app;
