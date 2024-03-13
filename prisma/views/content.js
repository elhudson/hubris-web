import { db } from "~db/prisma.js";

async function update({ model, operation, args, query }) {
  const data = args.data;
  return await query({
    where: {
      ...args.where,
    },
    data: deformat(data),
  });
  
}

async function create({ model, operation, args, query }) {
  const data = args.data;
  return await query({
    where: {
      ...args.where,
    },
    data: deformat(data),
  });
}

async function upsert({ model, operation, args, query }) {
  const { create, update } = args;
  return await query({
    where: {
      ...args.where,
    },
    create: deformat(create),
    update: deformat(update),
  });
}

function deformat(data) {
  const ob = {
    plaintext: data.plaintext,
    index: data.index,
  };
  data?.link &&
    (ob.link = {
      connectOrCreate: {
        where: {
          id: {
            contentIndex: data.index,
            contentSrc: data.srcId,
          },
        },
        create: {
          id: {
            contentIndex: data.index,
            contentSrc: data.srcId,
          },
        },
      },
    });
  return ob;
}

export default { update, create, upsert };
