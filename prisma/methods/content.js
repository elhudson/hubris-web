import { Prisma } from "@prisma/client";

function save({ src, block }) {
  const model = Prisma.getExtensionContext(this);
  const query = (block) => {
    const data = {
      plaintext: block.plaintext,
      index: block.index,
      src: {
        connectOrCreate: {
          where: {
            entryId: src
          },
          create: {
            entryId: src
          }
        }
      }
    };
    block?.link &&
      (data.link = {
        connectOrCreate: {
          where: {
            id: {
              contentIndex: block.index,
              contentSrc: src
            }
          },
          create: {
            target: {
              connectOrCreate: {
                where: {
                  id: block.link.target.id
                },
                create: block.link.target
              }
            }
          }
        }
      });
    return data;
  };
  return model.upsert({
    where: {
      id: {
        srcId: src,
        index: block.index
      }
    },
    update: query(block),
    create: query(block)
  })
}

export default { save };
