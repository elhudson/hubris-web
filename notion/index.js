import { Client } from "@notionhq/client";

export default notion = new Client({
  auth: process.env.NOTION_TOKEN
});