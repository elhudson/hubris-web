import { join } from "path";
import fs from "fs";

const client = "./lib/client/";
const ui = "./lib/interface/";

const makeAliases = (prefix, base) => {
  const aliases = {};
  fs.readdirSync(base).forEach((cli) => {
    aliases[`@${prefix}/${cli.replace(/\.js/, "")}`] = join(base, cli);
  });
  return aliases;
};

export const aliases = {
  "@src": ".",
  utilities: "./utilities/index.js",
  context: "./client/contexts.jsx",
  ...makeAliases("client", client),
  ...makeAliases("interface", ui),
};
