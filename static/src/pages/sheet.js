import { immerable } from 'immer'
import { StatArray } from '../rules/stats.js'
import { SkillArray, Featureset } from '../rules/structures.js'
import { Tracker, Counter, Dropdown, Section, DC, Item, useToggle, Bonus, Radio, ReadMore } from '../utils.js'
import React from 'react'
import { useMemo } from 'react'
import { createRoot } from 'react-dom/client'

import { useImmerReducer } from 'use-immer'
import { Ruleset } from '../rules/ruleset.js'

const root = createRoot(document.getElementById('sheet'))
const char = await Character.load(document.getElementById('sheet').getAttribute('data-id'))
root.render(<Page char={char} />)

function Page({char}) {
    const [toggle, setToggle]=useToggle(false)
    return (
        <>
        <ReadMore v={toggle} setToggle={setToggle}/>
        <CharacterSheet ch={char} expanded={toggle} />
        </>
    )
}

function CharacterSheet({ ch, expanded }) {
    const [state, dispatch] = useImmerReducer(edit, ch)
    
    const data = {
        character: state,
        update: handleUpdate,
        toggle: handleToggle,
        manual: handleManual,
        aux: {
            tier: function (spent) {
                var spent = Number(spent)
                if (_.range(0, 30).includes(spent)) { return 1 }
                else if (_.range(30, 75).includes(spent)) { return 2 }
                else if (_.range(75, 125).includes(spent)) { return 3 }
                else { return 4 }
            },
            hp: function (xp_spent, con = char.con) {
                var tier = this.tier(xp_spent)
                return (3 * tier) + Number(con)
            },
            bonus: function (xp_spent, attr = char[attr], proficient) {
                proficient == 'on' && (proficient = true)
                var pb = this.tier(xp_spent) + 1;
                var bonus;
                proficient ? bonus = Number(attr) + pb : bonus = attr;
                return bonus
            }
        }
    }
    return (
        <>
            <Bio data={data} open={expanded} />
            <Progression data={data} open={expanded} />
            <Health data={data} open={expanded} />
            <AbilityScores data={data} open={expanded} />
            <Combat data={data} open={expanded} />
            <Features data={data} open={expanded} />
            <Powers data={data} open={expanded} />
        </>
    )
}

function Bio({ data, open }) {
    var d = {
        'name': data.character.name,
        'class': data.character.classes[0].name,
        'backgrounds': data.character.backgrounds[0].name + ' & ' + data.character.backgrounds[1].name
    }
    var content=Object.entries(d)
        .map(ent => <Item label={ent[0]} content={ent[1]} />)
    content.push(<Alignment selected={data.character.alignment} editCharacter={data.update} />)
    return (<Section header={'Bio'} items={content} open={open} cls={'bio'}/>
    )
}

function Alignment({ selected, editCharacter }) {
    return (
        <Dropdown data={ruleset.reference.alignments} selected={selected} label={'alignment'} handler={editCharacter} />
    )
}

function Progression({ data, open }) {
    var content=[<XP spent={data.character.xp_spent} earned={data.character.xp_earned} update={data.manual} />,
                <div>
                    <Tier data={data} />
                    <Proficiency data={data} />
                </div>,
                <HeroPoints ct={0} editCharacter={data.manual} />]
    return (
       <Section header={'Progression'} open={open}  items={content} cls={'progression'} />
    )
}

export function Tier({ character, update=null }) {
    var tier=character.tier()
    var d = [1, 2, 3, 4].map(item => new Object({ label: item, value: item, selected: true && (tier == item) }))
    return (
        <Radio label='tier' data={d} onChange={update} />
    )
}

function Proficiency({ data }) {
    var tier = data.aux.tier(data.character.xp_spent)
    var item = { label: 'proficiency', readonly: true, id: 'proficiency', value: Number(tier) + 1 }
    return (<Bonus item={item} />)

}

function XP({ earned, spent, update }) {
    const max = useMemo(() => { return earned }, [earned])
    var left = { label: 'XP Spent', id: 'xp_spent', value: spent, max: max, readonly: false }
    var right = { label: 'XP Earned', id: 'xp_earned', value: earned, readonly: false }
    return (
        <Tracker left={left} right={right} update={update} />
    )
}

function HeroPoints({ ct, editCharacter }) {
    var item = { label: 'Hero Points', value: ct, id: 'hero_points', readonly: false }
    return (
        <Counter item={item} update={editCharacter} />
    )
}

function Health({ data, open }) {
    var hd_count = data.character.hd
    var hd_type = data.character.classes[0].hit_die
    var hd = ruleset.reference.hd.map(item => new Object({ label: item, selected: (item == hd_type) }))
    hd_count == undefined && (hd_count = 1)
    var spent = { label: 'HD Used', id: 'hd', value: 0, max: hd_count, readonly: false }
    var max = { label: 'HD Max', id: 'hd', value: hd_count, readonly: true }
    var content=[
        <HP aux={data.aux} spent={data.character.xp_spent} handler={data.handleChange} con={data.character.con} />,
        <div>
            <Injuries selected={data.character.injury} editCharacter={data.handleChange} />
            <Radio data={hd} label={'hit die'} readonly={true} />
        </div>,
        <Tracker left={spent} right={max} editCharacter={data.handleChange} />]
    return (
       <Section header={'Health'} cls={'health'} open={open} items={content} />
    )
}

