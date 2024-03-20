import { Prisma } from "@prisma/client";
import { v4 } from "uuid";
import { db, prisma } from "~db/prisma.js";

async function make({ heavy, martial, uses, dtype, name, owner, description }) {
  const self = Prisma.getExtensionContext(this);
  const id = v4();
  await self.create({
    data: {
      heavy,
      martial,
      tags: {
        connect: dtype
      },
      uses: {
        connect: uses
      },
      owned_by: {
        connect: {
          charactersId: owner.id
        }
      },
      entry: {
        create: {
          id,
          title: name
        }
      }
    }
  });
  await db.description.save({ entryId: id, description });
}

async function def({ character }) {
  const self = Prisma.getExtensionContext(this);
  const dtype = await db.tags.queryOne({
    where: {
      entry: {
        title: "Piercing"
      }
    }
  });
  await self.make({
    martial: character.classes[0].weaponry == "Martial",
    heavy: false,
    name: "Dagger",
    dtype: {
      entryId: dtype.id
    },
    owner: {
      id: character.id
    },
    uses: {
      code: "str"
    },
    description: [
      {
        index: 0,
        plaintext:
          "A must-have for adventurers, no matter how powerful. Don't leave camp without it!"
      }
    ]
  });
}

async function save(weapon) {
  const self = Prisma.getExtensionContext(this);
  return await prisma.$transaction([
    self.update({
      where: {
        entryId: weapon.id
      },
      data: {
        entry: {
          update: {
            title: weapon.title
          }
        },
        heavy: weapon.heavy,
        martial: weapon.martial,
        tags: {
          connect: Array.isArray(weapon.tags)
            ? weapon.tags.map((c) => ({ entryId: c.id }))
            : {
                entryId: weapon.tags.id
              }
        },
        uses: {
          connect: {
            code: weapon.attrCode
          }
        }
      }
    }),
    db.description.save({ entryId: weapon.id, description: weapon.description })
  ]);
}

export default { def, make, save };
