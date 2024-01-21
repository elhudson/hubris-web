import { db } from "./connections.js";
const valancy = "c54d3ace-a0dd-4444-adc0-8ba35bdf2496";

const health = await db.characters.update({
  where: {
    id: valancy
  },
  data: {
    inventory: {
      create: {}
    }
  }
});
