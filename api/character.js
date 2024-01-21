import "dotenv/config";
import fs from "fs";
import { v4 } from "uuid";
import { Router } from "express";
import { db, upload } from "../database/connections.js";

import {
  boost,
  character_update_query,
  get_max_hp,
  update_hd,
  update_inventory
} from "utilities";
import _ from "lodash";

const app = Router();

app.get("/data/character", async (req, res) => {
  const id = req.query.id;
  const query = await db.characters.findFirst({
    where: {
      id: id
    },
    include: {
      profile: false,
      powerset: {
        select: {
          powers: {
            include: {
              effects: {
                include: {
                  tags: true
                }
              },
              durations: true,
              ranges: true
            }
          }
        }
      },
      backgrounds: {
        include: {
          background_features: true,
          skills: true
        }
      },
      effects: {
        include: {
          damage_types: true,
          trees: true,
          tags: true
        }
      },
      ranges: {
        include: {
          trees: true
        }
      },
      durations: {
        include: {
          trees: true
        }
      },
      health: {
        include: {
          injuries: true
        }
      },
      inventory: {
        include: {
          weapons: {
            include: {
              damage_types: {
                include: {
                  tags: true
                }
              }
            }
          },
          armor: true,
          items: true
        }
      },
      class_features: {
        include: {
          damage_types: true,
          classes: true
        }
      },
      tag_features: true,
      HD: {
        include: {
          die: true
        }
      },
      skills: true,
      classes: {
        include: {
          hit_dice: true,
          tags: true,
          abilities: true
        }
      }
    }
  });
  query.HD = _.uniqBy(query.HD, (f) => f.die.title);
  res.json(query);
});

app.post("/data/character", async (req, res) => {
  const char = req.body;
  const id = req.query.id;
  await db.characters.update({
    where: {
      id: id
    },
    data: character_update_query(char)
  });
  await update_inventory(db, char.inventory);
  await update_hd(db, char.HD);
  res.send("Character saved successfully.");
});

app.post("/data/character/avatar", upload.single("profile"), (req, res) => {
  const id = req.query.id;
  const file = req.file;
  const path = `${root}/public/portraits/${id}.png`;
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
  const dtype = await db.damage_Types.findFirst({
    where: {
      title: "Piercing"
    }
  });
  const max_hp = get_max_hp(character);
  await db.characters.create({
    data: {
      ...character,
      xp_earned: 0,
      xp_spent: 6,
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
              damage_types: {
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
      powers: 0,
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
