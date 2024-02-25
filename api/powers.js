import "dotenv/config";
import fs from "fs";
import { v4 } from "uuid";
import { Router } from "express";
import { db } from "~db/prisma.js";

const app = Router();

app.post("/data/powers/create", async (req, res) => {
  const character = req.query.character;
  await db.powers.create({
    data: {
      id: req.body.id,
      name: req.body.name,
      flavortext: req.body.description,
      creator: {
        connect: {
          id: req.session.user_id
        }
      },
      characters: {
        connectOrCreate: {
          where: {
            charactersId: character
          },
          create: {
            charactersId: character
          }
        }
      },
      ranges: {
        connect: req.body.ranges.map((r) => ({
          id: r.id
        }))
      },
      durations: {
        connect: req.body.durations.map((r) => ({
          id: r.id
        }))
      },
      effects: {
        connect: req.body.effects.map((r) => ({
          id: r.id
        }))
      }
    }
  });
  res.send("Power added to suite.");
});

app.get("/data/powers", async (req, res) => {
  const query = {
    include: {
      effects: true,
      ranges: true,
      durations: true,
      creator: true
    }
  };
  req.query.query && (query.where = JSON.parse(req.query.query));
  const j = await db.powers.findMany(query);
  res.json(j);
});

export default app;
