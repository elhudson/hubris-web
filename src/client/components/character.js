const parts = import.meta.glob(`../components/character/*.jsx`, { import: 'default', eager: true })
export default Object.fromEntries(Object.entries(parts).map(e=> [e[0].replace(/^.*[\\/]/, '').replace(".jsx", ""), e[1]]))


