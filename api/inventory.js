import { Router } from "express";
import { db } from "../database/connections.js"

const app=Router()



app.post("/data/inventory/add", async (req, res) => {
    var item = req.body;
    const char = req.query.character;
    const table = req.query.table;
    if (item.damage) {
      item = {
        ...Object.fromEntries(Object.keys(item).map((k) => [k, item[k]])),
        damage_types: {
          connect: item.damage_types
        }
      };
    }
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
    res.send("Inventory updated.");
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