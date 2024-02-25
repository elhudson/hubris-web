import { Router } from "express";
import "dotenv/config";

import _ from "lodash";
import { db } from "~db/prisma.js";
import fs from "fs";
import { upload } from "~api/inbox.js";
const app = Router();

app.post("/data/campaign/cover", upload.single("profile"), (req, res) => {
  const id = req.query.id;
  const file = req.file;
  const path = `${process.cwd()}/public/campaigns/${id}.png`;
  fs.writeFileSync(path, file.buffer);
  res.send("Portrait updated.");
});

app.get("/data/campaign", async (req, res) => {
  const campaign = await db.campaigns.retrieve({ id: req.query.id });
  res.json(campaign);
});

app.post("/data/campaign", async (req, res) => {
  await db.campaigns.save({ data: req.body });
  res.send("Campaign updated.");
});

app.post("/data/campaigns/create", async (req, res) => {
  await db.campaigns.create({ data: req.body });
  res.send("Campaign created.");
});

app.post("/data/campaigns/logbook", async (req, res) => {
  const summaries = req.body;
  const id = req.query.id;
  summaries.forEach(async (summary) => {
    const query = {
      author: {
        connect: {
          id: summary.author.id
        }
      },
      text: summary.text,
      session: summary.session,
      campaign: {
        connect: {
          id: id
        }
      }
    };
    await db.summaries.upsert({
      where: {
        campaignId_session: {
          campaignId: id,
          session: summary.session
        }
      },
      update: query,
      create: query
    });
  });
  res.send("Logbook updated");
});

app.get("/data/campaigns/logbook", async (req, res) => {
  const summaries = await db.summaries.findMany({
    where: {
      campaign: {
        id: req.query.id
      }
    },
    include: {
      author: true
    }
  });
  res.json(summaries);
});

app.get("/data/logbook", async (req, res) => {
  const campaign = req.query.campaign;
  const session = Number(req.query.session);
  const data = await db.summaries.findFirst({
    where: {
      campaignId: campaign,
      session: session
    },
    include: {
      author: true
    }
  });
  res.json(data);
});

export default app;
