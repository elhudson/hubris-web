import { db } from "./connections.js";
import { prisma_safe } from "utilities";
import fs from 'fs'

const tables=JSON.parse(fs.readFileSync('./database/tables.json'))

const index={}
for (var table of tables) {
    const res=await db[prisma_safe(table)].findMany({
        select: {
            id: true
        }
    })
    for (var r of res)  {
        index[r.id]=table
    }
}

fs.writeFileSync('./database/index.json', JSON.stringify(index))