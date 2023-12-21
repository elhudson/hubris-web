import express from "express";
import ViteExpress from "vite-express";
import "dotenv/config";
import session from "express-session";
import { extension } from "mime-types";
import fs from "fs";
import { v4 } from "uuid";

import process from "process";
import {
  boost,
  character_update_query,
  get_max_hp,
  prisma_safe,
  sql_danger,
  sql_safe,
  update_hd,
  update_inventory
} from "utilities";
import { PrismaClient, Prisma } from "@prisma/client";
import { Client } from "@notionhq/client";
import cookieParser from "cookie-parser";
import _ from "lodash";
import bodyParser from "body-parser";
import multer from "multer";

const app = express();
const root = process.cwd();

console.log('hello')

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "ajradcliffe",
    cookie: {}
  })
);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const db = new PrismaClient();
const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

const tables = async () =>
  await db.$queryRaw`
    SELECT
      table_name
    FROM
      information_schema.tables
    WHERE
      table_type = "BASE TABLE"
    AND table_schema LIKE "hubris"
  `.then((result) =>
    result.map((d) => d["TABLE_NAME"]).filter((f) => f[0] != "_")
  );

const schema = async () => {
  const tabls = await tables().then((r) => r.map((t) => sql_safe(t)));
  tabls.push("requires", "required_for");
  const schema = Object.fromEntries(
    Prisma.dmmf.datamodel.models.map((m) => [
      prisma_safe(sql_safe(m.name)),
      m.fields
        .filter((f) => tabls.includes(f.name))
        .map((n) => n.name)
        .filter((f) => !f.includes("Id"))
    ])
  );
  return schema;
};

app.get("/data/rules", async (req, res) => {
  const scheme = await schema();
  const table = db[prisma_safe(req.query.table)];
  const fields = scheme[prisma_safe(req.query.table)];
  if (req.query.relations) {
    var query = req.query.query
      ? await table.findMany({
          ...JSON.parse(req.query.query),
          include: Object.fromEntries(fields.map((f) => [f, true]))
        })
      : await table.findMany({
          include: Object.fromEntries(fields.map((f) => [f, true]))
        });
  } else {
    var query = req.query.query
      ? await table.findMany({
          ...JSON.parse(req.query.query)
        })
      : await table.findMany();
  }
  res.json(query);
});

app.get("/data/icons", async (req, res) => {
  const page = await notion.pages.retrieve({ page_id: req.query.id });
  if (page.icon) {
    const svg = await fetch(page.icon.file.url).then((r) => r.text());
    res.setHeader("content-type", "image/svg+xml");
    res.send(svg);
  } else {
    res.send(null);
  }
});

app.get("/data/tables", async (req, res) => {
  const tabls = await notion.databases
    .query({
      database_id: process.env.NOTION_DB,
      filter: {
        property: "Wiki",
        checkbox: {
          equals: true
        }
      }
    })
    .then((t) =>
      t.results
        .filter((f) => f.title != undefined)
        .map((d) => d.title[0].plain_text)
    );
  res.json(tabls);
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);

app.get("/data/characters", async (req, res) => {
  const username = req.query.user;
  const fields = await schema().then((s) => s.characters);
  const include = req.query.detailed
    ? Object.fromEntries(fields.map((f) => [f, true]))
    : null;
  const query = await db.characters.findMany({
    where: {
      user: {
        username: username
      }
    },
    include
  });
  res.json(query);
});

app.get("/data/character", async (req, res) => {
  const id = req.query.id;
  const query = await db.characters.findFirst({
    where: {
      id: id
    },
    include: {
      profile: false,
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
              damage_types: true
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
  query.inventory.weapons.forEach((wpn) => {
    delete wpn.damage_typesId;
  });
  query.HD = _.uniqBy(query.HD, (f) => f.die.title);
  res.json(query);
});

app.post("/data/character/avatar", upload.single("profile"), (req, res) => {
  const id = req.query.id;
  const file = req.file;
  const path = `${root}/public/portraits/${id}.png`;
  fs.writeFileSync(path, file.buffer);
  res.send("Portrait updated.");
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

app.post("/data/query", async (req, res) => {
  const query = req.body;
  const method = req.query.method;
  const table = req.query.table;
  const q = await db[prisma_safe(table)][method](query);
  res.json(q);
});

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
        connect: character.backgrounds.map((s) => ({
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
          id: character.user.id
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

app.post("/login", async (req, res) => {
  const auth = await db.users.findFirst({
    where: {
      username: req.body.user,
      password: req.body.pwd
    }
  });
  if (auth) {
    req.session.user = req.body.user;
    req.session.user_id = auth.id;
    res.redirect("/");
  } else {
    res.redirect("/?error");
  }
});

app.get("/login", (req, res) => {
  res.json({
    username: req.session.user,
    user_id: req.session.user_id,
    logged_in: !(_.isNull(req.session.user) || _.isUndefined(req.session.user))
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.post("/user", (req, res) => {

})

export default app