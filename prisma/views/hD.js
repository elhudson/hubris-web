import _ from  "lodash";

import { character } from "~db.models";

import { db } from "~db/prisma.js";

async function create({ model, operation, args, query }) {
  const character = args;
  await query({
    data: {
      max: 1,
      used: 0,
      die: {
        connect: {
          entryId: character.classes[0].hit_dice.id
        }
      },
      owner: {
        connect: {
          id: character.id
        }
      }
    }
  });
}

async function upsert({ model, operation, args, query }) {
  var { data, where } = args;
  data = {
    used: Number(data.used),
    max: Number(data.max),
    src: data.src,
    owner: {
      connect: {
        id: where.id.charactersId
      }
    },
    die: {
      connect: {
        entryId: data.die.entryId
      }
    }
  };
  await query({
    where: args.where,
    create: data,
    update: data
  });
}

async function update({ model, operation, args, query }) {
  const char = args;
  _.find(char.HD, (f) => f.src == "default").max = character.tier(char);
  for (var kind of char.HD) {
    await db.hD.upsert({
      where: {
        id: {
          charactersId: char.id,
          src: kind.src,
          hit_diceId: kind.die.entryId
        }
      },
      data: kind
    });
  }
}

export default { create, update, upsert };
