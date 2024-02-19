import { PrismaClient, Prisma } from "@prisma/client";
import { Client, collectPaginatedAPI } from "@notionhq/client";
import multer from "multer";
import { get_fields } from "./notion/updater.js";
import { parse_page, get_description } from "./notion/downloader.js";
import { get_page } from "./notion/helpers.js";
import _ from "lodash";
import progress from "cli-progress";
import { get_tier } from "utilities";

export const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const db = new PrismaClient().$extends({
  model: {
    $allModels: {
      sync: async function ({ client = notion }) {
        const model = Prisma.getExtensionContext(this);
        const { scalars, ones, manys } = get_fields(model.$name);

        const notion_id = await client.databases
          .query({
            database_id: process.env.NOTION_CORE_RULES,
            filter_properties: ["Page"],
            filter: {
              property: "Page",
              title: {
                equals: model.$name.replace("_", " "),
              },
            },
          })
          .then((r) => r.results.at(0).id);
        const pages = await collectPaginatedAPI(client.databases.query, {
          database_id: notion_id,
        }).then((p) => p.map((i) => i.id));

        console.log(`Downloading entries from table ${model.$name}...`);

        const bar = new progress.SingleBar({}, progress.Presets.shades_classic);
        bar.start(pages.length, 0);

        for (var id of pages) {
          const page = await get_page(client, id);
          const data = await parse_page(page, client);

          if (scalars.includes("description")) {
            data.description = await get_description(id, client);
          }

          const query = {};

          scalars.forEach((field) => {
            query[field] = data[field];
          });

          ones.forEach((one) => {
            data[one] = Array.isArray(data[one]) ? data[one].at(0) : data[one];
            data[one] &&
              (query[one] = {
                connectOrCreate: {
                  where: {
                    id: data[one].id,
                  },
                  create: data[one],
                },
              });
          });

          manys
            .filter((m) => _.has(data, m))
            .forEach((many) => {
              query[many] = {
                connectOrCreate: data[many].map((d) => ({
                  where: {
                    id: d.id,
                  },
                  create: d,
                })),
              };
            });

          await model.upsert({
            where: {
              title: data.title,
              id: data.id,
            },
            create: query,
            update: query,
          });

          bar.update(pages.indexOf(id) + 1);
        }
        bar.stop();
      },
      purge: async function ({ client = notion }) {
        const model = Prisma.getExtensionContext(this);
        const notion_id = await client.databases
          .query({
            database_id: process.env.NOTION_CORE_RULES,
            filter_properties: ["Page"],
            filter: {
              property: "Page",
              title: {
                equals: model.$name.replace("_", " "),
              },
            },
          })
          .then((r) => r.results.at(0).id);
        const items = await collectPaginatedAPI(client.databases.query, {
          database_id: notion_id,
        }).then((p) => p.map((i) => i.id));
        const tdl = await model
          .findMany({
            select: {
              id: true,
            },
          })
          .then((f) => f.filter((c) => !items.includes(c.id)));
        tdl.forEach(
          async (t) =>
            await model.delete({
              where: {
                id: t.id,
              },
            })
        );
      },
    },
    rules: {
      sync: async function ({ client = notion }) {
        const rules = await client.databases
          .query({
            database_id: process.env.NOTION_CORE_RULES,
            filter: {
              property: "Config",
              checkbox: {
                equals: true,
              },
            },
          })
          .then((c) =>
            c.results.map((c) => ({
              id: c.id,
              title: c.title[0].plain_text,
              config: true,
            }))
          )
          .then(async (j) =>
            j.concat(
              await client.databases
                .query({
                  database_id: process.env.NOTION_CORE_RULES,
                  filter: {
                    property: "Config",
                    checkbox: {
                      equals: false,
                    },
                  },
                })
                .then((a) =>
                  a.results.map((c) => ({
                    id: c.id,
                    title: c.title[0].plain_text,
                    config: false,
                  }))
                )
            )
          );
        rules.forEach(async (rule)=> {
          await db.rules.upsert({
            where: {
              id: rule.id
            },
            update: rule,
            create: rule
          })
        })
      },
    },
    characters: {
      retrieve: async function ({ id }) {
        const character = await db.characters.findFirst({
          where: {
            id: id,
          },
          include: {
            profile: false,
            backgrounds: {
              include: {
                background_features: true,
                skills: true,
              },
            },
            effects: {
              include: {
                trees: true,
                tags: true,
              },
            },
            ranges: {
              include: {
                trees: true,
              },
            },
            durations: {
              include: {
                trees: true,
              },
            },
            health: {
              include: {
                injuries: true,
              },
            },
            inventory: {
              include: {
                weapons: {
                  include: {
                    tags: true,
                  },
                },
                armor: true,
                items: true,
              },
            },
            class_features: {
              include: {
                classes: true,
              },
            },
            tag_features: true,
            HD: {
              include: {
                die: true,
              },
            },
            skills: true,
            classes: {
              include: {
                hit_dice: true,
                tags: true,
                attributes: true,
              },
            },
            powers: {
              include: {
                effects: true,
                ranges: true,
                durations: true,
              },
            },
          },
        });
        character.HD = _.uniqBy(character.HD, (f) => f.die.title);
        return character;
      },
      save: async function ({ item }) {
        await db.characters.update({
          where: {
            id: item.id,
          },
          data: {
            biography: item.biography,
            health: {
              update: {
                hp: item.health.hp,
                injuries: {
                  connect: item.health.injuries,
                },
              },
            },
            xp_earned: item.xp_earned,
            xp_spent: item.xp_spent,
            burn: item.burn,
            classes: {
              connect: item.classes.map((i) => ({
                id: i.id,
              })),
            },
            backgrounds: {
              connect: item.backgrounds.map((i) => ({
                id: i.id,
              })),
            },
            effects: {
              connect: item.effects.map((i) => ({
                id: i.id,
              })),
            },
            ranges: {
              connect: item.ranges.map((i) => ({
                id: i.id,
              })),
            },
            durations: {
              connect: item.durations.map((i) => ({
                id: i.id,
              })),
            },
            class_features: {
              connect: item.class_features.map((i) => ({
                id: i.id,
              })),
            },
            tag_features: {
              connect: item.tag_features.map((i) => ({
                id: i.id,
              })),
            },
            skills: {
              connect: item.skills.map((i) => ({
                id: i.id,
              })),
            },
            str: item.str,
            dex: item.dex,
            con: item.con,
            int: item.int,
            wis: item.wis,
            cha: item.cha,
          },
        });
        await db.inventories.save({ inventory: item.inventory });
        await db.hD.save({ char: item });
      },
    },
    hD: {
      save: async function ({ char }) {
        _.find(char.HD, (f) => f.src == "default").max = get_tier(char);
        for (var kind of char.HD) {
          const data = {
            used: Number(kind.used),
            max: Number(kind.max),
            src: kind.src,
            owner: {
              connect: {
                id: kind.charactersId,
              },
            },
            die: {
              connect: kind.die,
            },
          };
          await db.HD.upsert({
            where: {
              id: kind.id,
            },
            update: data,
            create: data,
          });
        }
      },
    },
    inventories: {
      save: async function ({ inventory }) {
        for (var table of ["armor", "weapons", "items"]) {
          for (var item of inventory[table]) {
            if (item.tags) {
              item = {
                ...Object.fromEntries(
                  Object.keys(item)
                    .filter((f) => !f.includes("Id"))
                    .map((k) => [k, item[k]])
                ),
                tags: {
                  connect: item.tags,
                },
              };
            }
            await db[table].upsert({
              where: {
                id: item.id,
              },
              update: item,
              create: item,
            });
          }
        }
      },
    },
  },
});
