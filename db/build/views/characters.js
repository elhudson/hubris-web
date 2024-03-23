var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prisma, db } from "~db/prisma.js";
import _ from "lodash";
import { boost } from "~db/utils.js";
import rules from "~db/rules.json" with { type: "json" };
function create(_a) {
    return __awaiter(this, arguments, void 0, function* ({ model, operation, args, query }) {
        const data = args;
        for (var code of ["str", "dex", "con", "int", "wis", "cha"]) {
            if (_.isUndefined(data[code])) {
                data[code] = boost(data, code) ? -1 : -2;
            }
        }
        yield prisma.$transaction([
            query({
                data: Object.assign(Object.assign({}, _.omit(data, ["health", "HD", "inventories"])), { xp_earned: 6, classes: {
                        connect: data.classes.map((c) => ({
                            entryId: c.id
                        }))
                    }, skills: {
                        connect: data.backgrounds
                            .filter((c) => { var _a; return (_a = c.skills) === null || _a === void 0 ? void 0 : _a.id; })
                            .map((s) => ({
                            entryId: s.skills.id
                        }))
                    }, burn: 0, backgrounds: {
                        connect: data.backgrounds.map((c) => ({
                            entryId: c.id
                        }))
                    }, user: {
                        connect: {
                            id: data.user.id
                        }
                    } })
            }),
            prisma.health.create(data),
            prisma.inventories.create(data)
        ]);
    });
}
function destructure({ fields, query = {} }) {
    var _a;
    Object.keys((_a = query === null || query === void 0 ? void 0 : query.include) !== null && _a !== void 0 ? _a : {})
        .filter((f) => fields.includes(f))
        .forEach((tbl) => {
        query.include[tbl] = prisma.characters.parseInclude(query.include[tbl], true);
    });
    query.include.inventory = {
        include: {
            weapons: {
                include: {
                    entry: true,
                    tags: true
                }
            },
            armor: {
                include: {
                    entry: true
                }
            },
            items: {
                include: {
                    entry: true
                }
            }
        }
    };
    query.where = prisma.characters.parseWhere(query);
    return query;
}
function restructure({ fields, result }) {
    Object.keys(result)
        .filter((f) => fields.includes(f))
        .forEach((key) => {
        result[key] = result[key].map((k) => prisma.characters.resurface(key, k));
    });
    return _.omit(Object.assign(Object.assign({}, result), { inventory: {
            weapons: result.inventory.weapons.map((w) => (Object.assign(Object.assign({}, w.entry), w))),
            armor: result.inventory.armor.map((w) => (Object.assign(Object.assign({}, w.entry), w)))
        } }), Object.keys(result).filter((r) => r.includes("Id")));
}
function getFields() {
    return [
        ...prisma.characters
            .relations()
            .manys.filter((f) => rules.includes(f.type))
            .map((a) => a.name)
    ];
}
function findMany(_a) {
    return __awaiter(this, arguments, void 0, function* ({ model, operation, args, query }) {
        const fields = getFields();
        const res = yield query(destructure({ query: args, fields })).then((result) => result.map((r) => restructure({ fields, result: r })));
        return res;
    });
}
function findFirst(_a) {
    return __awaiter(this, arguments, void 0, function* ({ model, operation, args, query }) {
        const fields = getFields();
        const res = yield query(destructure({ query: args, fields })).then((result) => restructure({ fields, result }));
        return res;
    });
}
function update(_a) {
    return __awaiter(this, arguments, void 0, function* ({ model, operation, args, query }) {
        var _b;
        const character = args;
        const campaign = yield db.characters.campaign({
            id: character.id
        });
        yield prisma.$transaction([
            query({
                where: {
                    id: character.id
                },
                data: {
                    biography: character.biography,
                    xp_earned: (_b = campaign === null || campaign === void 0 ? void 0 : campaign.xp) !== null && _b !== void 0 ? _b : character.xp_earned,
                    burn: character.burn,
                    classes: {
                        set: character.classes.map((i) => ({
                            entryId: i.id
                        }))
                    },
                    backgrounds: {
                        set: character.backgrounds.map((i) => ({
                            entryId: i.id
                        }))
                    },
                    effects: {
                        set: character === null || character === void 0 ? void 0 : character.effects.map((i) => ({
                            entryId: i.id
                        }))
                    },
                    ranges: {
                        set: character === null || character === void 0 ? void 0 : character.ranges.map((i) => ({
                            entryId: i.id
                        }))
                    },
                    durations: {
                        set: character === null || character === void 0 ? void 0 : character.durations.map((i) => ({
                            entryId: i.id
                        }))
                    },
                    class_features: {
                        set: character === null || character === void 0 ? void 0 : character.class_features.map((i) => ({
                            entryId: i.id
                        }))
                    },
                    tag_features: {
                        set: character === null || character === void 0 ? void 0 : character.tag_features.map((i) => ({
                            entryId: i.id
                        }))
                    },
                    skills: {
                        set: character.skills.map((i) => ({
                            entryId: i.id
                        }))
                    },
                    str: character.str,
                    dex: character.dex,
                    con: character.con,
                    int: character.int,
                    wis: character.wis,
                    cha: character.cha
                }
            }),
            prisma.health.update(character),
            prisma.inventories.update(character)
        ]);
    });
}
export default { create, findFirst, findMany, update };
