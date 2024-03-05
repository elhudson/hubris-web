// @index('../../interface/styles/*.jsx', (f, _) => `export { default as ${_.pascalCase(f.name)} } from '${f.path}'`)
export { default as Classes } from '../../interface/styles/classes'
export { default as Colorschemes } from '../../interface/styles/colorschemes'
export { default as Global } from '../../interface/styles/global'
export { default as Switcher } from '../../interface/styles/switcher'
// @endindex
export * as Themes from "./themes"
