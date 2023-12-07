import express from "express";
import ViteExpress from "vite-express";
import { PrismaClient } from "@prisma/client";
import { prisma_safe } from "../../tools.js";
import qs from 'qs'

import 'dotenv/config'
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json())
app.use(express.json())
const db=new PrismaClient()


app.get("/rules", async (req, res) => {
  const table=db[prisma_safe(req.query.table)]
  const query=JSON.parse(req.query.query)
  const found=await table.findMany(query)
  res.json(found)
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
