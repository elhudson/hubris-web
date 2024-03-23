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
        yield query({
            data: {
                character: {
                    connect: {
                        id: character.id
                    }
                }
            }
        });
        yield db.weapons.def({ character });
        yield db.armor.def({ character });
    });
}
function update(_a) {
    return __awaiter(this, arguments, void 0, function* ({ model, operation, args, query }) {
        var _b, _c;
        const character = args;
        yield query({
            where: {
                charactersId: character.id
            },
            data: {
                wielding: {
                    update: {
                        entryId: (_b = character.inventory.wielding) === null || _b === void 0 ? void 0 : _b.id
                    }
                },
                wearing: {
                    update: {
                        entryId: (_c = character.inventory.wearing) === null || _c === void 0 ? void 0 : _c.id
                    }
                }
            }
        });
        yield character.inventory.weapons.map((c) => db.weapons.save(c));
        yield character.inventory.armor.map((c) => db.armor.save(c));
    });
}
export default { create, update };
