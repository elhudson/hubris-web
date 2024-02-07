import { Router } from "express";
import { db } from "../database/connections.js"
import query from "../database/queries/item.js"

const app=Router()

app.post("/data/inventory/add", async (req, res) => {
    const item = query(req.body);
    const char = req.query.character;
    const table = req.query.table;
    await db.inventories.update({
      where: {
        charactersId: char
      },
      data: {
        [table]: {
          upsert: {
            where: {
              id: item.id
            },
            create: item,
            update: item
          }
        }
      }
    });
    res.json(req.body)
  });
  
  app.post("/data/inventory/drop", async (req, res) => {
    const item = req.body;
    const table = req.query.table;
    await db[table].delete({
      where: {
        id: item.id
      }
    });
    res.send("Inventory updated.");
  });

  export default app