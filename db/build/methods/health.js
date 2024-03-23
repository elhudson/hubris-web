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
function save(_a) {
    return __awaiter(this, arguments, void 0, function* ({ character }) {
        const model = Prisma.getExtensionContext(this);
        yield model.update({
            where: {
                id: item.id
            },
            data: {
                injuries: {
                    connect: {
                        entryId: character.injuries.id
                    }
                },
                hp: character.hp
            }
        });
        yield db.hD.save({ char: character });
    });
}
export default { save };
