import { Prisma } from "@prisma/client";
import { db } from "~db/prisma.js";
import { get_description } from "notion";

async function sync({ client, entry }) {
  const description = await get_description(entry.id, client);
  const self = Prisma.getExtensionContext(this);
  await self.save({ entry, description });
}

async function save({ entry, entryId, description }) {
  if (description) {
    description.forEach(async (item) => {
      await db.content.save({ src: entry?.id ?? entryId, block: item });
    });
  }
}

export default { sync, save };
