import _ from 'lodash'
import React, { useRef, forwardRef } from 'react'
import { current, immerable } from 'immer';

export class Entry {
    constructor(data) {
        Object.assign(this, data)
        this.descendable=false
    }
    qualifies(character) {
        if (character[this.table]==undefined) {
            character[this.table]=[]
        }
        if (Object.hasOwn(this,'tier') && Number(this.tier.split('T')[1]) > character.tier()) {
            return false
        }
        else {
            return true
        }
    }
    addable(character) {
        if (character.has(this)==false) {
            if (this.qualifies(character)==true) {
                if (character && this.affordable(character)==true) {
                    return true
                }
            }
        }
        else {
            return false
        }
    }
    affordable(character) {
        if (Object.hasOwn(this, 'xp') && character.xp_spent+this.xp>character.xp_earned) {
            return false
        }
        else {
            return true
        }
    }
    removeable(character) {
        return true
    }
    static parse(data) {
        const mappings={
            effects:Effect,
            ranges:Metadata,
            durations:Metadata,
            skills:Skill,
            classes:Class,
            backgrounds:Background,
            tags:Tag,
            class_features:ClassFeature,
            tag_features:TagFeature
        }
        if (Object.keys(mappings).includes(data.table)) {
            return new mappings[data.table](data)
        }
        else {
            return new Entry(data)
        }
    }
    clone() {
        const clone = Entry.parse(this);
        return clone
    }
    links(target) {
        var links = new Array()
        var ids = this[target].map(i => i.id)
        ids.forEach((id) => {
            links.push(Entry.parse(ruleset[target][id]))
        })
        return links
    }
    legal(char) {
        if (this.qualifies(char) && char.has(this)) {
            return true
        }
        else {
            return false
        }
    }
    requirements(character) {
        var q=false
        if (this.requires==undefined || this.requires.length==0) {
            q=true
            return q
        }
        for (var r of this.requires) {
            if (character.has(r)) {
                q = true
            }
        }
        return q
    }
    get(property) {
        if (this[property]==null) {
            return 'None'
        }
        if (property=="") { return "" }
        if (Object.hasOwn(this[property], 'name')) {
            return this[property].name
        }
        if (property=='tags') {
            return this.tags.map(t=>t.name)
        }
        else {
            return this[property]
        }
    }
    children() {
        if (Object.hasOwn(this,'required_for') && this.required_for.length>0) {
            var ids=this.required_for.map(i=>i.id)
            return ids.map(id=>ruleset[this.table][id])
        }
        else {
            var all=ruleset[this.table].list().filter(r=>r.requires.flatMap(a=>a.id).includes(this.id))
            return all
        }
    }
    parents() {
        var ids=this.requires.map(i=>i.id)
        return ids.map(id=>ruleset[this.table][id])
    }
}


export class Metadata extends Entry {
    constructor(data) {
        super(data)
        this.descendable=true    
    }
    qualifies(character) {
        var q=false
        if (super.qualifies(character) && this.requirements(character)) {
            var trees=[...new Set(character.effects.map(e=>e.tree))]
            if (trees.includes(this.tree)) {
                q=true
            }
        }
        return q
    }
    removeable(character) {
        if (super.removeable(character)) {
            var autos=character.effects.map(o=>o.defaults.map(f=>f.id))
            autos=autos.flat(10)
            if (autos.includes(this.id)) {
                return false
            }
            else {
                return true
            }
        }
    }
}

export class Effect extends Entry {
    constructor(data) {
        super(data);
        this.defaults=[Entry.parse(data.range), Entry.parse(data.duration)]
        this.descendable=true
    }
    qualifies(character) {
        var q = false
        if (super.qualifies(character)) {
            if (this.requirements(character)) {
                q=true
            }
        }
        return q
    }

    quald_by(char) {
        var char_tags=char.classes[0].links('tags')
        var my_tags=this.links('tags')
        var rez=char_tags.filter(f=>my_tags.map(i=>i.id).includes(f.id))
        this.tags=rez
    }
}

export class ClassFeature extends Entry {
    constructor(data) {
        super(data);
        this.descendable=true
    }
    qualifies(character) {
        var q = false
        if (super.qualifies(character)) {
            if (this.requirements(character)) {
                q=true
            }
        }
        return q
    }
}

export class TagFeature extends Entry {
    constructor(data) {
        super(data);
        this.descendable=true
    }
    qualifies(character) {
        var q = false
        if (super.qualifies(character)) {
            if (this.requirements(character)) {
                q=true
            }
        }
        return q
    }
}

export class Skill extends Entry {
    constructor(data) {
        super(data);
        if (Object.hasOwn(this, 'attributes')) {
            this.code = this.attributes.name.toLowerCase().slice(0, 3)
        }
    }
    cost(character, event) {
        var owned = character.skills.filter(s => s.proficient).length
        character.free_skills = 4 + Number(character.ability_scores.int) - owned
        if (event.target.checked) {
            character.free_skills -= 1
        }
        if (character.free_skills < 0) {
            this.xp = Math.abs(character.free_skills) + 1
        }
        else {
            this.xp = 0

        }
    }
    proficiency(character) {
        const v = character.skills[character.skills.findIndex(c => c.id == this.id)]
        if (v.proficient) {
            this.bonus = character.proficiency() + character.ability_scores[this.code]
        }
        else {
            this.bonus = character.ability_scores[this.code]
        }
    }
}

export class Class extends Entry {
    constructor(data) {
        super(data)
    }

    qualifies(character) {
        if (Object.hasOwn(character, 'classes')==false) {
            return true
        }
        if (super.qualifies(character) && character.classes.length > 0) {
            return false
        }
        else {
            return true
        }
    }
}

export class Background extends Entry {
    constructor(data) {
        super(data)
    }
    qualifies(character) {
        if (super.qualifies(character) && character.backgrounds.length > 1) {
            return false
        }
        else {
            return true
        }
    }
}

export class Tag extends Entry {
    constructor(data) {
        super(data)
    }
}
