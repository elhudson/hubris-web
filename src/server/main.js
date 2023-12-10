import express from "express";
import ViteExpress from "vite-express";
import "dotenv/config";
import session from "express-session";
import { prisma_safe, sql_danger, sql_safe } from "utilities";
import { PrismaClient, Prisma } from "@prisma/client";
import { Client } from "@notionhq/client";
import cookieParser from "cookie-parser";
import _ from "lodash";
import bodyParser from "body-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "ajradcliffe",
    cookie: {}
  })
);

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
      m.fields.filter((f) => tabls.includes(f.name)).map((n) => n.name)
    ])
  );
  return schema;
};

app.get("/data/rules", async (req, res) => {
  const scheme = await schema();
  const table = db[prisma_safe(req.query.table)];
  const fields = scheme[prisma_safe(req.query.table)];
  const query = req.query.query
    ? await table.findMany({
        ...JSON.parse(req.query.query)
      })
    : await table.findMany({
        include: Object.fromEntries(fields.map((f) => [f, true]))
      });
  res.json(query);
});

app.get("/data/tables", async (req, res) => {
  const tabls = await notion.databases
    .query({
      database_id: process.env.NOTION_DB
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
      backgrounds: {
        include: {
          background_features: true
        }
      },
      effects: true,
      ranges: true,
      durations: true,
      health: true,
      inventory: true,
      class_features: true,
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
          tags: true
        }
      }
    }
  });
  res.json(query);
});

app.post("/data/character", async (req, res) => {
  const data = req.body;
  console.log(data);
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
    res.redirect("/");
  } else {
    res.redirect("/?error");
  }
});

app.get("/login", (req, res) => {
  res.json({
    username: req.session.user,
    logged_in: !(_.isNull(req.session.user) || _.isUndefined(req.session.user))
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
