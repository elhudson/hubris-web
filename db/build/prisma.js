var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "dotenv/config";
import * as methods from "~db.methods";
import * as views from "~db.views";
import { Prisma, PrismaClient } from "@prisma/client";
import { prisma_safe, sql_safe } from "~db/utils.js";
import { Client } from "@notionhq/client";
import _ from "lodash";
import { get_fields } from "./notion";
export const prisma = new PrismaClient().$extends({
    model: Object.assign({}, methods),
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
        sync: function () {
            return __awaiter(this, void 0, void 0, function* () {
                const self = Prisma.getExtensionContext(this);
                const client = new Client({ auth: self.config.notion.token });
                // await prisma.entry.sync({ client });
                yield self.rules.sync({ client });
                const tables = yield self
                    .srd()
                    .then((s) => s.map(({ title }) => self.table({ name: title })));
                for (var table of tables) {
                    yield table.sync({ client });
                }
            });
        },
    },
});
const rule = (database) => ({
    query(args, func) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = database.parseInclude(args);
            return yield func(query);
        });
    },
    queryMany(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.query(args, database.findMany);
            const parsed = [];
            for (var r of result) {
                const data = database.resurface(database.$name, r);
                parsed.push(data);
            }
            return parsed;
        });
    },
    queryOne(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.query(args, database.findFirst);
            return database.resurface(database.$name, res);
        });
    },
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = get_fields(database.$name);
            yield database.write({ data, fields });
        });
    },
});
const rules = await prisma.srd().then((rules) => Object.fromEntries(rules.map(({ title }) => {
    const database = prisma.table({ name: title });
    return [
        prisma_safe(sql_safe(title)),
        Object.assign(database, rule(database)),
    ];
})));
export const db = Object.assign(Object.assign({}, prisma), rules);
