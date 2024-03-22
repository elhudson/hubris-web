import { Prisma } from "@prisma/client";

import { prisma_safe, sql_safe } from "~db/utils.js";

import _ from "lodash";

import { db } from "~db/prisma.js";

export const tables = async () =>
  await db.$queryRaw`
    SELECT
      table_name
    FROM
      information_schema.tables
    WHERE
      table_type = "BASE TABLE"
    AND table_schema LIKE "hubris"
  `.then((result) =>
    result.map((d) => d["TABLE_NAME"]).filter((f) => f[0] != "_")
  );

export default async () => {
  const tabls = await tables().then((r) => r.map((t) => sql_safe(t)));
  tabls.push("requires", "required_for");
  const schema = Object.fromEntries(
    Prisma.dmmf.datamodel.models.map((m) => [
      prisma_safe(sql_safe(m.name)),
      m.fields
        .filter((f) => tabls.includes(f.name))
        .map((n) => n.name)
        .filter((f) => !f.includes("Id") || f == "rangeId" || f == "durationId")
    ])
  );
  return schema;
};

export const get_schema = (table_name) => {
  const r=_.find(
    Prisma.dmmf.datamodel.models,
    (f) => f.name.toLowerCase() == sql_safe(table_name)
  );
  return r
};
