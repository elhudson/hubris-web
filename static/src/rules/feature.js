import _ from 'lodash'
import React, { useRef, forwardRef } from 'react'

export class Entry {
    constructor(data) {
        Object.assign(this, data)
    }
    qualifies(character) {
        if (character.has(this) || Object.hasOwn('tier') && Number(this.tier.split('T')[1]) > character.tier()) {
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
    requirements(character) {
        var q=false
        if (this.requires.length==0) {
            q=true
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
        if (Object.hasOwn(this,'required_for')) {
            var ids=this.required_for.map(i=>i.id)
            return ids.map(id=>ruleset[this.table][id])
        }
        else {
            return []
        }
        
    }
    parents() {
        var ids=this.requires.map(i=>i.id)
        return ids.map(id=>ruleset[this.table][id])
    }
}

export function Feature({ feature, handler=null, buyable=false }) {
    var cost;
    buyable && (cost=feature.xp)
    var data = <FeatureData feature={feature} />
    return (
        <div class='feature'>
            <div class='feature-name'>
                <div>   
                    <Checkbox feature={feature} handler={handler} cost={cost} /> 
                </div>
                <h2>{feature.name}</h2>
            </div>
            {data}
        </div>
    )
}

export function Checkbox({ feature, handler, cost }) {
    return (<input type='checkbox' cost={cost} checked={feature.bought} location={feature.table} onChange={handler} id={feature.id}></input>)
}

export function Option({ option, handler, buyable=true }) {
    return <Feature feature={option} buyable={true} handler={handler} />
}

export class Options extends Array {
    constructor(data) {
        Object.assign(this,data)
    }
    
}

export class Server {
    constructor(character) {
        var options=character.buyable()
        Object.assign(this,options)
    }
}


export class Metadata extends Entry {
    constructor(data) {
        super(data);
    }
    qualifies(character) {
        var q=false
        q=super.qualifies(character)
        if (q && this.requirements(character)) {
            var trees=[...new Set(character.effects.map(e=>e.tree))]
            trees.push('Damage/Healing')
            if (trees.includes(this.tree)) {
                q=true
            }
            else {
                q=false
            }
        }
        else {
            q=false
        }
        return q
    }
    removeable(character) {
        if (super.removeable(character)) {
            var autos=character.effects.map(o=>[o.range.id, o.duration.id])
            autos=autos.flat()
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
        this.range = Entry.parse(this.range)
        this.duration = Entry.parse(this.duration)
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

export function FeatureGroup({ label, features }) {
    return (
        <div class='feature-group'>
            <h3>{label}</h3>
            <div class='feature-list'>
                {features.map(f => f.render())}
            </div>
        </div>
    )
}

function Ticks({ ticks }) {
    ticks == null && (ticks = 0)
    return (
        <div class='feature-info'>
            <label>Ticks</label>
            <input type='number' readOnly value={ticks} />
        </div>
    )
}

function Xp({ xp }) {
    return (
        <div class='feature-info'>
            <label>XP</label>
            <input type='number' readOnly value={xp} />
        </div>
    )

}

function Power({ power }) {
    return (
        <div class='feature-info'>
            <label>Power</label>
            <input type='number' readOnly value={power} />
        </div>
    )

}

function Tags({ tags }) {
    var inside;
    if (tags.length==undefined) {
        inside=<span class='tag'>{tags.name}</span>
    }
    else {
        inside=tags.map(t => <span class='tag'>{t.name}</span>)
    }
    return (
        <div class='feature-info'>
            <label>Tags</label>
            <span>{inside}</span>
        </div>
    )
}

function Tree({ tree }) {
    return (
        <div class='feature-info'>
            <label>Tree</label>
            <span>
            <span class='tree'>{tree}</span>
            </span>
        </div>
    )

}

function Description({ de }) {
    return (
        <div class='feature-info desc'>
            {de}
        </div>
    )
}

function Attribute({ attr }) {
    return (
        <div class='feature-info'>
            <label>Ability</label>
            <span>{attr.name}</span>
        </div>
    )
}

function HitDice({ hd }) {
    return (
        <div class='feature-info'>
            <label>Hit Die</label>
            <span>{hd}</span>
        </div>
    )
}

function WeaponProf({ wpn }) {
    return (
        <div class='feature-info'>
            <label>Weaponry</label>
            <span>{wpn}</span>
        </div>
    )
}

function ArmorProf({ arm }) {
    return (
        <div class='feature-info'>
            <label>Armor</label>
            <span>{arm}</span>
        </div>)
}

function Paths({ pths }) {
    var inside;
    if (pths.length==undefined) {
        inside=<span class='path'>{pths.name}</span>
    }
    else {
        inside=pths.map(t => <span class='path'>{t.name}</span>)
    }
    return (<div class='feature-info'>
        <label>Paths</label>
       <span>{inside}</span>
    </div>)
}

function Skills({ skills }) {
    return (<div class='feature-info'>
        <label>Skills</label>
        <span>
            {skills.map(t => <span class='skill'>{t.name}</span>)}
        </span>
    </div>)
}

function FeatureData({ feature }) {
    feature.description == null && (feature.description = feature.feature)
    var haveable = Object.keys(feature)
    var data = new Array();
    haveable.forEach((prop) => {
        prop == 'tags' && data.push(<Tags tags={feature.tags} />)
        prop == 'power' && data.push(<Power power={feature.power} />)
        prop == 'xp' && data.push(<Xp xp={feature.xp} />)
        prop == 'tree' && data.push(<Tree tree={feature.tree} />)
        prop == 'ticks' && data.push(<Ticks ticks={feature.ticks} />)
        prop == 'weapon_proficiencies' && data.push(<WeaponProf wpn={feature.weapon_proficiencies} />)
        prop == 'armor_proficiencies' && data.push(<ArmorProf arm={feature.armor_proficiencies} />)
        prop == 'class_paths' && data.push(<Paths pths={feature.class_paths} />)
        prop == 'skills' && data.push(<Skills skills={feature.skills} />)
        prop == 'hit_die' && data.push(<HitDice hd={feature.hit_die} />)
        prop == 'attributes' && data.push(<Attribute attr={feature.attributes} />)
    })
    return <div class='feature-content'>
        <div class='feature-data'>
            {data}
        </div>
        <Description de={feature.description} />
    </div>
}