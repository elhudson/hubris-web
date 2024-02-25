import { db } from "~db/prisma.js";

async function make({
  id,
  name,
  flavortext,
  effects,
  ranges,
  durations,
  characters,
  creator
}) {
  await db.powers.create({
    data: {
      id: id,
      name: name,
      flavortext: flavortext,
      creator: {
        connect: {
          id: creator.id
        }
      },
      characters: {
        connect: characters.map((c) => ({
          id: c.id
        }))
      },
      ranges: {
        connect: ranges.map((r) => ({
          id: r.id
        }))
      },
      durations: {
        connect: durations.map((r) => ({
          id: r.id
        }))
      },
      effects: {
        connect: effects.map((r) => ({
          id: r.id
        }))
      }
    }
  });
}

async function edit({
  id,
  name,
  flavortext,
  effects,
  ranges,
  durations,
  characters,
  creator
}) {
  await db.powers.update({
    where: {
      id: id
    },
    data: {
      name: name,
      flavortext: flavortext,
      creator: {
        connect: {
          id: creator.id
        }
      },
      characters: {
        set: characters.map((c) => ({
          id: c.id
        }))
      },
      ranges: {
        set: ranges.map((r) => ({
          id: r.id
        }))
      },
      durations: {
        set: durations.map((r) => ({
          id: r.id
        }))
      },
      effects: {
        set: effects.map((r) => ({
          id: r.id
        }))
      }
    }
  });
}

async function save(data) {
  await db.powers.make(data).catch(async (err) => await db.powers.edit(data));
}

export default { make, edit, save };
