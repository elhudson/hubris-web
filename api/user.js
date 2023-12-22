import { Router } from "express";
import "dotenv/config";

import _ from "lodash";
import { db } from "../database/connections.js"
import schema from "../database/schema.js"

const app = Router();

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

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.post("/user", (req, res) => {});

export default app;
