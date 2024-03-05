import {
  generateIndex,
  generateManyIndex,
} from "vscode-generate-index-standalone";
import { join } from "path";
import fs from "fs";

const paths = ["./client/", "./interface/"];
const lib = "./lib/";

const generateManyResult = await generateManyIndex({
  // watch: paths,
  patterns: paths
    .map((p) => fs.readdirSync(join(lib, p)).map((m) => join(lib, p, m)))
    .flat(5),
  replaceFile: true,
});
