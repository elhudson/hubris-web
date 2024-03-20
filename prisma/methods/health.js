import { Prisma } from "@prisma/client";
import { db } from "~db/prisma.js";

async function save({ character }) {
  const model = Prisma.getExtensionContext(this);
  await model.update({
    where: {
      id: item.id
    },
    data: {
      injuries: {
        connect: {
          entryId: character.injuries.id
        }
      },
      hp: character.hp
    }
  });
  await db.hD.save({ char: character });
}

export default { save };
