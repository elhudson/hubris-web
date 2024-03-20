import { db, prisma } from "~db/prisma.js";

async function create({ model, operation, args, query }) {
  const character = args;
  await prisma.$transaction([
    query({
      data: {
        character: {
          connect: {
            id: character.id
          }
        }
      }
    }),
    db.weapons.def({ character }),
    db.armor.def({ character })
  ]);
}

async function update({ model, operation, args, query }) {
  const character = args;
  await prisma.$transaction([
    query({
      where: {
        charactersId: character.id
      },
      data: {
        wielding: {
          update: {
            entryId: character.inventory.wielding?.id
          }
        },
        wearing: {
          update: {
            entryId: character.inventory.wearing?.id
          }
        }
      }
    })
  ]);
  await character.inventory.weapons.map((c) => db.weapons.save(c));
  await character.inventory.armor.map((c) => db.armor.save(c));
}

export default { create, update };
