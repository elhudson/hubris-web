import { db } from "~db/prisma.js";
import {notion} from "notion";

await db.ranges.sync({ client: notion });
await db.durations.sync({ client: notion });


await db.rules.sync({ client: notion });

await db.attributes.sync({ client: notion });

await db.classes.sync({ client: notion });
await db.skills.sync({ client: notion });
await db.conditions.sync({ client: notion });
await db.backgrounds.sync({ client: notion });

await db.tag_Features.sync({ client: notion });

await db.timespans.sync({ client: notion });
await db.distances.sync({ client: notion });
await db.tags.sync({ client: notion });
await db.hit_Dice.sync({ client: notion });
await db.injuries.sync({ client: notion });
await db.trees.sync({ client: notion });
await db.settings.sync({ client: notion });
await db.effects.sync({ client: notion });
await db.class_Features.sync({ client: notion });
await db.background_Features.sync({ client: notion });
