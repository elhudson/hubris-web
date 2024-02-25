import { db } from "~db/prisma.js";
import _ from "lodash"
async function retrieve({ id = null, where = null }) {
  const character = await db.characters.findFirst({
    where: where ?? {
      id: id
    },
    include: {
      profile: false,
      backgrounds: {
        include: {
          background_features: true,
          skills: true
        }
      },
      effects: {
        include: {
          trees: true,
          tags: true,
          range: true,
          duration: true
        }
      },
      ranges: {
        include: {
          trees: true
        }
      },
      durations: {
        include: {
          trees: true
        }
      },
      health: {
        include: {
          injuries: true
        }
      },
      inventory: {
        include: {
          weapons: {
            include: {
              tags: true
            }
          },
          armor: true,
          items: true
        }
      },
      class_features: {
        include: {
          classes: true
        }
      },
      tag_features: true,
      HD: {
        include: {
          die: true
        }
      },
      skills: true,
      classes: {
        include: {
          hit_dice: true,
          tags: true,
          attributes: true
        }
      },
      powers: {
        include: {
          effects: {
            include: {
              tags: true
            }
          },
          ranges: true,
          durations: true
        }
      }
    }
  });
  character.HD = _.uniqBy(character.HD, (f) => f.die.title);
  return character;
}

async function save({ item }) {
  const campaign = await db.characters.campaign({ id: item.id });
  await db.characters.update({
    where: {
      id: item.id
    },
    data: {
      biography: item.biography,
      health: {
        update: {
          hp: item.health.hp,
          injuries: {
            connect: item.health.injuries
          }
        }
      },
      xp_earned: campaign?.xp ?? item.xp_earned,
      burn: item.burn,
      classes: {
        set: item.classes.map((i) => ({
          id: i.id
        }))
      },
      backgrounds: {
        set: item.backgrounds.map((i) => ({
          id: i.id
        }))
      },
      effects: {
        set: item.effects.map((i) => ({
          id: i.id
        }))
      },
      ranges: {
        set: item.ranges.map((i) => ({
          id: i.id
        }))
      },
      durations: {
        set: item.durations.map((i) => ({
          id: i.id
        }))
      },
      class_features: {
        set: item.class_features.map((i) => ({
          id: i.id
        }))
      },
      tag_features: {
        set: item.tag_features.map((i) => ({
          id: i.id
        }))
      },
      skills: {
        set: item.skills.map((i) => ({
          id: i.id
        }))
      },
      str: item.str,
      dex: item.dex,
      con: item.con,
      int: item.int,
      wis: item.wis,
      cha: item.cha
    }
  });
  await db.inventories.save({ inventory: item.inventory });
  await db.hD.save({ char: item });
}

async function campaign({ id }) {
  const campaign = await db.campaigns.findFirst({
    where: {
      characters: {
        some: {
          id: id
        }
      }
    }
  });
  return campaign;
}

export default { retrieve, save, campaign };
