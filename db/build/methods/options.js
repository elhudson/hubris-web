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
function hd(character) {
    return __awaiter(this, void 0, void 0, function* () {
        return character.HD;
    });
}
function skills() {
    return __awaiter(this, void 0, void 0, function* () {
        return db.skills.all();
    });
}
function attributes() {
    return __awaiter(this, void 0, void 0, function* () {
        return db.attributes.all();
    });
}
function class_features(character) {
    return __awaiter(this, void 0, void 0, function* () {
        return db.class_Features.queryMany({
            where: {
                OR: character.classes.map((c) => ({
                    classes: {
                        entryId: c.id
                    }
                })),
                tier: {
                    lte: character.tier()
                }
            },
            include: {
                classes: true,
                class_paths: true,
                requires: true,
                required_for: true
            }
        });
    });
}
function backgrounds() {
    return __awaiter(this, void 0, void 0, function* () {
        return db.backgrounds.all();
    });
}
function classes() {
    return __awaiter(this, void 0, void 0, function* () {
        return db.classes.all();
    });
}
function tag_features(character) {
    return __awaiter(this, void 0, void 0, function* () {
        const tags = character.tags();
        return db.tag_Features.queryMany({
            where: {
                OR: tags.map((t) => ({
                    tags: {
                        entryId: t.id
                    }
                })),
                tier: {
                    lte: character.tier()
                }
            },
            include: {
                tags: true,
                requires: true,
                required_for: true
            }
        });
    });
}
function effects(character) {
    return __awaiter(this, void 0, void 0, function* () {
        const tags = character.tags();
        return db.effects.queryMany({
            where: {
                OR: tags.map((t) => ({
                    tags: {
                        some: {
                            entryId: t.id
                        }
                    }
                })),
                tier: {
                    lte: character.tier()
                }
            },
            include: {
                trees: true,
                tags: true,
                requires: true,
                required_for: true,
                range: true,
                duration: true
            }
        });
    });
}
function ranges(character) {
    return __awaiter(this, void 0, void 0, function* () {
        return db.ranges.queryMany({
            where: {
                trees: {
                    some: {}
                },
                tier: {
                    lte: character.tier()
                }
            },
            include: {
                trees: true,
                requires: true,
                required_for: true
            }
        });
    });
}
function durations(character) {
    return __awaiter(this, void 0, void 0, function* () {
        return db.durations.queryMany({
            where: {
                trees: {
                    some: {}
                },
                tier: {
                    lte: character.tier()
                }
            },
            include: {
                trees: true,
                requires: true,
                required_for: true
            }
        });
    });
}
export default {
    class_features,
    backgrounds,
    classes,
    tag_features,
    effects,
    ranges,
    skills,
    durations,
    attributes,
    hd
};
