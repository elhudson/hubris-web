import { aliases } from "../aliases.js";
import fs from "fs";

const paths = Object.fromEntries(
  Object.entries(aliases).map(([name, path]) => [name, [path]])
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
