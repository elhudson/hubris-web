import fs from "fs";
import {
  generateManyIndex,
} from "vscode-generate-index-standalone";
import { join } from "path";

const paths = ["./client/", "./interface/"];
const lib = "./lib/";

export const makeImports = async ({ dev = false }) =>
  await generateManyIndex({
    watch: dev ? paths : null,
    patterns: paths
      .map((p) => fs.readdirSync(join(lib, p)).map((m) => join(lib, p, m)))
      .flat(5),
    replaceFile: true,
  });
