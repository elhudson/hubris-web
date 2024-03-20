import { db } from "~db/prisma.js";
import fs from "fs";

const rules = await db
  .srd()
  .then((r) => r.map(({ title }) => title.replace(" ", "_")));

fs.writeFileSync("./prisma/rules.json", JSON.stringify(rules));
