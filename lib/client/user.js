// @index('../../client/user/*.jsx', (f, _) => `export { default as ${_.pascalCase(f.name)} } from '${f.path}'`)
export { default as Actions } from '../../client/user/actions'
export { default as Campaigns } from '../../client/user/campaigns'
export { default as Characters } from '../../client/user/characters'
export { default as Creations } from '../../client/user/creations'
export { default as Login } from '../../client/user/login'
export { default as Register } from '../../client/user/register'
export { default as Routes } from '../../client/user/routes'
