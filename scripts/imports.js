import fs from "fs";
import { generateManyIndex } from "vscode-generate-index-standalone";
import { join } from "path";

export const makeFrontendImports = async ({ dev = false }) => {
  const paths = ["./client/", "./interface/"];
  const lib = "./lib/";
  return await generateManyIndex({
    watch: dev ? paths : null,
    patterns: paths
      .map((p) => fs.readdirSync(join(lib, p)).map((m) => join(lib, p, m)))
      .flat(5),
    replaceFile: true,
  });
};

export const makeBackendImports = async ({ dev = false }) => {
  const items=["models", "views", 'methods']
  const paths=items.map(i=> join("./prisma/", i))
  const lib = "./prisma/exports/";
  return await generateManyIndex({
    watch: dev ? paths : null,
    patterns: items.map(i=> join(lib, `${i}.js`)),
    replaceFile: true,
  });
};
