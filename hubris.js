import express from "express";
import "dotenv/config";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import ViteExpress from "vite-express";

import character from "./api/character.js";
import inventory from "./api/inventory.js";
import user from "./api/user.js";
import rules from "./api/rules.js";
import powers from "./api/powers.js";
import { db } from "./database/connections.js";

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

app.use(character);
app.use(inventory);
app.use(user);
app.use(rules);
app.use(powers);

ViteExpress.listen(app, 3000, () => console.log("HUBRIS is online."));

