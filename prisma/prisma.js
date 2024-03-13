import { Prisma, PrismaClient } from "@prisma/client";
import { prisma_safe, sql_safe } from "utilities";

import _ from "lodash";
import { get_fields } from "./notion";
import models from "~models";

const prisma = new PrismaClient().$extends({
  model: {
    ...models,
  },
  // result: {
  //   title: {
  //     needs: {
  //       entry: true,
  //     },
  //     compute(item) {
  //       return item.entry.title;
  //     },
  //   },
  //   id: {
  //     needs: {
  //       entry: true,
  //     },
  //     compute(item) {
  //       return item.entry.id;
  //     },
  //   },
  //   description: {
  //     needs: {
  //       entry: {
  //         description: {
  //           content: true,
  //         },
  //       },
  //     },
  //     compute(item) {
  //       return item.entry.description.content;
  //     },
  //   },
  // },
  client: {
    table: function ({ name }) {
      return Prisma.getExtensionContext(this)[prisma_safe(sql_safe(name))];
    },
    srd: function () {
      return Prisma.getExtensionContext(this).rules.findMany({});
    },
  },
});

const rules = await prisma.srd();

const rule = (database) => ({
  async query(args) {
    const result = await database.findMany({
      ...args,
      include: {
        ...args?.include,
        entry: {
          include: {
            description: {
              include: {
                content: true,
              },
            },
          },
        },
      },
    });
    return result.map((item) =>
      _.omit(
        {
          ...item.entry,
          description: item.entry.description.content,
          ...item,
        },
        ["entry", ...exclusions(item)]
      )
    );
  },
  async save(data) {
    const fields = get_fields(database.$name);
    await database.write({ data, fields });
  },
});

const extensions = Object.fromEntries(
  rules.map(({ title }) => {
    const database = prisma.table({ name: title });
    return [
      prisma_safe(sql_safe(title)),
      Object.assign(database, rule(database)),
    ];
  })
);

const exclusions = (item) => Object.keys(item).filter((i) => i.includes("Id"));

export const db = {
  ...prisma,
  ...extensions,
};
