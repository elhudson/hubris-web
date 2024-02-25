const imports = {
  campaign: import.meta.glob(`./campaign/*.jsx`, {
    import: "default",
    eager: true
  }),
  catalog: import.meta.glob(`./catalog/*.jsx`, {
    import: "default",
    eager: true
  }),
  character: import.meta.glob(`./character/*.jsx`, {
    import: "default",
    eager: true
  }),
  rules: import.meta.glob(`./rules/*.jsx`, {
    import: "default",
    eager: true
  }),
  user: import.meta.glob(`./user/*.jsx`, {
    import: "default",
    eager: true
  }),
  tools: import.meta.glob(`./tools/*.jsx`, {
    import: "default",
    eager: true
  })
};
export default Object.fromEntries(
  Object.keys(imports).map((imp) => [
    imp,
    Object.fromEntries(
      Object.entries(imports[imp]).map((e) => [
        e[0].replace(/^.*[\\/]/, "").replace(".jsx", ""),
        e[1]
      ])
    )
  ])
);
