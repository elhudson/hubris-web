var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "dotenv/config";
import { Prisma } from "@prisma/client";
import _ from "lodash";
import { collectPaginatedAPI } from "@notionhq/client";
import { prisma } from "~db/prisma.js";
import progress from "cli-progress";
function sync(_a) {
    return __awaiter(this, arguments, void 0, function* ({ client }) {
        const model = Prisma.getExtensionContext(this);
        const pages = yield client.databases
            .query({
            database_id: process.env.NOTION_CORE_RULES
        })
            .then(({ results }) => results.map((result) => collectPaginatedAPI(client.databases.query, {
            database_id: result.id
        })))
            .then((p) => Promise.all(p))
            .then((a) => a.flat(1));
        const bar = new progress.SingleBar({}, progress.Presets.shades_classic);
        bar.start(pages.length, 0);
        for (var page of pages) {
            const title = page.properties.Title.title[0].plain_text;
            yield model.save({
                client,
                entry: {
                    id: page.id,
                    title: title
                }
            });
            bar.update(pages.indexOf(page) + 1);
        }
        bar.stop();
    });
}
function save(_a) {
    return __awaiter(this, arguments, void 0, function* ({ client, entry }) {
        yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            yield tx.entry.upsert({
                where: {
                    id: entry.id
                },
                update: entry,
                create: entry
            });
            yield tx.description.sync({ client, entry });
        }));
    });
}
export default { sync, save };
