import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: [
    { level: "warn", emit: "event" },
    { level: "info", emit: "event" },
    { level: "error", emit: "event" },
  ],
});

prisma.$on("warn", (e) => {
  console.log(e);
});

prisma.$on("info", (e) => {
  console.log(e);
});

prisma.$on("error", (e) => {
  console.log(e);
});
// const prisma = new PrismaClient({
//   log: [
//     {
//       emit: "event",
//       level: "query",
//     },
//     {
//       emit: "stdout",
//       level: "error",
//     },
//     {
//       emit: "stdout",
//       level: "info",
//     },
//     {
//       emit: "stdout",
//       level: "warn",
//     },
//   ],
// });

// prisma.$on("query", (e) => {
//   console.log("Query: " + e.query);
//   console.log("------------------------------------");
//   console.log("Params: " + e.params);
//   console.log("------------------------------------");
//   console.log("Duration: " + e.duration + "ms");
//   console.log("--------------------------------------------------");
// });

export default prisma;
