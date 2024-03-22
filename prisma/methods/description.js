import { db, prisma } from "~db/prisma.js";

import { Prisma } from "@prisma/client";
import { get_description } from "notion";

function sync({ client, entry }) {
  const self = Prisma.getExtensionContext(this);
  return get_description(entry.id, client).then((res) =>
    self.save({ entry, description: res })
  );
}



function save({ entry, entryId, description }) {
  if (description) {
    prisma.$transaction(
      description.map((item) =>
        db.content.save({ src: entry?.id ?? entryId, block: item })
      )
    );
  }
}

export default { sync, save };
