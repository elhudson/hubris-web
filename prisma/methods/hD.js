import { Prisma } from "@prisma/client";

import { character } from "~db.models";

async function save({ char }) {
  const self=Prisma.getExtensionContext(this)
  _.find(char.HD, (f) => f.src == "default").max = character.tier(char);
  for (var kind of char.HD) {
    const data = {
      used: Number(kind.used),
      max: Number(kind.max),
      src: kind.src,
      owner: {
        connect: {
          id: kind.charactersId
        }
      },
      die: {
        connect: kind.die
      }
    };
    await self.upsert({
      where: {
        id: kind.id
      },
      update: data,
      create: data
    });
  }
}

export default { save };
