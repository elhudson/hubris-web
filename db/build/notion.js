var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Client } from "@notionhq/client";
import "dotenv/config";
import _ from "lodash";
import { get_schema } from "~db/schema.js";
import { sql_safe } from "~db/utils.js";
export const notion = new Client({
    auth: process.env.NOTION_TOKEN
});
export function get_tables(client) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client.databases
            .query({
            database_id: process.env.NOTION_CORE_RULES
        })
            .then((r) => r.results
            .filter((r) => r.object == "database")
            .map((r) => __awaiter(this, void 0, void 0, function* () { return yield client.databases.retrieve({ database_id: r.id }); })))
            .then((r) => Promise.all(r));
    });
}
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export const property_parser = (_a, ...args_1) => __awaiter(void 0, [_a, ...args_1], void 0, function* ([label, data], client = null) {
    var extracted;
    const handler = (property, alg) => {
        try {
            return alg(property);
        }
        catch (Error) {
            return property.type == "number" ? 0 : "";
        }
    };
    switch (data.type) {
        case "formula": {
            extracted = label.includes("Id")
                ? yield get_linked_page(data.formula.string, client)
                : handler(data, (d) => [
                    {
                        index: 0,
                        plaintext: d.formula.string
                    }
                ]);
            break;
        }
        case "title": {
            extracted = handler(data, (d) => d.title[0].plain_text);
            break;
        }
        case "checkbox": {
            extracted = handler(data, (d) => (d.checkbox == true ? true : false));
            break;
        }
        case "rich_text": {
            extracted = handler(data, (d) => {
                return parse_block(d);
            });
            break;
        }
        case "select": {
            extracted = handler(data, (d) => label == "Tier"
                ? Number(d.select.name.split("T").at(-1))
                : d.select.name);
            break;
        }
        case "number": {
            extracted = handler(data, (d) => d.number);
            break;
        }
        case "relation": {
            const ids = data.relation.map((a) => a.id);
            const ps = [];
            for (var id of ids) {
                const obj = yield get_linked_page(id, client);
                ps.push(obj);
            }
            extracted = ps;
            break;
        }
    }
    return [sql_safe(label.replace("Id", "")), extracted];
});
function get_linked_page(id, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield get_page(client, id);
        const props = yield Promise.all(Object.entries(res.properties)
            .filter((f) => f[1].type != "relation" && !f[0].includes("Id"))
            .map((prop) => property_parser(prop, client)));
        const obj = Object.assign({ id: res.id }, Object.fromEntries(props));
        // const desc = await get_description(id, client);
        // obj.description = desc;
        return obj;
    });
}
export const get_page = (cl, id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cl.pages
        .retrieve({
        page_id: id
    })
        .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(err);
        if ((err === null || err === void 0 ? void 0 : err.status) == 429) {
            yield sleep(1000 * err.headers["retry-after"]);
            return yield get_page(cl, id);
        }
    }));
});
const parse_block = (block) => {
    const self = [];
    if ((block === null || block === void 0 ? void 0 : block.type) == "paragraph") {
        block.paragraph.rich_text.forEach((node) => {
            var _a;
            const item = {
                plaintext: node.plain_text
            };
            if (node.type == "mention" && ((_a = node === null || node === void 0 ? void 0 : node.mention.page) === null || _a === void 0 ? void 0 : _a.id)) {
                item.link = {
                    target: {
                        title: node.plain_text,
                        id: node.mention.page.id
                    }
                };
            }
            self.push(item);
        });
    }
    if (block === null || block === void 0 ? void 0 : block.has_children) {
        self.push(...parse_block(block.children));
    }
    return self.map((s) => (Object.assign(Object.assign({}, s), { index: self.indexOf(s) })));
};
export function get_description(id, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const { results } = yield client.blocks.children
            .list({
            block_id: id
        })
            .catch((err) => __awaiter(this, void 0, void 0, function* () {
            console.log(err);
            if ((err === null || err === void 0 ? void 0 : err.status) == 429) {
                yield sleep(1000 * err.headers["retry-after"]);
                return yield get_description(id, client);
            }
        }));
        const res = _.flatMap(results, (p) => parse_block(p));
        return res;
    });
}
export function parse_page(page_1, client_1) {
    return __awaiter(this, arguments, void 0, function* (page, client, filter = []) {
        var props = Object.entries(page.properties);
        filter.length > 0 && (props = props.filter((f) => filter.includes(f)));
        const obj = {
            id: page.id
        };
        for (var [label, data] of props) {
            const [field, info] = yield property_parser([label, data], client);
            obj[field] = info;
        }
        return obj;
    });
}
export function get_fields(table_name) {
    const schema = get_schema(table_name);
    return {
        scalars: schema.fields
            .filter((f) => f.kind == "scalar")
            .map((f) => f.name)
            .filter((f) => !f.includes("Id")),
        ones: schema.fields
            .filter((f) => f.kind == "object" && f.name != "entry" && f.isList == false)
            .map((f) => f.name),
        manys: schema.fields
            .filter((f) => f.kind == "object" && f.isList)
            .map((f) => f.name)
    };
}
export function make_query({ ones, manys }, data) {
    return Object.assign(Object.assign(Object.assign({}, data), Object.fromEntries(manys
        .filter((r) => _.has(data, r))
        .map((r) => [
        r,
        {
            connectOrCreate: data[r].map((tie) => ({
                where: {
                    id: tie.id
                },
                create: tie
            }))
        }
    ]))), Object.fromEntries(ones
        .filter((r) => _.has(data, r))
        .map((r) => [
        r,
        {
            connectOrCreate: {
                where: {
                    id: data[r][0].id
                },
                create: data[r][0]
            }
        }
    ])));
}
