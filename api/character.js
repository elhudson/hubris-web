import "dotenv/config";
import fs from "fs";
import { v4 } from "uuid";
import { Router } from "express";
import { db } from "~db/prisma.js";
import { upload } from "~api/inbox.js";

import { boost, get_max_hp } from "utilities";
import _ from "lodash";

const app = Router();

app.get("/data/character", async (req, res) => {
  const id = req.query.id;
  const query = await db.characters.retrieve({
    id: id
  });
  res.json(query);
});

app.post("/data/character", async (req, res) => {
  const char = req.body;
  await db.characters.save({ item: char });
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
  const character = req.body;
  for (var code of ["str", "dex", "con", "int", "wis", "cha"]) {
    if (_.isUndefined(character[code])) {
      character[code] = boost(character, code) ? -1 : -2;
    }
  }
  const uninjured = await db.injuries.findFirst({
    where: {
      title: "Uninjured"
    },
    select: {
      id: true
    }
  });
  const dtype = await db.tags.findFirst({
    where: {
      title: "Piercing"
    }
  });
  const max_hp = get_max_hp(character);
  await db.characters.create({
    data: {
      ...character,
      xp_earned: 6,
      inventory: {
        create: {
          weapons: {
            create: {
              id: v4(),
              martial: character.classes[0].weaponry == "Martial",
              heavy: false,
              name: "Dagger",
              equipped: true,
              uses: "str",
              tags: {
                connect: {
                  id: dtype.id
                }
              }
            }
          },
          armor: {
            create: {
              id: v4(),
              class: "None",
              name: "Unarmored",
              equipped: true
            }
          },
          items: {
            create: []
          }
        }
      },
      HD: {
        create: {
          max: 1,
          used: 0,
          die: {
            connect: {
              id: character.classes[0].hit_dice.id
            }
          }
        }
      },
      classes: {
        connect: character.classes.map((c) => ({
          id: c.id
        }))
      },
      skills: {
        connect: character.backgrounds
          .filter((c) => c.skills != null)
          .map((s) => ({
            id: s.skills.id
          }))
      },
      health: {
        create: {
          hp: max_hp,
          injuries: {
            connect: {
              id: uninjured.id
            }
          }
        }
      },
      burn: 0,
      backgrounds: {
        connect: character.backgrounds.map((c) => ({
          id: c.id
        }))
      },
      user: {
        connect: {
          id: req.session.user_id
        }
      }
    }
  });
  res.redirect(`/characters/${req.session.user}`);
});

app.post("/data/character/delete", async (req, res) => {
  const id = req.query.id;
  await db.characters.update({
    where: {
      id: id
    },
    data: {
      health: {
        delete: {}
      },
      HD: {
        deleteMany: {}
      },
      inventory: {
        delete: {}
      }
    }
  });
  await db.characters.delete({
    where: {
      id: id
    }
  });
  res.send("Character deleted.");
});

export default app;
