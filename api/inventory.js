import { Router } from "express";
import { db } from "~db/prisma.js";

const app = Router();

app.post("/data/inventory/add", async (req, res) => {
  await db.inventories.add({
    item: req.body,
    character: req.query.character,
    table: req.query.table,
  });
  res.json(req.body);
});

app.post("/data/inventory/drop", async (req, res) => {
  const item = req.body;
  const table = req.query.table;
  await db[table].delete({
    where: {
      id: item.id,
    },
  });
  res.send("Inventory updated.");
});

export default app;
