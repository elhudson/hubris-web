var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { db, prisma } from "~db/prisma.js";
function create(_a) {
    return __awaiter(this, arguments, void 0, function* ({ model, operation, args, query }) {
        const character = args;
        const uninjured = yield db.injuries.queryOne({
            where: {
                entry: {
                    title: "Uninjured"
                }
            }
        });
        yield query({
            data: {
                hp: character.max_hp(character),
                injuries: {
                    connect: {
                        entryId: uninjured.id
                    }
                },
                character: {
                    connect: {
                        id: character.id
                    }
                }
            }
        });
        yield db.hD.create(character);
    });
}
function update(_a) {
    return __awaiter(this, arguments, void 0, function* ({ model, operation, args, query }) {
        const character = args;
        yield prisma.$transaction([
            query({
                where: {
                    charactersId: character.id
                },
                data: {
                    hp: character.hp,
                    injuries: {
                        set: {
                            entryId: character.health.injuries.id
                        }
                    },
                    character: {
                        connect: {
                            id: character.id
                        }
                    }
                }
            }),
            db.hD.update(character)
        ]);
    });
}
export default { create, update };
