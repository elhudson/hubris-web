import fs from "fs";
import { join } from "path";

const client = "./lib/client/";
const ui = "./lib/interface/";
const backend = "./prisma/exports/";

const makeAliases = (symbol, prefix, base) => {
  const aliases = {};
  fs.readdirSync(base).forEach((cli) => {
    aliases[`${symbol}${prefix}/${cli.replace(/\.js/, "")}`] = join(base, cli);
  });
  return aliases;
};

export const aliases = {
  "@src": ".",
  utilities: "./utilities/index.js",
  contexts: "./client/contexts.jsx",
  context: "./client/contexts.jsx",
  ...makeAliases("@", "client", client),
  ...makeAliases("@", "interface", ui),
};

export const jsConfig = (aliases) => {
  const addtl={
    ...aliases,
    ...makeAliases("~", "db", backend)
  }
  const paths = Object.fromEntries(
    Object.entries(addtl).map(([name, path]) => [name, [path]])
  );
  fs.writeFileSync(
    "./jsconfig.json",
    JSON.stringify({
      compilerOptions: {
        baseUrl: ".",
        paths: paths,
      },
    })
  );
};
