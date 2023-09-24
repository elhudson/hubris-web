function get_paths(mod_name) {
    const mod = {}
    Object.keys(mod_name).forEach((item) => {
        mod[item] = mod_name[item].default
    })
    return mod
}

export const classes = {
    rogue: await import('@assets/icons/classes/rogue.svg'),
    wizard: await import('@assets/icons/classes/wizard.svg'),
    elementalist: await import('@assets/icons/classes/elementalist.svg'),
    sharpshooter: await import('@assets/icons/classes/sharpshooter.svg'),
    barbarian: await import('@assets/icons/classes/barbarian.svg'),
    priest: await import('@assets/icons/classes/priest.svg')

}

export const backgrounds = {
    courtier: await import('@assets/icons/backgrounds/courtier.svg'),
    sailor: await import('@assets/icons/backgrounds/sailor.svg'),
    'spirit-blooded': await import('@assets/icons/backgrounds/spirit-blooded.svg'),
    merchant:await import('@assets/icons/backgrounds/merchant.svg')
}

export const tags = {
    ice: await import('@assets/icons/tags/ice.svg'),
    fire: await import('@assets/icons/tags/fire.svg'),
    nature: await import('@assets/icons/tags/nature.svg'),
    intelligence: await import('@assets/icons/tags/intelligence.svg'),
    agility: await import('@assets/icons/tags/agility.svg'),
    evocation: await import('@assets/icons/tags/evocation.svg'),
    abjuration: await import('@assets/icons/tags/abjuration.svg'),
    conjuration: await import('@assets/icons/tags/conjuration.svg'),
    transmutation: await import('@assets/icons/tags/transmutation.svg'),
    slashing: await import('@assets/icons/tags/slashing.svg'),
    piercing: await import('@assets/icons/tags/piercing.svg'),
    bludgeoning: await import('@assets/icons/tags/bludgeoning.svg'),
    religion: await import('@assets/icons/tags/religion.svg'),
    strength: await import('@assets/icons/tags/strength.svg'),
    air: await import('@assets/icons/tags/air.svg'),
    earth: await import('@assets/icons/tags/earth.svg'),
    constitution: await import('@assets/icons/tags/constitution.svg'),
    mind: await import('@assets/icons/tags/mind.svg'),
    charisma: await import('@assets/icons/tags/charisma.svg')
}

export const trees = {
    healing: await import('@assets/icons/trees/healing.svg'),
    damage: await import('@assets/icons/trees/damage.svg'),
    buffs: await import('@assets/icons/trees/buffs.svg'),
    debuffs: await import('@assets/icons/trees/debuffs.svg')
}


const icons = {
    ...get_paths(classes),
    ...get_paths(trees),
    ...get_paths(tags),
    ...get_paths(backgrounds)
}

export default icons
