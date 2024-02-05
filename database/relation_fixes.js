import { property_parser } from "./helpers.js";
import { Client } from "@notionhq/client";
import "dotenv/config";

const cfs = "4eaa6b73c3c84189943de75ed709d7eb";

const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

const class_features = await notion.databases
  .query({
    database_id: cfs
  })
  .then((res) => res.results);

