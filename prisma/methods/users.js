import { db } from "~db/prisma.js";

async function characters({ username }) {
  const chars = await db.characters.get({
    where: {
      user: {
        username: username,
      },
    },
  });
  return chars;
}

async function campaigns({ username }) {
  const include = {
    settings: true,
    dm: true
  };
  const dm = await db.campaigns.findMany({
    where: {
      dm: {
        username: username,
      },
    },
    include,
  });
  const player = await db.campaigns.findMany({
    where: {
      characters: {
        some: {
          user: {
            username: username,
          },
        },
      },
    },
    include,
  });
  return { dm, player };
}

export default { characters, campaigns };
