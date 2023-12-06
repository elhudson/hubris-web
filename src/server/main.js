import express from "express";
import ViteExpress from "vite-express";
import { PrismaClient } from "@prisma/client";

import 'dotenv/config'

const app = express();
const db=new PrismaClient()

app.get("/hello", async (req, res) => {
  const d=await db.effects.findMany({
    where: {
      power: 1
    }
  })
  res.send(d)
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
