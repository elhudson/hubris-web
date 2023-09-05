import { immerable, current } from "immer"
import Feature, { Checkbox } from './feature.js'
import { CheckboxItem, SmallMod } from "../components/components/text.js"
import React from "react"
import Uri from "jsuri"

export default class Entry {
    [immerable] = true
    constructor(data) {
        try {
            Object.assign(this, ruleset[data.table][data.id])
        }
        catch { ReferenceError } {
            Object.assign(this, data)
        }
        if (Object.hasOwn(data, 'tier') && typeof (data.tier) != Number) {
            try {
                this.tier = Number(data.tier.split('T')[1])
            }
            catch { { Error } }
        }
        this.path = this.table
        this.descendable = false
        this.required = false
        this.bought = false
        this.visible = true
        this.buyable = false
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
    affordable(character) {
        return character.progression.budget()>=this.xp
    }
    qualifies(character) {
        if (Object.hasOwn(this, 'tier') && this.tier == character.progression.tier()) {
            if (this.descendable) {
                return this.requirements(character)
            }
        }
        return false
    }
    removeable(character) {
        if (this.descendable == true) {
            for (var postreq of this.required_for)
                if (character.has(postreq)) {
                    return false
                }
        }
        return true
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
    requirements(character) {
        if (this.requires == undefined || this.requires == null || this.requires.length == 0) {
            return true
        }
        for (var r of this.requires) {
            if (character.has(r)) {
                return true
            }
        }
        return false
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
    removeable(character) {
        var trees = character.powers.effects.get_unique('tree')
        if (trees.includes(this.tree)) {
            if (this.xp == 1) {
                return false
            }
        }
        return super.removeable(character)
    }
    qualifies(character) {
        var trees = character.powers.effects.get_unique('tree')
        if (trees.includes(this.tree)) {
            if (this.xp == 1) {
                return true
            }
            else {
                return super.qualifies(character)
            }
        }
        return false
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
    quald_by(char) {
        var char_tags = char.classes.base.links('tags')
        var my_tags = this.links('tags')
        var rez = char_tags.filter(f => my_tags.map(i => i.id).includes(f.id))
        this.tags = rez
    }
    displayFeature({ ranges, durations }) {
        console.log(ranges, durations)
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
}

export class TagFeature extends Entry {
    constructor(data) {
        super(data);
        this.descendable = true
        this.path = 'features.tag_features'
        this.aux_paths()
    }
}

export class Skill extends Entry {
    [immerable] = true
    constructor(data) {
        super(data);
        this.xp = 0;
        Object.keys(data).includes(this.proficient) == false && (this.proficient = false)
        if (Object.hasOwn(this, 'attributes')) {
            this.code = this.attributes.name.toLowerCase().slice(0, 3)
        }
    }
    cost(skills, int) {
        var known = _.countBy(skills, s => s.proficient == true)
        known = known.true == undefined ? 0 : known.true
        var costly = known - (int + 2)
        return costly < 0 ? 0 : costly + 2
    }
    select(skills, progression, int) {
        var cost = this.cost(skills, int)
        var url = new Uri(window.location.href)
        if (url.hasQueryParam('stage') && url.getQueryParamValue('stage') == 'skills') {
            var limit = (int + 2) - skills.get_known()
            if (limit > 0) {
                this.proficient = true
            }
        }
        else {
            if (progression.xp.earned - progression.xp.spent >= cost) {
                this.proficient = true
                progression.xp.spent += cost
            }
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
        character.skills.get(this.skills[0].id).proficient = direction == 'add' ? true : false
    }
    code() {
        return this.attributes.name.slice(0, 3).toLowerCase()
    }
    adjust_stats(character, direction) {
        const func = direction == 'add' ? 'boost' : 'deboost'
        character.stats[func](this)
    }
    get_feature() {
        const insert = this.feature == null ? {
            name: "",
            description: ""
        } : {
            name: this.feature.split(':')[0],
            description: this.feature.split(':').slice(1).join(':')
        }
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