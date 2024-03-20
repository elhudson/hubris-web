import { get_max_hp } from "utilities";
import { db, prisma } from "~db/prisma.js";

async function create({ model, operation, args, query }) {
  const character = args;
  const uninjured = await db.injuries.queryOne({
    where: {
      entry: {
        title: "Uninjured"
      }
    }
  });
  await query({
    data: {
      hp: get_max_hp(character),
      injuries: {
        connect: {
          entryId: uninjured.id
        }
      },
      character: {
        connect: {
          id: character.id
        }
      }
    }
  });
  await db.hD.create(character);
}

async function update({ model, operation, args, query }) {
  const character = args;
  await prisma.$transaction([
    query({
      where: {
        charactersId: character.id
      },
      data: {
        hp: character.hp,
        injuries: {
          set: {
            entryId: character.health.injuries.id
          }
        },
        character: {
          connect: {
            id: character.id
          }
        }
      }
    }),
    db.hD.update(character)
  ]);
}
export default { create, update };
