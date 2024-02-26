import { db } from "~db/prisma.js";

async function save({ inventory }) {
  for (var table of ["armor", "weapons", "items"]) {
    for (var item of inventory[table]) {
      if (item.tags) {
        item = {
          ...Object.fromEntries(
            Object.keys(item)
              .filter((f) => !f.includes("Id"))
              .map((k) => [k, item[k]])
          ),
          tags: {
            connect: item.tags
          }
        };
      }
      await db[table].upsert({
        where: {
          id: item.id
        },
        update: item,
        create: item
      });
    }
  }
}

async function add({ item, table, character }) {
  const query = { ...item };
  table == "weapons" &&
    (query.tags = {
      connect: item.tags
    });
  await db.inventories.update({
    where: {
      charactersId: character
    },
    data: {
      [table]: {
        upsert: {
          where: {
            id: item.id
          },
          create: query,
          update: query
        }
      }
    }
  });
}

export default { save, add };
