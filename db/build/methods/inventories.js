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
function save(_a) {
    return __awaiter(this, arguments, void 0, function* ({ inventory }) {
        for (var table of ["armor", "weapons", "items"]) {
            for (var item of inventory[table]) {
                if (item.tags) {
                    item = Object.assign(Object.assign({}, Object.fromEntries(Object.keys(item)
                        .filter((f) => !f.includes("Id"))
                        .map((k) => [k, item[k]]))), { tags: {
                            connect: item.tags
                        } });
                }
                yield db[table].upsert({
                    where: {
                        id: item.id
                    },
                    update: item,
                    create: item
                });
            }
        }
    });
}
function add(_a) {
    return __awaiter(this, arguments, void 0, function* ({ item, table, character }) {
        const query = Object.assign({}, item);
        table == "weapons" &&
            (query.tags = {
                connect: item.tags
            });
        yield db.inventories.update({
            where: {
                charactersId: character
            },
            data: {
                [table]: {
                    upsert: {
                        where: {
                            id: item.id
                        },
                        create: query,
                        update: query
                    }
                }
            }
        });
    });
}
export default { save, add };
