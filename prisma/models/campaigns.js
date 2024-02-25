import { db } from "~db/prisma.js";
import _ from "lodash";

async function retrieve({ where = null, id = null }) {
  return await db.campaigns.findFirst({
    where: where ?? {
      id: id
    },
    include: {
      characters: {
        include: {
          classes: true,
          backgrounds: true,
          effects: {
            include: {
              range: true,
              duration: true
            }
          },
          class_features: true,
          tag_features: true,
          ranges: true,
          durations: true,
          HD: {
            include: {
              die: true
            }
          },
          skills: true
        }
      },
      dm: true,
      settings: true,
      logbook: {
        include: {
          author: true
        }
      }
    }
  });
}

async function make({ data }) {
  return await db.campaigns.create({
    data: {
      name: data.name,
      description: data.description,
      settings: {
        connect: data.settings.map((s) => ({ id: s.id }))
      },
      creator: {
        connect: {
          id: data.creator.user_id
        }
      },
      dm: {
        connect: {
          id: data.dm.user_id
        }
      }
    }
  });
}

async function save({ data }) {
  const characters = await db.characters.findMany({
    select: {
      id: true
    }
  });
  await db.campaigns.update({
    where: {
      id: data.id
    },
    data: {
      id: data.id,
      description: data.description,
      xp: data.xp,
      sessionCount: Number(data.sessionCount),
      settings: {
        connect: data.settings.map((s) => ({ id: s.id }))
      },
      characters: {
        connect: data.characters.map((c) => ({
          id: c.id
        })),
        disconnect: _.xorBy(data.characters, characters, "id").map((char) => ({
          id: char.id
        }))
      },
      dm: {
        connect: {
          id: data.dm.id
        }
      }
    }
  });
}

async function summarize({ id, session }) {
  var data;
  const exists = await db.summaries.retrieve({
    where: {
      campaign:{
        id: id
      },
      session: session
    }
  });
  if (!exists) {
    data=await db.summaries.create({
      data: {

      }
    })
  }
}

export default { retrieve, make, save };
