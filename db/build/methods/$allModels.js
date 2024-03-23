var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { collectPaginatedAPI, Client } from "@notionhq/client";
import { Prisma } from "@prisma/client";
import { get_fields, notion, parse_page } from "../notion";
import "dotenv/config";
import _ from "lodash";
import { db, prisma } from "~db/prisma.js";
import progress from "cli-progress";
import rules from "~db/rules.json" with { type: "json" };
import { prisma_safe, sql_safe } from "~db/utils.js";
import { DateTime } from "luxon";
function sync() {
    return __awaiter(this, arguments, void 0, function* ({ client = notion } = {}) {
        const model = Prisma.getExtensionContext(this);
        const timestamp = yield model.last_updated();
        const cutoff = DateTime.now().minus({ hours: 12 });
        if (timestamp < cutoff) {
            const fields = get_fields(model.$name);
            const notion_id = yield client.databases
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
            const pages = yield collectPaginatedAPI(client.databases.query, {
                database_id: notion_id,
            });
            console.log(`Downloading entries from table ${model.$name}...`);
            const bar = new progress.SingleBar({}, progress.Presets.shades_classic);
            bar.start(pages.length, 0);
            for (var page of pages) {
                const data = yield parse_page(page, client);
                model.write({ data, fields });
                bar.update(pages.indexOf(page) + 1);
            }
            bar.stop();
            yield db.rules.update({
                where: {
                    title: model.$name.replace("_", " "),
                },
                data: {
                    last_updated: DateTime.now().toJSDate(),
                },
            });
        }
    });
}
function relations() {
    const model = Prisma.getExtensionContext(this);
    return db.rules.fields({ name: model.$name });
}
function last_updated() {
    return __awaiter(this, void 0, void 0, function* () {
        const model = Prisma.getExtensionContext(this);
        const { last_updated } = yield db.rules.findFirst({
            where: {
                title: model.$name.replace("_", " "),
            },
            select: {
                last_updated: true,
            },
        });
        return DateTime.fromJSDate(last_updated);
    });
}
function resurface(tbl, result) {
    var _a, _b, _c, _d;
    const { ones, manys, scalars } = db.rules.fields({ name: tbl });
    var current = {};
    if (result === null || result === void 0 ? void 0 : result.entry) {
        current = _.omit(Object.assign(Object.assign(Object.assign({}, result), result.entry), { description: (_d = (_c = (_b = (_a = result.entry) === null || _a === void 0 ? void 0 : _a.description) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.map((c) => (Object.assign(Object.assign({}, c), { link: c.link
                    ? {
                        id: c.link.target.id,
                        title: c.link.target.title,
                        src: _.find(Object.keys(c.link.target), (key) => rules.includes(key) && c.link.target[key] != null),
                    }
                    : null })))) !== null && _d !== void 0 ? _d : [] }), [
            "entry",
            ...scalars.filter((s) => s.name.includes("Id")).map((s) => s.name),
        ]);
    }
    for (var one of ones.filter((m) => _.has(result, m.name))) {
        current[one.name] = resurface(one.type, result[one.name]);
    }
    for (var many of manys.filter((m) => _.has(result, m.name))) {
        current[many.name] = [];
        for (var r of result[many.name]) {
            const res = resurface(many.type, r);
            current[many.name].push(res);
        }
    }
    return current;
}
function nestInclude(query, desc = false) {
    var _a, _b;
    const current = {
        entry: true,
    };
    if (desc) {
        current.entry = {
            include: {
                description: {
                    include: {
                        content: {
                            include: {
                                link: {
                                    include: {
                                        target: {
                                            include: Object.fromEntries(rules.map((r) => [r, true])),
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };
    }
    if (typeof query == "object") {
        const inclusions = (_b = Object.keys((_a = query === null || query === void 0 ? void 0 : query.include) !== null && _a !== void 0 ? _a : {})) !== null && _b !== void 0 ? _b : [];
        inclusions.forEach((inclus) => {
            var _a;
            current[inclus] = nestInclude(query.include[inclus]);
            if ((_a = current[inclus]) === null || _a === void 0 ? void 0 : _a.where) {
                current[inclus].where = parseWhere(current[inclus]);
            }
        });
    }
    return {
        include: current,
    };
}
function nestWhere(where) {
    Object.keys(where).forEach((key) => {
        var _a, _b;
        if (_.intersectionBy(Object.keys(where[key]), ["AND", "OR", "NOT", "lte"])
            .length > 0) {
            where[key] = nestWhere(where[key]);
        }
        if (_.intersectionBy(Object.keys(where[key]), ["title", "id", "description"])
            .length > 0) {
            where[key] = _.omit(where[key], ["title", "id", "description"]);
            ((_a = where[key]) === null || _a === void 0 ? void 0 : _a.id) && (where[key].entryId = id);
            ((_b = where[key]) === null || _b === void 0 ? void 0 : _b.title) &&
                (where[key] = {
                    entry: {
                        title,
                    },
                });
        }
    });
    return where;
}
function parseWhere(query) {
    var _a;
    const where = (_a = query === null || query === void 0 ? void 0 : query.where) !== null && _a !== void 0 ? _a : {};
    return nestWhere(where);
}
function parseInclude(query) {
    return Object.assign({ where: parseWhere(query) }, nestInclude(query, true));
}
function withRelations() {
    const model = Prisma.getExtensionContext(this);
    const { ones, manys } = model.relations();
    return Object.fromEntries([...ones, ...manys].map((o) => [o.name, true]));
}
function all() {
    return __awaiter(this, arguments, void 0, function* ({ relations = true, query = {} } = {}) {
        const model = Prisma.getExtensionContext(this);
        if (relations) {
            query.include = Object.assign(Object.assign({}, query === null || query === void 0 ? void 0 : query.include), model.withRelations());
        }
        const res = yield model.queryMany(query);
        return res;
    });
}
function get(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id }) {
        const model = Prisma.getExtensionContext(this);
        return yield model.queryOne({
            where: {
                entry: {
                    id: id,
                },
            },
            include: model.withRelations(),
        });
    });
}
function fields() {
    const self = Prisma.getExtensionContext(this);
    const schema = db.schema();
    return _.find(schema, (f) => f.name == self.$name);
}
function write(_a) {
    return __awaiter(this, arguments, void 0, function* ({ data, fields: { scalars, ones, manys } }) {
        const model = Prisma.getExtensionContext(this);
        const query = {
            entry: {
                connect: {
                    id: data.id,
                },
            },
        };
        scalars.forEach((field) => {
            query[field] = data[field];
        });
        ones.forEach((one) => {
            data[one] = Array.isArray(data[one]) ? data[one].at(0) : data[one];
            data[one] &&
                (query[one] = {
                    connectOrCreate: {
                        where: {
                            entryId: data[one].id,
                        },
                        create: Object.assign(Object.assign({}, _.omit(data[one], ["id", "description", "title"])), { entry: {
                                connectOrCreate: {
                                    where: {
                                        id: data[one].id,
                                    },
                                    create: {
                                        id: data[one].id,
                                        title: data[one].title,
                                    },
                                },
                            } }),
                    },
                });
        });
        manys
            .filter((m) => _.has(data, m))
            .forEach((many) => {
            query[many] = {
                connectOrCreate: data[many].map((d) => ({
                    where: {
                        entryId: d.id,
                    },
                    create: Object.assign(Object.assign({}, _.omit(d, ["id", "description", "title"])), { entry: {
                            connect: {
                                id: d.id,
                            },
                        } }),
                })),
            };
        });
        yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            yield tx[prisma_safe(sql_safe(model.$name))].upsert({
                where: {
                    entryId: data.id,
                },
                create: query,
                update: query,
            });
            (data === null || data === void 0 ? void 0 : data.description) &&
                (yield db.description.save({
                    entryId: data.id,
                    description: data.description,
                }));
        }));
    });
}
function purge(_a) {
    return __awaiter(this, arguments, void 0, function* ({ client = notion }) {
        const model = Prisma.getExtensionContext(this);
        const notion_id = yield client.databases
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
        const items = yield collectPaginatedAPI(client.databases.query, {
            database_id: notion_id,
        }).then((p) => p.map((i) => i.id));
        const tdl = yield model
            .findMany({
            select: {
                id: true,
            },
        })
            .then((f) => f.filter((c) => !items.includes(c.id)));
        tdl.forEach((t) => __awaiter(this, void 0, void 0, function* () {
            return yield model.delete({
                where: {
                    id: t.id,
                },
            });
        }));
    });
}
export default {
    sync,
    purge,
    resurface,
    relations,
    write,
    get,
    all,
    withRelations,
    parseWhere,
    nestInclude,
    parseInclude,
    last_updated,
    fields,
};
