import { Prisma } from "@prisma/client";

import { db } from "~db/prisma.js";

import { v4 } from "uuid";

async function make({ name, description, cls, owner }) {
  const self = Prisma.getExtensionContext(this);
  const id = v4();
  await self.create({
    data: {
      entry: {
        create: {
          id,
          title: name
        }
      },
      owned_by: {
        connect: {
          charactersId: owner.id
        }
      },
      class: cls
    }
  });
  await db.description.save({ entryId: id, description });
}

async function def({ character }) {
  const self = Prisma.getExtensionContext(this);
  const cls = character.classes[0].armory;
  await self.make({
    cls,
    owner: {
      id: character.id
    },
    name: `${cls} Armor`,
    description: [
      {
        index: 0,
        plaintext: `A simple set of ${cls.toLowerCase()} armor.`
      }
    ]
  });
}

async function save(armor) {
  const self = Prisma.getExtensionContext(this);
  await self.update({
    where: {
      entryId: armor.id
    },
    data: {
      entry: {
        update: {
          title: armor.name
        }
      },
      class: armor.class
    }
  });
  await db.description.save({
    entryId: armor.id,
    description: armor.description
  });
}

export default { def, make, save };
