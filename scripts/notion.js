import { Prisma } from "@prisma/client";
import { db } from "~db/prisma.js";

// const res = await db.characters.findFirst({
//   where: {
//     classes: {
//       title: "Bolster",
//     },
//   },
//   include: {
//     classes: {
//       include: {
//         class_features: true,
//       },
//     },
//   },
// });

// const r = await fetch("http://localhost:3000/data/character/options", {
//   method: "POST",
//   body: JSON.stringify(res),
//   headers: {
//     "Content-Type": "application/json",
//     location: "create",
//   },
// }).then(res=> res.json())

// console.log(r)