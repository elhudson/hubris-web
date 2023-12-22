const parts = import.meta.glob(`../character/*.jsx`, {
  import: "default",
  eager: true
});
export default Object.fromEntries(
  Object.entries(parts).map((e) => [
    e[0].replace(/^.*[\\/]/, "").replace(".jsx", ""),
    e[1]
  ])
);
