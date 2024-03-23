var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Prisma } from "@prisma/client";
import { db } from "~db/prisma.js";
import { v4 } from "uuid";
function make(_a) {
    return __awaiter(this, arguments, void 0, function* ({ heavy, martial, uses, dtype, name, owner, description }) {
        const self = Prisma.getExtensionContext(this);
        const id = v4();
        yield self.create({
            data: {
                heavy,
                martial,
                tags: {
                    connect: dtype
                },
                uses: {
                    connect: uses
                },
                owned_by: {
                    connect: {
                        charactersId: owner.id
                    }
                },
                entry: {
                    create: {
                        id,
                        title: name
                    }
                }
            }
        });
        yield db.description.save({ entryId: id, description });
    });
}
function def(_a) {
    return __awaiter(this, arguments, void 0, function* ({ character }) {
        var _b;
        const self = Prisma.getExtensionContext(this);
        const dtype = yield db.tags.queryOne({
            where: {
                entry: {
                    title: "Piercing"
                }
            }
        });
        yield self.make({
            martial: character.classes[0].weaponry == "Martial",
            heavy: false,
            name: "Dagger",
            dtype: {
                entryId: (_b = dtype.id) !== null && _b !== void 0 ? _b : dtype.entryId
            },
            owner: {
                id: character.id
            },
            uses: {
                code: "str"
            },
            description: [
                {
                    index: 0,
                    plaintext: "A must-have for adventurers, no matter how powerful. Don't leave camp without it!"
                }
            ]
        });
    });
}
function save(weapon) {
    return __awaiter(this, void 0, void 0, function* () {
        const self = Prisma.getExtensionContext(this);
        yield self.update({
            where: {
                entryId: weapon.id
            },
            data: {
                entry: {
                    update: {
                        title: weapon.title
                    }
                },
                heavy: weapon.heavy,
                martial: weapon.martial,
                tags: {
                    connect: Array.isArray(weapon.tags)
                        ? weapon.tags.map((c) => { var _a; return ({ entryId: (_a = c.id) !== null && _a !== void 0 ? _a : c.entryId }); })
                        : {
                            entryId: weapon.tags.entryId
                        }
                },
                uses: {
                    connect: {
                        code: weapon.attrCode
                    }
                }
            }
        });
        yield db.description.save({
            entryId: weapon.id,
            description: weapon.description
        });
    });
}
export default { def, make, save };
