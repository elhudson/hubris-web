import _ from "lodash";
import { get_fields } from "notion";

async function findFirst({ model, operation, args, query }) {
  return find({ model, args, query }).then((r) => format(r));
}
async function findMany({ model, operation, args, query }) {
  return find({ model, args, query }).then((f) => f.map((r) => format(r)));
}
async function update({ model, operation, args, query }) {
  return query({
    ...args,
    data: subclassed(model) ? deformat(args.data) : args.data,
  });
}
async function upsert({ model, operation, args, query }) {
  return query({
    ...args,
    update: subclassed(model) ? deformat(args.update) : args.update,
    create: subclassed(model) ? deformat(args.create) : args.create,
  });
}

// const deformat = (item) => {
//   const cleaned = _.omit(item, ["id", "title", "description"]);
//   const entry = {
//     id: item.id,
//     title: item.title,
//     description: item.description
//   };
//   return {
//     ...cleaned,
//     entry: {
//       connectOrCreate: {
//         where: {
//           id: item.id,
//         },
//         create: {
//           ...entry,
//           description: {
//             connectOrCreate: {
//               where: {
//                 entryId: entry.id
//               },
//               create: {
//                 content: {
//                   set: 
//                 }
//               }
//             }
//           }
//         },
//       },
//     },
//   };
// };


const find = ({ model, args, query }) => {
  const { ones } = get_fields(model);
  return query(ones.includes("entry") ? withEntry(args) : args);
};

const format = (res) => {
  return _.omit(
    {
      ...res,
      ...res.entry,
      description: res.entry.description.content,
    },
    ["entry", ...Object.keys(res).filter((f) => f.includes("Id"))]
  );
};

const withEntry = (args) => {
  // if (args?.include) {
  //   Object.entries(args.include).forEach(([key, val])=>{
  //     if ()
  //   })
  // }
  return {
    where: args.where,
    include: {
      ...(args?.include ?? {}),
      entry: {
        include: {
          description: {
            select: {
              content: true,
            },
          },
        },
      },
    },
  };
};

export default { findFirst, findMany };
