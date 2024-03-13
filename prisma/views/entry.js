import _ from "lodash"
import { db } from "~db/prisma.js";

async function upsert({ model, operation, args, query }) {
  const primary = await query({
    where: args.where,
    create: deformat(args.create),
    update: deformat(args.update),
  });
  const secondary = args.update.description
    ? await db.description.upsert({
        where: {
          entry: _.omit(args.update, ["description"]),
        },
        data: {
          src: args.update,
          content: args.update.description,
        },
      })
    : {};
  return {
    ...primary,
    ...secondary,
  };
}

const deformat = (item) => {
  const data = {
    id: item.id,
    title: item.title,
  };
  // console.log(item)
  // item?.description &&
  //   (data.description = {
  //     connectOrCreate: {
  //       where: {
  //         entryId: item.id,
  //       },
  //       create: {},
  //     },
  //   });
  return data;
};

export default { upsert };
