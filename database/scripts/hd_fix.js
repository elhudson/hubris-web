import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const characters = await prisma.characters.findMany({
  include: {
    classes: {
      include: {
        hit_dice: true
      }
    }
  }
});

for (var c of characters) {
  await prisma.characters.update({
    where: {
      id: c.id
    },
    data: {
      HD: {
        create: {
          die: {
            connect: c.classes[0].hit_dice
          }
        }
      }
    }
  });
}
