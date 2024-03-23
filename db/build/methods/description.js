import { db, prisma } from "~db/prisma.js";
import { Prisma } from "@prisma/client";
import { get_description } from "../notion";
function sync({ client, entry }) {
    const self = Prisma.getExtensionContext(this);
    return get_description(entry.id, client).then((res) => self.save({ entry, description: res }));
}
function save({ entry, entryId, description }) {
    if (description) {
        prisma.$transaction(description.map((item) => { var _a; return db.content.save({ src: (_a = entry === null || entry === void 0 ? void 0 : entry.id) !== null && _a !== void 0 ? _a : entryId, block: item }); }));
    }
}
export default { sync, save };
