import { parse } from "csv-parse";
import _ from "lodash";
import crypto from "crypto";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tags = await prisma.tags.findMany();
const backgrounds = await prisma.backgrounds.findMany();
const classes = await prisma.classes.findMany();
const tag_features = await prisma.tag_Features.findMany();
const effects = await prisma.effects.findMany();
const class_features = await prisma.class_Features.findMany();
const injuries = await prisma.injuries.findMany();
const durations = await prisma.durations.findMany();
const ranges = await prisma.ranges.findMany();
const skills = await prisma.skills.findMany();

const uninjured = _.find(injuries, (p) => p.title == "Uninjured");

// const usrs = [];
// fs.createReadStream("/home/ehudson/users.csv")
//   .pipe(parse({ delimiter: ",", ltrim: true, columns: true }))
//   .on("data", function (row) {
//     // 👇 push the object row into the array
//     usrs.push(row);
//   })
//   .on("error", function (error) {
//     console.log(error.message);
//   })
//   .on("end", function () {
//     // 👇 log the result array
//     console.log("parsed csv data:");
//     console.log(usrs);
//     fs.writeFileSync('./users.json', JSON.stringify(usrs))
//   });

const users = JSON.parse(
  fs.readFileSync("./users.json", { encoding: "utf-8" })
);

const chars = JSON.parse(
  fs.readFileSync("./characters.json", { encoding: "utf-8" })
);

const ids = Array.from(new Set(chars.map((c) => c.id)));

const uniques = Object.fromEntries(
  ids.map((i) => [i, chars.filter((c) => c.id == i)])
);
for (var [id, data] of Object.entries(uniques)) {
  uniques[id] = _.sortBy(data, (d) => d.timestamp).at(-1).body;
}

const dudless = Object.values(uniques).filter((f) => _.has(f, "bio"));

const uniq_usernames = Array.from(new Set(users.map((u) => u.username)));

const with_all_possible_ids = uniq_usernames.map((u) => ({
  username: u,
  password: _.find(users, (f) => f.username == u).password,
  ids: users.filter((f) => f.username == u).map((i) => i.id)
}));

const chars_to_usernames = dudless.map((c) => ({
  char_id: c.id,
  username: _.find(with_all_possible_ids, (f) => f.ids.includes(c.user))
    .username,
  user_id: c.user
}));

const correct_users = with_all_possible_ids
  .map((user) => ({
    username: user.username,
    password: user.password,
    id: _.find(chars_to_usernames, (c) => c.username == user.username)
  }))
  .filter((c) => c.id != undefined);

correct_users.forEach((item) => {
  item.id = item.id.user_id;
});

const Character = (item) => {
  const cl = _.find(classes, (f) => f.id == item.classes.base.id);
  const usr = _.find(correct_users, (f) => f.id == item.user);
  Object.values(item.combat.weapons).forEach((item)=> item.id=crypto.randomUUID().toString())
  Object.values(item.combat.armor).forEach((item)=> item.id=crypto.randomUUID().toString())
  return {
    id: item.id,
    user: {
      connectOrCreate: {
        where: {
          id: item.user
        },
        create: usr
      }
    },
    biography: item.bio,
    health: {
      connectOrCreate: {
        where: {
          charactersId: item.id
        },
        create: {
          hp: item.health.hp.current,
          injuries: {
            connectOrCreate: {
              where: {
                id: uninjured.id
              },
              create: uninjured
            }
          }
        }
      }
    },
    xp_earned: item.progression.xp.earned,
    xp_spent: item.progression.xp.spent,
    classes: {
      connectOrCreate: {
        where: {
          id: cl.id
        },
        create: cl
      }
    },
    backgrounds: {
      connectOrCreate: [
        item.backgrounds.primary.id,
        item.backgrounds.secondary.id
      ].map((i) => ({
        where: {
          id: i
        },
        create: _.find(backgrounds, (b) => b.id == i)
      }))
    },
    effects: {
      connectOrCreate: item.powers.effects.content[""].map((p) => ({
        where: {
          id: p.id
        },
        create: _.find(effects, (e) => e.id == p.id)
      }))
    },
    ranges: {
      connectOrCreate: item.powers.metadata.ranges.content[""].map((p) => ({
        where: {
          id: p.id
        },
        create: _.find(ranges, (e) => e.id == p.id)
      }))
    },
    durations: {
      connectOrCreate: item.powers.metadata.durations.content[""].map((p) => ({
        where: {
          id: p.id
        },
        create: _.find(durations, (e) => e.id == p.id)
      }))
    },
    class_features: {
      connectOrCreate: item.features.class_features.content[""].map((p) => ({
        where: {
          id: p.id
        },
        create: _.find(class_features, (e) => e.id == p.id)
      }))
    },
    tag_features: {
      connectOrCreate: item.features.tag_features.content[""].map((p) => ({
        where: {
          id: p.id
        },
        create: _.find(tag_features, (e) => e.id == p.id)
      }))
    },
    skills: {
      connectOrCreate: item.skills
        .filter((c) => c.proficient)
        .map((c) => ({
          where: {
            id: c.id
          },
          create: _.find(skills, (e) => e.id == c.id)
        }))
    },
    inventory: {
      connectOrCreate: {
        where: {
          charactersId: item.id
        },
        create: {
          weapons: {
            connectOrCreate: Object.values(item.combat.weapons).map((w) => ({
              where: {
                id: w.id
              },
              create: {
                id: w.id,
                name: w.name,
                martial: w.value == "Martial",
                heavy: w.weight.heavy.active,
                tags: {
                  connectOrCreate: tags
                    .filter((f) =>
                      ["Bludgeoning", "Piercing", "Slashing"].includes(f.title)
                    )
                    .map((t) => ({
                      where: { id: t.id },
                      create: t
                    }))
                }
              }
            }))
          },
          armor: {
            connectOrCreate: Object.values(item.combat.armor).map((a) => ({
              where: {
                id: a.id
              },
              create: {
                id: a.id,
                class: a.value
              }
            }))
          }
        }
      }
    },
    str: item.stats.scores.str.value,
    con: item.stats.scores.con.value,
    int: item.stats.scores.int.value,
    cha: item.stats.scores.cha.value,
    wis: item.stats.scores.wis.value,
    dex: item.stats.scores.dex.value
  };
};

const characters = dudless.map((c) => Character(c));

for (var c of characters) {
  await prisma.characters.upsert({
    where: {
      id: c.id
    },
    create: c,
    update: c
  });
}
