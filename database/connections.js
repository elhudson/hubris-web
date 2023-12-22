import { PrismaClient } from "@prisma/client";
import { Client } from "@notionhq/client";
import multer from "multer";

export const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export const db = new PrismaClient();
export const notion = new Client({
  auth: process.env.NOTION_TOKEN
});