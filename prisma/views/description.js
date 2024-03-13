import { db } from "~db/prisma.js";

async function update({ model, operation, args, query }) {
  const { data, where } = args;
  const primary = await query({
    where,
    data: deformat(data),
  });
  data.content.forEach(async (item) => {
    item.src = data.src;
    item.srcId = data.src.id;
    await db.content.upsert({
      where: {
        id: {
          index: item.index,
          srcId: data.src.id
        },
      },
      create: item,
      update: item,
    });
  });
}

export function deformat({ src, content }) {
  const data = {
    entry: {
      connect: {
        id: src.id,
      },
    },
  };
  content &&
    (data.content = {
      connect: content.map((c) => ({
        id: {
          srcId: src.id,
          index: c.index,
        },
      })),
    });
  return data;
}

export default { update };
