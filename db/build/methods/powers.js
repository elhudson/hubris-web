var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { db } from "~db/prisma.js";
function make(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, name, flavortext, effects, ranges, durations, characters = null, creator, }) {
        yield db.powers.create({
            data: {
                id: id,
                name: name,
                flavortext: flavortext,
                creator: {
                    connect: {
                        id: creator.id,
                    },
                },
                characters: {
                    connect: characters === null || characters === void 0 ? void 0 : characters.map((c) => ({
                        id: c.id,
                    })),
                },
                ranges: {
                    connect: ranges.map((r) => ({
                        id: r.id,
                    })),
                },
                durations: {
                    connect: durations.map((r) => ({
                        id: r.id,
                    })),
                },
                effects: {
                    connect: effects.map((r) => ({
                        id: r.id,
                    })),
                },
            },
        });
    });
}
function edit(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, name, flavortext, effects, ranges, durations, characters = null, creator, }) {
        const q = {
            where: {
                id: id,
            },
            data: {
                name: name,
                flavortext: flavortext,
                creator: {
                    connect: {
                        id: creator.id,
                    },
                },
                ranges: {
                    set: ranges.map((r) => ({
                        id: r.id,
                    })),
                },
                durations: {
                    set: durations.map((r) => ({
                        id: r.id,
                    })),
                },
                effects: {
                    set: effects.map((r) => ({
                        id: r.id,
                    })),
                },
            },
        };
        characters &&
            (q.characters = {
                set: characters.map((c) => ({
                    id: c.id,
                })),
            });
        yield db.powers.update(q);
    });
}
function save(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.powers.make(data).catch((err) => __awaiter(this, void 0, void 0, function* () { return yield db.powers.edit(data); }));
    });
}
export default { make, edit, save };
