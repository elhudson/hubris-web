import { get_tables, property_parser } from "./helpers.js";
import { Client } from "@notionhq/client";
import { NotionRenderer, createBlockRenderer } from "@notion-render/client";
import "dotenv/config";
import fs from "fs";
import _ from "lodash";
import { db } from "../connections.js";
import { prisma_safe } from "utilities";

const mentionRenderer = createBlockRenderer("mention", (data) => {
  const id = data.mention.page?.id;
  const text = data.plain_text;
  return `[[${text}|${id}]]`;
});

const renderer = new NotionRenderer({
  renderers: [mentionRenderer],
  client: new Client({
    auth: process.env.NOTION_TOKEN,
  }),
});

export async function get_description(id, client) {
  const { results } = await client.blocks.children.list({
    block_id: id,
  });
  const html = await renderer.render(...results).then(r=> r.trim())
  return html;
}

export async function parse_page(page, client) {
  const props = Object.entries(page.properties);
  const obj = {
    id: page.id,
  };
  for (var [label, data] of props) {
    const [field, info] = await property_parser([label, data], client);
    obj[field] = info;
  }
  return obj;
}
