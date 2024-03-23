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
import _ from "lodash";
function retrieve(_a) {
    return __awaiter(this, arguments, void 0, function* ({ where = null, id = null }) {
        return yield db.campaigns.findFirst({
            where: where !== null && where !== void 0 ? where : {
                id: id,
            },
            include: {
                characters: {
                    include: {
                        user: true,
                        classes: true,
                        backgrounds: true,
                        effects: {
                            include: {
                                range: true,
                                duration: true,
                            },
                        },
                        class_features: true,
                        tag_features: true,
                        ranges: true,
                        durations: true,
                        HD: {
                            include: {
                                die: true,
                            },
                        },
                        skills: true,
                    },
                },
                dm: true,
                settings: true,
                logbook: {
                    include: {
                        author: true,
                    },
                },
            },
        });
    });
}
function make(_a) {
    return __awaiter(this, arguments, void 0, function* ({ data }) {
        return yield db.campaigns.create({
            data: {
                name: data.name,
                description: data.description,
                settings: {
                    connect: data.settings.map((s) => ({ id: s.id })),
                },
                creator: {
                    connect: {
                        id: data.creator.user_id,
                    },
                },
                dm: {
                    connect: {
                        id: data.dm.user_id,
                    },
                },
            },
        });
    });
}
function save(_a) {
    return __awaiter(this, arguments, void 0, function* ({ data }) {
        const characters = yield db.characters.findMany({
            select: {
                id: true,
            },
        });
        yield db.campaigns.update({
            where: {
                id: data.id,
            },
            data: {
                id: data.id,
                description: data.description,
                xp: data.xp,
                sessionCount: Number(data.sessionCount),
                settings: {
                    connect: data.settings.map((s) => ({ id: s.id })),
                },
                characters: {
                    connect: data.characters.map((c) => ({
                        id: c.id,
                    })),
                    disconnect: _.xorBy(data.characters, characters, "id").map((char) => ({
                        id: char.id,
                    })),
                },
                dm: {
                    connect: {
                        id: data.dm.id,
                    },
                },
            },
        });
    });
}
function players(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id = null, where = null }) {
        const { characters } = yield db.campaigns.retrieve({ id, where });
        const users = characters.map((c) => c.user);
        return users;
    });
}
function transfer(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, dm }) {
        yield db.campaigns.update({
            where: {
                id: id,
            },
            data: {
                dm: {
                    connect: {
                        id: dm,
                    },
                },
            },
        });
    });
}
function summarize(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, session }) {
        var data;
        const exists = yield db.summaries.retrieve({
            where: {
                campaign: {
                    id: id,
                },
                session: session,
            },
        });
        if (!exists) {
            data = yield db.summaries.create({
                data: {},
            });
        }
    });
}
export default { retrieve, make, save, transfer, players };
