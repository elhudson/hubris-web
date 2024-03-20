import { db } from "~db/prisma.js";
import _ from "lodash";
async function hd(character) {
  return character.HD;
}

async function skills() {
  return db.skills.all();
}

async function attributes() {
  return db.attributes.all();
}

async function class_features(character) {
  return db.class_Features.queryMany({
    where: {
      OR: character.classes.map((c) => ({
        classes: {
          entryId: c.id
        }
      })),
      tier: {
        lte: character.tier()
      }
    },
    include: {
      classes: true,
      class_paths: true,
      requires: true,
      required_for: true
    }
  });
}

async function backgrounds() {
  return db.backgrounds.all();
}

async function classes() {
  return db.classes.all();
}

async function tag_features(character) {
  const tags = character.tags();
  return db.tag_Features.queryMany({
    where: {
      OR: tags.map((t) => ({
        tags: {
          entryId: t.id
        }
      })),
      tier: {
        lte: character.tier()
      }
    },
    include: {
      tags: true,
      requires: true,
      required_for: true
    }
  });
}

async function effects(character) {
  const tags = character.tags();
  return db.effects.queryMany({
    where: {
      OR: tags.map((t) => ({
        tags: {
          some: {
            entryId: t.id
          }
        }
      })),
      tier: {
        lte: character.tier()
      }
    },
    include: {
      trees: true,
      tags: true,
      requires: true,
      required_for: true
    }
  });
}

async function ranges(character) {
  return db.ranges.queryMany({
    where: {
      trees: {
        some: {}
      },
      tier: {
        lte: character.tier()
      }
    },
    include: {
      trees: true,
      requires: true,
      required_for: true
    }
  });
}
async function durations(character) {
  return db.durations.queryMany({
    where: {
      trees: {
        some: {}
      },
      tier: {
        lte: character.tier()
      }
    },
    include: {
      trees: true,
      requires: true,
      required_for: true
    }
  });
}

export default {
  class_features,
  backgrounds,
  classes,
  tag_features,
  effects,
  ranges,
  skills,
  durations,
  attributes,
  hd
};
