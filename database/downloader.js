import { get_tables, property_parser } from "./helpers.js";
import { Client } from "@notionhq/client";
import "dotenv/config";
import fs from "fs";
import progress from "cli-progress";

export async function parse_page(page, client) {
  const props = Object.entries(page.properties);
  const obj = {
    id: page.id
  };
  for (var [label, data] of props) {
    const [field, info] = await property_parser([label, data], client);
    obj[field] = info;
  }
  return obj
}

