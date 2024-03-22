import { Client } from "@notionhq/client";

import { Prisma, PrismaClient } from "@prisma/client";

import "dotenv/config";

import * as methods from "~db.methods";

import * as views from "~db.views";

import { prisma_safe, sql_safe } from "~db/utils.js";

import _ from "lodash";

import { get_fields } from "notion";

export const prisma = new PrismaClient().$extends({
  model: {
    ...methods,
  },
  query: {
    characters: views.characters,
    health: views.health,
    hD: views.hD,
    inventories: views.inventories,
  },
  client: {
    config: {
      notion: {
        db: process.env.NOTION_CORE_RULES,
        token: process.env.NOTION_TOKEN,
      },
    },
    table: function ({ name }) {
      return Prisma.getExtensionContext(this)[prisma_safe(sql_safe(name))];
    },
    srd: function () {
      return Prisma.getExtensionContext(this).rules.findMany({});
    },
    schema: function () {
      return Prisma.dmmf.datamodel.models;
    },
    sync: async function () {
      const self = Prisma.getExtensionContext(this);
      const client = new Client({ auth: self.config.notion.token });
      // await prisma.entry.sync({ client });
      await self.rules.sync({ client });
      const tables = await self
        .srd()
        .then((s) => s.map(({ title }) => self.table({ name: title })));
      for (var table of tables) {
        await table.sync({ client });
      }
    },
  },
});

const rule = (database) => ({
  async query(args, func) {
    const query = database.parseInclude(args);
    return await func(query);
  },
  async queryMany(args) {
    const result = await this.query(args, database.findMany);
    const parsed = [];
    for (var r of result) {
      const data = database.resurface(database.$name, r);
      parsed.push(data);
    }
    return parsed;
  },
  async queryOne(args) {
    const res = await this.query(args, database.findFirst);
    return database.resurface(database.$name, res);
  },
  async save(data) {
    const fields = get_fields(database.$name);
    await database.write({ data, fields });
  },
});

const rules = await prisma.srd().then((rules) =>
  Object.fromEntries(
    rules.map(({ title }) => {
      const database = prisma.table({ name: title });
      return [
        prisma_safe(sql_safe(title)),
        Object.assign(database, rule(database)),
      ];
    })
  )
);

export const db = { ...prisma, ...rules };
