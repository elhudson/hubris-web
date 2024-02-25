import { db } from "~db/prisma.js";

async function characters({ id }) {
  const chars = await db.characters.retrieve({
    where: {
      user: {
        id: id
      }
    }
  });
  return chars;
}

export default { characters };
