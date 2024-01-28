import { Router } from "express";
import "dotenv/config";

import _ from "lodash";
import { db } from "../database/connections.js";
import schema from "../database/schema.js";

const app = Router();

app.get("/data/campaign", async (req, res) => {
  const id = req.query.id;
  const campaign = await db.campaigns.findFirst({
    where: {
      id: id
    },
    include: {
      characters: {
        include: {
          classes: true,
          backgrounds: true
        }
      },
      settings: true
    }
  });
  res.json(campaign);
});

app.post("/data/campaign", async (req, res) => {
  const id = req.query.id;
  await db.campaigns.update({
    where: {
      id: id
    },
    data: req.body
  });
  res.send("Campaign updated.");
});

app.post("/data/campaigns/create", async (req, res) => {
  const data = req.body;
  await db.campaigns.create({
    data: {
      name: data.name,
      description: data.description,
      settings: {
        connect: data.settings.map((s) => ({ id: s.id }))
      },
      creator: {
        connect: {
          id: data.creator.user_id
        }
      },
      dm: {
        connect: {
          id: data.dm.user_id
        }
      }
    }
  });
  res.send("Campaign created.");
});

export default app;
