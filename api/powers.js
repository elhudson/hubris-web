import "dotenv/config";
import { Router } from "express";
import { db } from "~db/prisma.js";

const app = Router();

app.post("/data/powers/save", async (req, res) => {
  await db.powers.save(req.body);
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
