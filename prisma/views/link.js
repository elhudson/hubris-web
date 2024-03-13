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
  return {
    content: {
      connectOrCreate: {
        where: {
          id: {
            srcId: data.src.id,
            index: data.index,
          },
        },
        create: {
          plaintext: data.plaintext,
          index: data.index,
        },
      },
    },
    target: {
      connectOrCreate: {
        where: {
          id: data.link.target.id,
        },
        create: data.link.target,
      },
    },
  };
}

export default { update, create, upsert };
