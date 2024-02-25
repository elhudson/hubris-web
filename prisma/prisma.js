import { PrismaClient, Prisma } from "@prisma/client";
import _ from "lodash";
import models from "~models";

export const db = new PrismaClient().$extends({
  model: {
    ...models
  }
});
