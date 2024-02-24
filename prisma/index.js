import { PrismaClient, Prisma } from "@prisma/client";
import { collectPaginatedAPI } from "@notionhq/client";
import { get_fields } from "./notion/updater.js";
import { parse_page, get_description } from "./notion/downloader.js";
import { get_page } from "./notion/helpers.js";
import _ from "lodash";
import progress from "cli-progress";
import { table } from "./models/index.js";
import { get_tier } from "utilities";

export default db = new PrismaClient().$extends({
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
                equals: model.$name.replace("_", " ")
              }
            }
          })
          .then((r) => r.results.at(0).id);
        const pages = await collectPaginatedAPI(client.databases.query, {
          database_id: notion_id
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
                    id: data[one].id
                  },
                  create: data[one]
                }
              });
          });

          manys
            .filter((m) => _.has(data, m))
            .forEach((many) => {
              query[many] = {
                connectOrCreate: data[many].map((d) => ({
                  where: {
                    id: d.id
                  },
                  create: d
                }))
              };
            });

          await model.upsert({
            where: {
              title: data.title,
              id: data.id
            },
            create: query,
            update: query
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
                equals: model.$name.replace("_", " ")
              }
            }
          })
          .then((r) => r.results.at(0).id);
        const items = await collectPaginatedAPI(client.databases.query, {
          database_id: notion_id
        }).then((p) => p.map((i) => i.id));
        const tdl = await model
          .findMany({
            select: {
              id: true
            }
          })
          .then((f) => f.filter((c) => !items.includes(c.id)));
        tdl.forEach(
          async (t) =>
            await model.delete({
              where: {
                id: t.id
              }
            })
        );
      }
    },
    rules: {
      sync: async function ({ client = notion }) {
        const rules = await client.databases
          .query({
            database_id: process.env.NOTION_CORE_RULES,
            filter: {
              property: "Config",
              checkbox: {
                equals: true
              }
            }
          })
          .then((c) =>
            c.results.map((c) => ({
              id: c.id,
              title: c.title[0].plain_text,
              config: true
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
                      equals: false
                    }
                  }
                })
                .then((a) =>
                  a.results.map((c) => ({
                    id: c.id,
                    title: c.title[0].plain_text,
                    config: false
                  }))
                )
            )
          );
        rules.forEach(async (rule) => {
          await db.rules.upsert({
            where: {
              id: rule.id
            },
            update: rule,
            create: rule
          });
        });
      }
    },
    characters: {
      retrieve: async function ({ id = null, where = null }) {
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
      },
      save: async function ({ item }) {
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
      },
      campaign: async function ({ id }) {
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
                  connect: item.tags
                }
              };
            }
            await db[table].upsert({
              where: {
                id: item.id
              },
              update: item,
              create: item
            });
          }
        }
      }
    },
    campaigns: {
      retrieve: async function ({ id }) {
        return await db.campaigns.findFirst({
          where: {
            id: id
          },
          include: {
            characters: {
              include: {
                classes: true,
                backgrounds: true,
                effects: true,
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
      },
      make: async function ({ data }) {
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
      },
      save: async function ({ data }) {
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
    },
    powers: {
      make: async function ({
        id,
        name,
        flavortext,
        effects,
        ranges,
        durations,
        characters,
        creator
      }) {
        await db.powers.create({
          data: {
            id: id,
            name: name,
            flavortext: flavortext,
            creator: {
              connect: {
                id: creator.id
              }
            },
            characters: {
              connect: characters.map((c) => ({
                id: c.id
              }))
            },
            ranges: {
              connect: ranges.map((r) => ({
                id: r.id
              }))
            },
            durations: {
              connect: durations.map((r) => ({
                id: r.id
              }))
            },
            effects: {
              connect: effects.map((r) => ({
                id: r.id
              }))
            }
          }
        });
      },
      edit: async function ({
        id,
        name,
        flavortext,
        effects,
        ranges,
        durations,
        characters,
        creator
      }) {
        await db.powers.update({
          where: {
            id: id
          },
          data: {
            name: name,
            flavortext: flavortext,
            creator: {
              connect: {
                id: creator.id
              }
            },
            characters: {
              set: characters.map((c) => ({
                id: c.id
              }))
            },
            ranges: {
              set: ranges.map((r) => ({
                id: r.id
              }))
            },
            durations: {
              set: durations.map((r) => ({
                id: r.id
              }))
            },
            effects: {
              set: effects.map((r) => ({
                id: r.id
              }))
            }
          }
        });
      },
      save: async function (data) {
        await db.powers
          .make(data)
          .catch(async (err) => await db.powers.edit(data));
      }
    },
    users: {
      characters: async function ({ id }) {
        const chars = await db.characters.retrieve({
          where: {
            user: {
              id: id
            }
          }
        });
        return chars;
      }
    },
    index: {
      table: table
    }
  }
});
