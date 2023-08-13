import React from "react"
import { SmallMod, Metadata as Meta, CheckboxItem } from "hubris-components/text"
import { LabeledItem, Row } from "hubris-components/containers"
import {style, styles, reusable} from 'hubris-components/styles'
import { Popper } from "@mui/base"
import { Box } from "@mui/material"
import { Button, Buttons } from "hubris-components/interactive"
import { Ruleset } from "../rules/ruleset"
import {Arsenal, Armory} from '../models/character/sections/combat'
import _ from 'lodash'
import { current, immerable } from 'immer';

export default class Entry {
    [immerable]=true
    constructor(data) {
        try {
            Object.assign(this, ruleset[data.table][data.id])
        }
        catch {ReferenceError} {
            Object.assign(this, data)
        }
        this.path=this.table
        this.descendable=false
        this.bought=false
        this.buyable=true
    }
    aux_paths() {
        try {
            this.requires.forEach((r)=> {
                r.path=this.path
            })
            this.required_for.forEach((f)=> {
                f.path=this.path
            })
        }
        catch{{TypeError}}
    }
    qualifies(character) {
        if (Object.hasOwn(this,'tier') && Number(this.tier.split('T')[1]) > character.progression.tier()) {
            return false
        }
        if (this.buyable && this.xp>character.progression.xp.earned-character.progression.xp.spent) {
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
        var p=true
        if (this.descendable==true) {
            this.required_for.forEach((postreq)=> {
                if (character.has(postreq)) {
                    p=false
                }
            })
        }
        return p
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
        if (this.requires==undefined || this.requires==null || this.requires.length==0) {
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
    displayFeature() {
        return <Feature feature={this} />
    }
    displayOption({handler}) {
        return <Feature feature={this} check={<Checkbox feature={this} handler={handler}/>}/>
    }
}

function Feature({ feature, meta=null, check=null }) {
    if (feature.description==undefined && feature.feature!=undefined) {
        feature.description=feature.feature.split(':')[1]
        feature.name=feature.feature.split(':')[0]
    }
    var header=(
        <>
        {feature.name}
        {check}
        </>
    )
    var disable=style('disable', {
        opacity:0.5
    })
    return (
        <LabeledItem className={(feature.buyable==false && feature.bought==false) && (disable)} label={header}>
            <div style={{display:'flex'}}>
                <FeatureData feature={feature} />
                    {meta!=null && (<ApplicableMeta meta={meta} feature={feature} />)}
                </div>
            <Description de={feature.description} />
        </LabeledItem>

    )
}

function Checkbox({ feature, handler }) {
    var display=style('checkbox', {
        ...reusable.checkbox,
        position:'absolute',
        left:0
    })
    return (<input className={display} type='checkbox' cost={feature.xp} checked={feature.bought} disabled={!feature.buyable} table={feature.table} path={feature.path} onChange={handler} value={feature.id}></input>)
}


export class Metadata extends Entry {
    [immerable]=true
    constructor(data) {
        super(data)
        this.descendable=true  
        this.path=`powers.metadata.${this.table}`
        this.aux_paths()
    }
    qualifies(character) {
        var q=false
        if (super.qualifies(character) && this.requirements(character)) {
            var trees=[...new Set(character.powers.effects.map(e=>[e.tree]))]
            if (trees.includes(this.tree)) {
                q=true
            }
        }
        return q
    }
}

export class Effect extends Entry {
    constructor(data) {
        super(data);
        this.defaults=[Entry.parse(data.range), Entry.parse(data.duration)]
        this.descendable=true
        this.path='powers.effects'
        this.aux_paths()
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
        var char_tags=char.classes.base.links('tags')
        var my_tags=this.links('tags')
        var rez=char_tags.filter(f=>my_tags.map(i=>i.id).includes(f.id))
        this.tags=rez
    }
    displayFeature({ranges, durations}) {
        return(
            <Feature feature={this} meta={{ranges:ranges, durations:durations}}/>
        )
    }
}

export class ClassFeature extends Entry {
    constructor(data) {
        super(data);
        this.descendable=true
        this.path='features.class_features'
        this.aux_paths()
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
        this.path='features.tag_features'
        this.aux_paths()
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
        this.xp=0;
        if (Object.hasOwn(this, 'attributes')) {
            this.code = this.attributes.name.toLowerCase().slice(0, 3)
        }
    }
    cost(int, skills) {
        var free=2+int
        var known=_.countBy(skills, s=>s.proficient==true)
        known=known.true==undefined ? 0 : known.true
        var left=free-known
        if (left<=0) {
            this.xp=1+Math.abs(left)
        }
        return this.xp
    }
    select(int, skills, progression) {
        var cost=this.cost(int.value, skills)
        if (progression.xp.earned-progression.xp.spent>=cost) {
            this.proficient=true
            progression.xp.spent+=cost
        }

    }
    deselect(int, skills, progression) {
        var cost=this.cost(int.value, skills)*-1
        this.proficient=false
        progression.xp.spent+=cost
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
    display() {
        function Skill({skill}) {
            return(
                <CheckboxItem item={{label:skill.name}} checked={skill.proficient}>
                    <SmallMod value={skill.bonus}/>
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
        if (Object.hasOwn(character, 'classes')==false) {
            return true
        }
        if (super.qualifies(character) && character.classes.base!=null) {
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
        this.description=data.feature
    }
    qualifies(character) {
        return (character.backgrounds.primary==null || character.backgrounds.secondary==null)
    }
}

export class Tag extends Entry {
    constructor(data) {
        super(data)
    }
}

export function FeatureInfo({value=null, label, children}) {
    const styled=style('info', {
            fontWeight:'bold',
            textTransform:'uppercase'
        })
    const childs=style('children', {
        display:'flex',
        flexWrap:'wrap'
    })
    return (
        <>
        <label className={styled}>{label}</label>
        <div className={childs}>
        {value}
        {children}
        </div>
        </>
    )
}

export function FeatureMeta({feature, meta_list}) {
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
      setOpen((previousOpen) => !previousOpen);
    };
    const meta=meta_list
        .filter(r=>r.tree=feature.tree)
        .filter(f=>f.tier==feature.tier)
        .map(r=> 
        <div>
            <Button onClick={handleClick}>{r.name}</Button>
            <Popper 
                id={r.id}
                anchorEl={anchorEl}
                open={open}>
                <Box sx={{
                    backgroundColor:styles.background,
                    border:styles.border,
                    minWidth:'min-content',
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                }}>
                    <Feature feature={r} />
                </Box>
            </Popper>
        </div>)
    return (
        <Meta text={
            <Buttons className={style('buttons', {
                border:'none !important'
            })}>
                {meta}
            </Buttons>}/>
    )

    
}

function Ticks({ ticks }) {
    ticks == null && (ticks = 0)
    return (
        <FeatureInfo label={'ticks'} value={ticks} />
    )
}

function Xp({ xp }) {
    return (
        <FeatureInfo label={'xp'} value={xp}/>
    )

}

function Power({ power }) {
    return (
        <FeatureInfo label={'power'} value={power} />
    )

}

function Tags({ tags }) {
    return (
        <FeatureInfo label={'Tags'}>
            {tags.length==undefined ?
                <Meta text={tags.name}/> :
                tags.map(t=><Meta text={t.name} />)
            }
        </FeatureInfo>
    )
}

function Tree({ tree }) {
    return (
        <FeatureInfo label={'tree'}>
            <Meta text={tree}/>
        </FeatureInfo>
    )

}

function Description({ de }) {
    const styled=style('desc', {
        fontDecoration:'italic',
        border: styles.border,
        margin: 5,
        padding:5
    })
    return (
        <div className={styled}>
            {de}
        </div>
    )
}

function Attribute({ attr }) {
    return (
        <FeatureInfo label='attribute'>
            <Meta text={attr.name} />
        </FeatureInfo>
    )
}

function HitDice({ hd }) {
    return (
        <FeatureInfo label={'hit die'} value={hd} />
    )
}

function WeaponProf({ wpn }) {
    return (
        <FeatureInfo label={'weaponry'} value={wpn} />
    )
}

function ArmorProf({ arm }) {
    return (
        <FeatureInfo label={'armor'} value={arm} />)
}

function Paths({ pths }) {
    return (<FeatureInfo label={'Paths'}>
            {pths.length==undefined ?
                <Meta text={pths.name}/> :
                pths.map(t=><Meta text={t.name} />)
            }
        </FeatureInfo>)
}

function Skills({ skills }) {
    return (<FeatureInfo label={'Skills'}>
    {skills.length==undefined ?
        <Meta text={skills.name}/> :
        skills.map(t=><Meta text={t.name} />)
    }
</FeatureInfo>)
}

export function DataGrid({children}) {
    const datagrid=style('feature-info', {
        display:'grid',
        border:styles.border,
        borderBottom:'none',
        margin:5,
        width:'100%',
        gridTemplateColumns:'repeat(2, auto)',
        '& > div': {
            borderLeft:styles.border,
            borderBottom:styles.border,
            '& input': {
                borderBottom:'none',
                textAlign:'left'
            },
            '& button': {
                fontWeight:'unset',
                fontSize:'unset',
                fontFamily: 'unset',
                textTransform:'unset',
                cursor: 'pointer'
            }
        },
        '& > label': {
            borderBottom:styles.border
        },
        '& > *': {
            paddingLeft:5
        }
    })
    return(
        <div className={datagrid}>
            {children}
        </div>
    )
}

function FeatureData({ feature }) {
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
    return(
        <DataGrid>
            {data}
        </DataGrid>
    )}


function ApplicableMeta({meta, feature}) {
return (
    <DataGrid>
        <FeatureInfo label={'Ranges'}>
            <FeatureMeta meta_list={meta.ranges.pool()} feature={feature}/>
        </FeatureInfo>
        <FeatureInfo label={'Durations'}>
            <FeatureMeta meta_list={meta.durations.pool()} feature={feature}/>
        </FeatureInfo>
    </DataGrid>
)
}