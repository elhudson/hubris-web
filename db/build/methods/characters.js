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
import _ from "lodash";
import { db } from "~db/prisma.js";
import { character as instance } from "~db.models";
import { options } from "~db.methods";
function character(data) {
    const parent = instance(data);
    return Object.assign(Object.assign({}, parent), { options: {
            update: {
                class_features: () => options.class_features(parent),
                backgrounds: () => options.backgrounds(),
                classes: () => options.classes().then((c) => c.map((a) => (Object.assign(Object.assign({}, a), { xp: 4 })))),
                tag_features: () => options.tag_features(parent),
                effects: () => options.effects(parent),
                ranges: () => options.ranges(parent),
                durations: () => options.durations(parent),
                skills: () => options.skills(),
                hd: () => options.hd(parent)
            },
            create: {
                backgrounds: () => options.backgrounds(),
                classes: () => options.classes(),
                skills: () => options.skills(),
                attributes: () => options.attributes()
            }
        } });
}
function get(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id = null, where = null }) {
        const self = Prisma.getExtensionContext(this);
        var character = yield self[id ? "findFirst" : "findMany"]({
            where: where !== null && where !== void 0 ? where : {
                id: id
            },
            include: {
                profile: false,
                campaign: true,
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
                        trees: true,
                        area: true,
                        range: true
                    }
                },
                durations: {
                    include: {
                        trees: true,
                        duration: true
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
                        classes: true,
                        class_paths: true
                    }
                },
                tag_features: {
                    include: {
                        tags: true
                    }
                },
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
        character && (character.HD = _.uniqBy(character === null || character === void 0 ? void 0 : character.HD, (f) => f.die.title));
        return character;
    });
}
function acquire(_a) {
    return __awaiter(this, arguments, void 0, function* ({ item, type }) { });
}
function buyable(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { options } = character(data);
        const { update } = options;
        return {
            class_features: yield update.class_features(),
            tag_features: yield update.tag_features(),
            effects: yield update.effects(),
            ranges: yield update.ranges(),
            durations: yield update.durations(),
            skills: yield update.skills(),
            classes: yield update.classes(),
            hd: yield update.hd()
        };
    });
}
function init(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { options } = character(data);
        const { create } = options;
        return {
            classes: yield create.classes(),
            backgrounds: yield create.backgrounds(),
            attributes: yield create.attributes(),
            skills: yield create.skills()
        };
    });
}
function campaign(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id }) {
        const campaign = yield db.campaigns.findFirst({
            where: {
                characters: {
                    some: {
                        id: id
                    }
                }
            }
        });
        return campaign;
    });
}
export default { get, acquire, buyable, init, campaign, character };
