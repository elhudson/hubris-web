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
import "dotenv/config";
import { notion } from "../notion";
import { get_schema } from "~db/schema.js";
import rules from "~db/rules.json" with { type: "json" };
function sync(_a) {
    return __awaiter(this, arguments, void 0, function* ({ client = notion }) {
        const self = Prisma.getExtensionContext(this);
        const rules = yield client.databases
            .query({
            database_id: process.env.NOTION_CORE_RULES,
            filter: {
                property: "Config",
                checkbox: {
                    equals: true
                }
            }
        })
            .then((c) => c.results.map((c) => ({
            title: c.title[0].plain_text,
            config: true
        })))
            .then((j) => __awaiter(this, void 0, void 0, function* () {
            return j.concat(yield client.databases
                .query({
                database_id: process.env.NOTION_CORE_RULES,
                filter: {
                    property: "Config",
                    checkbox: {
                        equals: false
                    }
                }
            })
                .then((a) => a.results.map((c) => ({
                title: c.title[0].plain_text,
                config: false
            }))));
        }));
        rules.forEach((rule) => __awaiter(this, void 0, void 0, function* () {
            yield self.upsert({
                where: {
                    title: rule.title
                },
                update: rule,
                create: rule
            });
        }));
    });
}
function fields({ name }) {
    var _a;
    const fields = (_a = get_schema(name)) === null || _a === void 0 ? void 0 : _a.fields;
    const scalars = fields.filter((f) => f.kind == "scalar");
    const rule_fields = fields.filter((f) => f.kind == "object" && rules.includes(f.type));
    return {
        scalars,
        ones: rule_fields.filter((r) => !r.isList),
        manys: rule_fields.filter((r) => r.isList)
    };
}
export default { sync, fields };
