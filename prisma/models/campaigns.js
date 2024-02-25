import { db } from "~db/prisma.js";

async function retrieve({ id }) {
  return await db.campaigns.findFirst({
    where: {
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
      creator: true,
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
  await db.campaigns.create({
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
  await db.campaigns.update({
    where: {
      id: data.id
    },
    data: {
      id: data.id,
      description: data.description,
      xp: data.xp,
      settings: {
        connect: data.settings.map((s) => ({ id: s.id }))
      },
      characters: {
        connect: data.characters.map((c) => ({ id: c.id }))
      },
      dm: {
        connect: {
          id: data.dm.id
        }
      }
    }
  });
}

export default { retrieve, make, save };
