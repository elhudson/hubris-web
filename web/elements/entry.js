import { immerable, current } from "immer"
import Feature, { Checkbox } from './feature.js'
import { CheckboxItem, SmallMod } from "../components/components/text.js"
import React from "react"

export default class Entry {
    [immerable] = true
    constructor(data) {
        try {
            Object.assign(this, ruleset[data.table][data.id])
        }
        catch { ReferenceError } {
            Object.assign(this, data)
        }
        this.path = this.table
        if (Object.keys(data).includes('tier') && typeof (this.tier) == Number) {
            this.tier = Number(data.tier.split('T')[1])
        }
        this.descendable = false
        this.bought = false
        this.visible = true
        this.buyable = true
    }
    aux_paths() {
        try {
            this.requires.forEach((r) => {
                r.path = this.path
            })
            this.required_for.forEach((f) => {
                f.path = this.path
            })
        }
        catch { { TypeError } }
    }
    qualifies(character) {
        if (Object.hasOwn(this, 'tier') && this.tier > character.progression.tier()) {
            return false
        }
        if (this.buyable && this.xp > character.progression.xp.earned - character.progression.xp.spent) {
            return false
        }
        else {
            return true
        }
    }
    addable(character) {
        if (character.has(this) == false) {
            if (this.qualifies(character) == true) {
                if (character && this.affordable(character) == true) {
                    return true
                }
            }
        }
        else {
            return false
        }
    }
    affordable(character) {
        if (Object.hasOwn(this, 'xp') && character.xp_spent + this.xp > character.xp_earned) {
            return false
        }
        else {
            return true
        }
    }
    removeable(character) {
        var p = true
        if (this.descendable == true) {
            this.required_for.forEach((postreq) => {
                if (character.has(postreq)) {
                    p = false
                }
            })
        }
        return p
    }
    static parse(data) {
        const mappings = {
            effects: Effect,
            ranges: Metadata,
            durations: Metadata,
            skills: Skill,
            classes: Class,
            backgrounds: Background,
            tags: Tag,
            class_features: ClassFeature,
            tag_features: TagFeature
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
        var q = false
        if (this.requires == undefined || this.requires == null || this.requires.length == 0) {
            q = true
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
        if (property == "") { return "" }
        if (this[property] == null) {
            return 'None'
        }
        if (Object.hasOwn(this[property], 'name')) {
            return this[property].name
        }
        if (property == 'tags') {
            return this.tags.map(t => t.name)
        }
        else {
            return this[property]
        }
    }
    children() {
        if (Object.hasOwn(this, 'required_for') && this.required_for.length > 0) {
            var ids = this.required_for.map(i => i.id)
            return ids.map(id => ruleset[this.table][id])
        }
        else {
            var all = ruleset[this.table].list().filter(r => r.requires.flatMap(a => a.id).includes(this.id))
            return all
        }
    }
    parents() {
        var ids = this.requires.map(i => i.id)
        return ids.map(id => ruleset[this.table][id])
    }
    displayFeature() {
        return <Feature feature={this} />
    }
    displayOption({ handler }) {
        return <Feature feature={this} check={<Checkbox feature={this} handler={handler} />} />
    }
}

export class Metadata extends Entry {
    [immerable] = true
    constructor(data) {
        super(data)
        this.descendable = true
        this.path = `powers.metadata.${this.table}`
        this.aux_paths()
    }
    qualifies(character) {
        var q = false
        if (super.qualifies(character) && this.requirements(character)) {
            var trees = [...new Set(character.powers.effects.map(e => [e.tree]))]
            if (trees.includes(this.tree)) {
                q = true
            }
        }
        return q
    }
    removeable(character) {
        return !this.qualifies(character)
    }
}

export class Effect extends Entry {
    constructor(data) {
        super(data);
        this.defaults = [Entry.parse(data.range), Entry.parse(data.duration)]
        this.descendable = true
        this.path = 'powers.effects'
        this.aux_paths()
    }
    qualifies(character) {
        var q = false
        if (super.qualifies(character)) {
            if (this.requirements(character)) {
                q = true
            }
        }
        return q
    }
    quald_by(char) {
        var char_tags = char.classes.base.links('tags')
        var my_tags = this.links('tags')
        var rez = char_tags.filter(f => my_tags.map(i => i.id).includes(f.id))
        this.tags = rez
    }
    displayFeature({ ranges, durations }) {
        return (
            <Feature feature={this} meta={{ ranges: ranges, durations: durations }} />
        )
    }
}

export class ClassFeature extends Entry {
    constructor(data) {
        super(data);
        this.descendable = true
        this.path = 'features.class_features'
        this.aux_paths()
    }
    qualifies(character) {
        var q = false
        if (super.qualifies(character)) {
            if (this.requirements(character)) {
                q = true
            }
        }
        return q
    }
}

export class TagFeature extends Entry {
    constructor(data) {
        super(data);
        this.descendable = true
        this.path = 'features.tag_features'
        this.aux_paths()
    }
    qualifies(character) {
        var q = false
        if (super.qualifies(character)) {
            if (this.requirements(character)) {
                q = true
            }
        }
        return q
    }
}

export class Skill extends Entry {
    [immerable]=true
    constructor(data) {
        super(data);
        this.xp = 0;
        if (Object.hasOwn(this, 'attributes')) {
            this.code = this.attributes.name.toLowerCase().slice(0, 3)
        }
    }
    cost(skills, int) {
        var known = _.countBy(skills, s => s.proficient == true)
        known = known.true == undefined ? 0 : known.true
        var costly = known - (int+2)
        return costly < 0 ? 0 : costly + 1
    }
    select(skills, progression, int) {
        var cost = this.cost(skills, int)
        if (progression.xp.earned - progression.xp.spent >= cost) {
            this.proficient = true
            progression.xp.spent += cost
        }
    }
    deselect(skills, progression, int) {
        this.proficient = false
        var cost = this.cost(skills, int) * -1
        progression.xp.spent += cost
    }
    proficiency(character) {
        const v = character.skills[character.skills.findIndex(c => c.id == this.id)]
        if (v.proficient) {
            this.bonus = character.progression.proficiency() + character.stats.scores[this.code]
        }
        else {
            this.bonus = character.stats.scores[this.code]
        }
    }
    display({ handler = null }) {
        function Skill({ skill }) {
            return (
                <CheckboxItem handler={handler} item={{ label: skill.name, value: skill.id }} disabled={skill.buyable} checked={skill.proficient}>
                    <SmallMod value={skill.bonus} />
                </CheckboxItem>
            )
        }
        return <Skill skill={this} />

    }
}

export class Class extends Entry {
    constructor(data) {
        super(data)
    }
    qualifies(character) {
        return (character.classes.base == null)
    }
}

export class Background extends Entry {
    constructor(data) {
        super(data)
    }
    qualifies(character) {
        return (character.backgrounds.primary == null || character.backgrounds.secondary == null)
    }
    adjust_skills(character, direction) {
        character.skills.get(this.id).proficient = direction == 'add' ? true : false
    }
    code() {
        return this.attributes.name.slice(0, 3).toLowerCase()
    }
    adjust_stats(character, direction) {
        const func = direction == 'add' ? 'boost' : 'deboost'
        character.stats[func](this)
    }
    get_feature() {
        const parsed={
            name: this.feature.split(':')[0],
            description: this.feature.split(':')[1]
        }
        const blank={
            name:"",
            description:""
        } 
        const insert=this.feature==null ? blank:parsed
        return ({
            ticks: this.ticks,
            ...insert
        })
    }
    displayFeature() {
        return (<Feature feature={this.get_feature()} />)
    }
}

export class Tag extends Entry {
    constructor(data) {
        super(data)
    }
}