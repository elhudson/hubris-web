const { db } = require("prisma");

async function main(args) {
  await db.sync();
}

global.main=main
