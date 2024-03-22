import { db } from "~db/prisma.js";


// const query = await db.characters.get({
//   id: "87dec9b4-96e4-4d6d-9ff5-3fe53bcadfe8"
// });

// await db.characters.update(query)

await db.effects.sync()