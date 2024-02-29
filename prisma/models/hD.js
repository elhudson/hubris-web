import { get_tier } from "utilities";
import { db } from "~db/prisma.js";
import _ from 'lodash'

async function save({ char }) {
  _.find(char.HD, (f) => f.src == "default").max = get_tier(char);
  for (var kind of char.HD) {
    const data = {
      used: Number(kind.used),
      max: Number(kind.max),
      src: kind.src,
      owner: {
        connect: {
          id: kind.charactersId
        }
      },
      die: {
        connect: kind.die
      }
    };
    await db.HD.upsert({
      where: {
        id: kind.id
      },
      update: data,
      create: data
    });
  }
}

export default { save };
