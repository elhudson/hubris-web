import { Router } from "express";
import "dotenv/config";

import _ from "lodash";
import { db } from "~db/prisma.js";

import schema from "~database/schema.js";

const app = Router();

app.post("/login", async (req, res) => {
  const auth = await db.users.findFirst({
    where: {
      username: req.body.user,
      password: req.body.pwd,
    },
  });
  if (auth) {
    req.session.user = req.body.user;
    req.session.user_id = auth.id;
    res.redirect("/");
  } else {
    res.redirect("/?error");
  }
});

app.post("/register", async (req, res) => {
  const r = await db.users.create({
    data: {
      username: req.body.user,
      password: req.body.pwd,
    },
  });
  req.session.user = r.username;
  req.session.user_id = r.id;
  res.redirect("/");
});

app.get("/login", (req, res) => {
  if (process.env.NODE_ENV != "production") {
    req.session.user = "ehudson19";
    req.session.user_id = "ddd0c0ad-13c4-47d4-bdfb-a343985187d8";
  }
  res.json({
    username: req.session.user,
    user_id: req.session.user_id,
    logged_in: !(_.isNull(req.session.user) || _.isUndefined(req.session.user)),
  });
});

app.get("/data/characters", async (req, res) => {
  const query = await db.users.characters({ username: req.session.user });
  res.json(query);
});

app.get("/data/campaigns", async (req, res) => {
  const campaigns = await db.users.campaigns({
    username: req.session.user,
  });
  res.json(campaigns);
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

export default app;
