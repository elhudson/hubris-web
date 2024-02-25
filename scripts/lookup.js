import { db } from "./connections.js";
import { prisma_safe, sql_safe } from "utilities";

const tables = await db.rules.findMany();

const index = [];
for (var { title } of tables) {
  const res = await db[prisma_safe(sql_safe(title))].findMany({
    select: {
      id: true
    }
  });
  for (var r of res) {
    index.push({
      id: r.id,
      table: sql_safe(title)
    });
  }
}

await db.index.deleteMany({});
await db.index.createMany({
  data: index
});
