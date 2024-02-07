import prisma, { get_schema } from "./schema.js";
import fs from "fs";
import { db } from "./connections.js";
import _ from "lodash";
import progress from "cli-progress";

export function get_fields(table_name) {
  const schema = get_schema(table_name);
  return {
    ones: schema.fields
      .filter((f) => f.kind == "object" && f.isList == false)
      .map((f) => f.name),
    manys: schema.fields
      .filter((f) => f.kind == "object" && f.isList)
      .map((f) => f.name)
  };
}

export function make_query({ ones, manys }, data) {
  return {
    ...data,
    ...Object.fromEntries(
      manys
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
        ])
    ),
    ...Object.fromEntries(
      ones
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
        ])
    )
  };
}