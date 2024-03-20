import { Prisma } from "@prisma/client";
import _ from "lodash";
import { db } from "~db/prisma.js";
import { character as instance } from "~db.models";
import { options } from "~db.methods";

function character(data) {
  const parent = instance(data);
  return {
    ...parent,
    options: {
      update: {
        class_features: () => options.class_features(parent),
        backgrounds: () => options.backgrounds(),
        classes: () =>
          options.classes().then((c) =>
            c.map((a) => ({
              ...a,
              xp: 4
            }))
          ),
        tag_features: () => options.tag_features(parent),
        effects: () => options.effects(parent),
        ranges: () => options.ranges(parent),
        durations: () => options.durations(parent),
        skills: () => options.skills(),
        hd: () => options.hd(parent)
      },
      create: {
        backgrounds: () => options.backgrounds(),
        classes: () => options.classes(),
        skills: () => options.skills(),
        attributes: () => options.attributes()
      }
    }
  };
}

async function get({ id = null, where = null }) {
  const self = Prisma.getExtensionContext(this);
  var character = await self[id ? "findFirst" : "findMany"]({
    where: where ?? {
      id: id
    },
    include: {
      profile: false,
      campaign: true,
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
          trees: true,
          area: true,
          range: true
        }
      },
      durations: {
        include: {
          trees: true,
          duration: true
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
          classes: true,
          class_paths: true
        }
      },
      tag_features: {
        include: {
          tags: true
        }
      },
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
  character && (character.HD = _.uniqBy(character?.HD, (f) => f.die.title));
  return character;
}

async function acquire({ item, type }) {}

async function buyable(data) {
  const { options } = character(data);
  const { update } = options;
  return {
    class_features: await update.class_features(),
    tag_features: await update.tag_features(),
    effects: await update.effects(),
    ranges: await update.ranges(),
    durations: await update.durations(),
    skills: await update.skills(),
    classes: await update.classes(),
    hd: await update.hd()
  };
}

async function init(data) {
  const { options } = character(data);
  const { create } = options;
  return {
    classes: await create.classes(),
    backgrounds: await create.backgrounds(),
    attributes: await create.attributes(),
    skills: await create.skills()
  };
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

export default { get, acquire, buyable, init, campaign, character };
