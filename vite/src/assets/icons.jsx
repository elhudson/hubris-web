import * as classes from '@assets/icons/classes'
import * as trees from '@assets/icons/trees'
import * as tags from '@assets/icons/tags'

function get_paths(mod_name) {
    const mod={}
    Object.keys(mod_name).forEach((item)=> {
        mod[item]=mod_name[item].default
    })
    return mod
}

const icons={
    ...get_paths(classes),
    ...get_paths(trees),
    ...get_paths(tags)
}

export default icons