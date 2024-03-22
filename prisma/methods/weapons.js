import { Prisma } from "@prisma/client";

import { db } from "~db/prisma.js";

import { v4 } from "uuid";

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
      entryId: dtype.id ?? dtype.entryId
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
  await self.update({
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
          ? weapon.tags.map((c) => ({ entryId: c.id ?? c.entryId }))
          : {
              entryId: weapon.tags.entryId
            }
      },
      uses: {
        connect: {
          code: weapon.attrCode
        }
      }
    }
  });
  await db.description.save({
    entryId: weapon.id,
    description: weapon.description
  });
}

export default { def, make, save };
