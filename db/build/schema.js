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
import { prisma_safe, sql_safe } from "~db/utils.js";
import _ from "lodash";
import { db } from "~db/prisma.js";
export const tables = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db.$queryRaw `
    SELECT
      table_name
    FROM
      information_schema.tables
    WHERE
      table_type = "BASE TABLE"
    AND table_schema LIKE "hubris"
  `.then((result) => result.map((d) => d["TABLE_NAME"]).filter((f) => f[0] != "_"));
});
export default () => __awaiter(void 0, void 0, void 0, function* () {
    const tabls = yield tables().then((r) => r.map((t) => sql_safe(t)));
    tabls.push("requires", "required_for");
    const schema = Object.fromEntries(Prisma.dmmf.datamodel.models.map((m) => [
        prisma_safe(sql_safe(m.name)),
        m.fields
            .filter((f) => tabls.includes(f.name))
            .map((n) => n.name)
            .filter((f) => !f.includes("Id") || f == "rangeId" || f == "durationId")
    ]));
    return schema;
});
export const get_schema = (table_name) => {
    const r = _.find(Prisma.dmmf.datamodel.models, (f) => f.name.toLowerCase() == sql_safe(table_name));
    return r;
};
