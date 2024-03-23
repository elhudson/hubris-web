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
import { character } from "~db.models";
function save(_a) {
    return __awaiter(this, arguments, void 0, function* ({ char }) {
        const self = Prisma.getExtensionContext(this);
        _.find(char.HD, (f) => f.src == "default").max = character.tier(char);
        for (var kind of char.HD) {
            const data = {
                used: Number(kind.used),
                max: Number(kind.max),
                src: kind.src,
                owner: {
                    connect: {
                        id: kind.charactersId
                    }
                },
                die: {
                    connect: kind.die
                }
            };
            yield self.upsert({
                where: {
                    id: kind.id
                },
                update: data,
                create: data
            });
        }
    });
}
export default { save };
