import { db } from "./connections.js";
import { prisma_safe, sql_safe } from "utilities";
import fs from "fs";

const tables = await db.rules.findMany();

const index = {};
for (var { title } of tables) {
  const res = await db[prisma_safe(sql_safe(title))].findMany({
    select: {
      id: true,
    },
  });
  for (var r of res) {
    index[r.id] = sql_safe(title);
  }
}

fs.writeFileSync("./database/index.json", JSON.stringify(index));
