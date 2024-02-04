import { Router } from "express";
import "dotenv/config";

import _ from "lodash";
import { db, upload } from "../database/connections.js";
import schema from "../database/schema.js";
import fs from "fs"

const app = Router();

app.post("/data/campaign/cover", upload.single("profile"), (req, res) => {
  const id = req.query.id;
  const file = req.file;
  const path = `${process.cwd()}/public/campaigns/${id}.png`;
  fs.writeFileSync(path, file.buffer);
  res.send("Portrait updated.");
});

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
      dm: true,
      creator: true,
      settings: true,
      logbook: {
        include: {
          author: true
        }
      }
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
