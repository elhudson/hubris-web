import "dotenv/config";

import { Router } from "express";
import _ from "lodash";
import { character } from "~db.models";
import { create } from "~db/models/character.js";
import { db } from "~db/prisma.js";
import fs from "fs";
import { upload } from "~api/inbox.js";

const app = Router();

app.get("/data/character", async (req, res) => {
  const id = req.query.id;
  const query = await db.characters.get({
    id: id,
  });
  res.json(query);
});

app.post("/data/character", async (req, res) => {
  const char = req.body;
  await db.characters.update(char);
  res.send("Character saved.");
});

app.post("/data/character/avatar", upload.single("profile"), (req, res) => {
  const id = req.query.id;
  const file = req.file;
  const path = `./public/portraits/${id}.png`;
  fs.writeFileSync(path, file.buffer);
  res.send("Portrait updated.");
});

app.post("/data/character/create", async (req, res) => {
  await db.characters.create(req.body);
  res.redirect(`/characters/${req.session.user}`);
});

app.get("/data/character/create", async (req, res) => {
  const character = db.characters.character(create({user_id: req.session.user_id, username: req.session.user}))
  const options = await db.characters.init(character);
  res.json({ character, options });
});

app.post("/data/character/delete", async (req, res) => {
  const id = req.query.id;
  await db.characters.update({
    where: {
      id: id,
    },
    data: {
      health: {
        delete: {},
      },
      HD: {
        deleteMany: {},
      },
      inventory: {
        delete: {},
      },
    },
  });
  await db.characters.delete({
    where: {
      id: id,
    },
  });
  res.send("Character deleted.");
});

app.post("/data/character/options", async (req, res) => {
  switch (req.headers.location) {
    case "update": {
      await db.characters.buyable(req.body).then((r) => res.json(r));
      break;
    }
    case "create": {
      await db.characters.init(req.body).then((r) => res.json(r));
      break;
    }
  }
});

export default app;
