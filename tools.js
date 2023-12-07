export const prisma_safe = (title) => {
    if (title.includes("_")) {
      const s = title.split("_");
      const first = s.at(0);
      var last = s.at(-1).at(0).toUpperCase() + s.at(-1).slice(1);
      return [first, last].join("_");
    } else {
      return title;
    }
  };