function HP({ aux, spent, handler, con }) {
    var hp = aux.hp(spent, con)
    var current = { label: 'Current HP', id: 'current_hp', value: hp, max: hp, readonly: false }
    var max = { label: 'Max HP', id: 'max_hp', value: hp, readonly: true }
    return (<div className='tracker'>
        <Counter item={current} editCharacter={handler} />
        <Bonus item={max} editCharacter={handler} /></div>
    )
}

function Injuries({ selected, editCharacter }) {
    if (selected == null) {
        selected = 'uninjured'
    }
    return (
        <div class='box'>
            <Dropdown label={'injuries'} selected={selected} handler={editCharacter} data={ruleset.reference.injuries} />
        </div>
    )
}

function AbilityScores({ data, open }) {
    var grouped = data.character.skills.by_attribute()
    var assemblage = {}
    Object.keys(grouped).forEach((score) => {
        assemblage[data.character.ability_scores[score]] = grouped[score]
    })
    var content=Object.keys(assemblage)
        .map(s =>
            <Stat char={data.character} score={s} skills={assemblage[s]} handler={data.toggle} xp={data.character.xp_spent} />
        )
    return (<Section header={'Ability Scores'} cls={'stats'} open={open} items={content} />)
}

function Stat({ score, skills, handler, xp, char }) {
    var item = { label: skills[0].code, value: score, id: null, readonly: true }
    return (<div class='stat'>
        <Bonus item={item} />
        {skills.map(skill =>
            <div>
                <Skill skill={skill} val={score} xp={xp} char={char} handler={handler} />
            </div>
        )}
    </div>)
}

function Skill({ skill, char, handler }) {
    skill.proficiency(char)
    return (
        <div class="skill_entry">
            <input type="checkbox" class="skillprof" disabled onChange={handler} checked={skill.proficient} id={skill.id} />
            <input type="number" readOnly value={skill.bonus} />
            <label>{skill.name}</label>
        </div>
    )
}

function Combat({ data, open }) {
    var init = { value: data.character.dex, label: 'initiative', readonly: true }
    var atk = { value: data.character.atk({}), label: 'attack', readonly: false }
    var content = [
        <Armor character={data.character} handler={data.update} />,
        <Bonus item={init} />,
        <Weapons character={data.character} open={open} handler={data.update} />,
        <Bonus item={atk} />,
    ]
    return (
       <Section items={content} open={open}  header={'Combat'} cls={'combat'} />
    )

}

function Armor({ character, handler }) {
    var armor = character.armor
    if (character.armor == undefined) { armor = character.classes[0].armor_proficiencies }
    var mappings = {
        'Light': ['Light'],
        'Medium': ['Light', 'Medium'],
        'Heavy': ['Light', 'Medium', 'Heavy']
    }
    var armors = ruleset.reference.armors.map(a => new Object(
        {
            label: a,
            value: a,
            selected: a == armor,
            available: (mappings[character.classes[0].armor_proficiencies].includes(a))
        }))
    var ac = { label: 'AC', value: character.ac({ armor: armor }), readonly: false }
    return (
        <>
            <Radio data={armors} label='armor' onChange={handler} readonly={false} />
            <DC item={ac} />
        </>
    )
}

function Weapons({ character, handler }) {
    var wpn = character.classes[0].weapon_proficiencies
    var armory = [
        { label: 'Simple', value: '1d6' },
        { label: 'Martial', value: '2d6' }
    ]
    armory = armory.map(obj => new Object({
        ...obj,
        selected: (obj.label == wpn)
    }))
    return (<Radio label={'weapons'} onChange={handler} data={armory} />)
}

function Features({ data, open }) {
    var features= { 
        'class features':data.character.class_features,
        'tag features': data.character.tag_features,
        'background features':data.character.backgrounds.map(b => new Object({ name: b.feature.split(':')[0], description: b.feature.split(":")[1] }))}
    var m=Object.entries(features).filter(a=>a[1].length>0)
    var s={ 'gridTemplateColumns': `repeat(${Object.keys(m).length}, ${100/Object.keys(m).length}%)` }
    var content=m.map(f=><FeatureGroup label={f[0]} features={f[1]} />)
    return(
        <Section style={s} items={content} cls={'features'} open={open}  header={'Features'} />
    )
}


function MetaGroup({ ranges, durations }) {
return(
    <>
    <FeatureGroup label={'ranges'} features={ranges} />
    <FeatureGroup label={'durations'} features={durations} />
    </>
)

}

function Powers({ data, open }) {
    var effects=<FeatureGroup label={'effects'} features={data.character.effects} header={'effects'} />
    var meta=<MetaGroup ranges={data.character.ranges} durations={data.character.durations} />
    var items=[
        <PowerMath ch={data.character} cls={data.character.classes[0]} xp={data.character.xp_earned} update={data.manual} />,
        <div class='power-options'>
            <Section items={effects} header={'effects'} cls={'effects'}/>
            <Section items={meta} header={'metadata'} cls={'meta'} />
            </div>
    ]
    return(<Section items={items} open={open} header={'Powers'} cls={'powers'}/>)
}

function PowerMath({ch, cls, xp, update}) {
    var bonus={value:ch.pwr({xp:xp, cls:cls}), label:'Power Mod', readonly:true}
    ch.powers_used==undefined ? powers_used=0 : powers_used=ch.powers_used;
    var used={value: powers_used, label: 'Powers Used', id:'powers_used', min:0, readonly:false}
    var dc={value: 10+powers_used, id:'power_dc', readonly:true, label: 'Power DC'}
    return(<div class='power-math'>
        <Bonus item={bonus} />
        <Counter item={used} update={update} />
        <DC item={dc} />
    </div>)
}



