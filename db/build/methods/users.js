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
function characters(_a) {
    return __awaiter(this, arguments, void 0, function* ({ username }) {
        const chars = yield db.characters.get({
            where: {
                user: {
                    username: username,
                },
            },
        });
        return chars;
    });
}
function campaigns(_a) {
    return __awaiter(this, arguments, void 0, function* ({ username }) {
        const include = {
            settings: true,
            dm: true
        };
        const dm = yield db.campaigns.findMany({
            where: {
                dm: {
                    username: username,
                },
            },
            include,
        });
        const player = yield db.campaigns.findMany({
            where: {
                characters: {
                    some: {
                        user: {
                            username: username,
                        },
                    },
                },
            },
            include,
        });
        return { dm, player };
    });
}
export default { characters, campaigns };
