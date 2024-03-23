var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import _ from "lodash";
import { character } from "~db.models";
import { db } from "~db/prisma.js";
function create(_a) {
    return __awaiter(this, arguments, void 0, function* ({ model, operation, args, query }) {
        const character = args;
        yield query({
            data: {
                max: 1,
                used: 0,
                die: {
                    connect: {
                        entryId: character.classes[0].hit_dice.id
                    }
                },
                owner: {
                    connect: {
                        id: character.id
                    }
                }
            }
        });
    });
}
function upsert(_a) {
    return __awaiter(this, arguments, void 0, function* ({ model, operation, args, query }) {
        var { data, where } = args;
        data = {
            used: Number(data.used),
            max: Number(data.max),
            src: data.src,
            owner: {
                connect: {
                    id: where.id.charactersId
                }
            },
            die: {
                connect: {
                    entryId: data.die.entryId
                }
            }
        };
        yield query({
            where: args.where,
            create: data,
            update: data
        });
    });
}
function update(_a) {
    return __awaiter(this, arguments, void 0, function* ({ model, operation, args, query }) {
        const char = args;
        _.find(char.HD, (f) => f.src == "default").max = character.tier(char);
        for (var kind of char.HD) {
            yield db.hD.upsert({
                where: {
                    id: {
                        charactersId: char.id,
                        src: kind.src,
                        hit_diceId: kind.die.entryId
                    }
                },
                data: kind
            });
        }
    });
}
export default { create, update, upsert };
