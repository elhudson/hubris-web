import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const trees = await prisma.trees.findMany();

trees.forEach(async (tree) => {
  await prisma.trees.update({
    where: {
      id: tree.id
    },
    data: {
      ranges: {
        set: []
      },
      durations: {
        set: []
      }
    }
  });
});
