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
    return __awaiter(this, arguments, void 0, function* ({ name, description, cls, owner }) {
        const self = Prisma.getExtensionContext(this);
        const id = v4();
        yield self.create({
            data: {
                entry: {
                    create: {
                        id,
                        title: name
                    }
                },
                owned_by: {
                    connect: {
                        charactersId: owner.id
                    }
                },
                class: cls
            }
        });
        yield db.description.save({ entryId: id, description });
    });
}
function def(_a) {
    return __awaiter(this, arguments, void 0, function* ({ character }) {
        const self = Prisma.getExtensionContext(this);
        const cls = character.classes[0].armory;
        yield self.make({
            cls,
            owner: {
                id: character.id
            },
            name: `${cls} Armor`,
            description: [
                {
                    index: 0,
                    plaintext: `A simple set of ${cls.toLowerCase()} armor.`
                }
            ]
        });
    });
}
function save(armor) {
    return __awaiter(this, void 0, void 0, function* () {
        const self = Prisma.getExtensionContext(this);
        yield self.update({
            where: {
                entryId: armor.id
            },
            data: {
                entry: {
                    update: {
                        title: armor.name
                    }
                },
                class: armor.class
            }
        });
        yield db.description.save({
            entryId: armor.id,
            description: armor.description
        });
    });
}
export default { def, make, save };
