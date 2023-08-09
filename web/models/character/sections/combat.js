import Info, {RadioArray, Item as item} from "../section"
import { immerable } from "immer"
import {Region, Snippet, Block, LabeledItem, Item, OptionList, Row} from 'hubris-components/containers'
import React from 'react'
import { SmallMod, Metadata, Field, CheckboxItem, SmallHeader} from 'hubris-components/text'
import {styles, style} from 'hubris-components/styles'
import {DC, Bonus} from 'hubris-components/numbers'
import { FeatureInfo, DataGrid } from '../../../elements/feature'
import _ from "lodash"
import { Radio } from "hubris-components/interactive"
import { ToggleableField } from "hubris-components/text"
export default class Combat extends Info {
    [immerable] = true
    constructor() {
        var skeleton={
            armor:null,
            weapons:null,
            initiative:null
        }
        super(skeleton)
    }
    // parse(json) {
    //     // this.armor=new Armory({cls:json.classes[0].armor_proficiencies, dex:json.ability_scores.dex, pb:json.progression.proficiency()})
    //     // this.weapons=new Arsenal({value:json.classes[0].weapon_proficiencies, classname:json.classes[0].name, str:json.ability_scores.str, dex:json.ability_scores.dex, pb:json.progression.proficiency()})
    //     this.initiative=dex
    //     super.parse('combat',json)
    // }
    Combat({patch, combat }) {
        var swap=patch('combat','radioSwitch')
        var namer=patch('combat', 'update')
        return(
                <Block header={'Combat'}>
                    <combat.armor.Armor armory={combat.armor} swap={swap} />
                    <Arsenal.Weaponry weapons={combat.weapons} namer={namer} swap={swap} />
                </Block>
            )
    }
}

export class Armor extends item {
    [immerable]=true
    constructor({value, index, dex, proficiency}) {
        super()
        this.index=index
        this.value=value
        this.ac=Armor.armor_class(value, dex, proficiency)
        this.active=false
    }
    static armor_class(value, dex, pb) {
        var cls=0
        value == 'None' && (cls = 10 + dex)
        value == 'Light' && (cls = 10 + dex + pb)
        value == 'Medium' && (cls = 14 + pb)
        value == 'Heavy' && (cls = 18 + pb)
        return cls
    }
    static ArmorClass({armor}) {
        return(
            <DC item={{label:'Armor Class', value:armor.ac}} />
        )
    }
}

export class Armory {
    [immerable]=true
    constructor({cls, dex, pb}) {
        var avail=this.get_armors(cls)
        for (var i=0;i<avail.length;i++) {
            this[i]=new Armor({
                value:avail[i],
                index:i,
                dex:dex,
                proficiency:pb
            })
        }
        this[0].active=true
    }
    list() {
        return Object.values(this)
    }
    wearing() {
        return _.find(this.list(), f=>f.active)
    }
    get_armors(value) {
        var avail=['None']
        value=='Light' && (avail=['None','Light'])
        value=='Medium' && (avail=['None','Light', 'Medium'])
        value=='Heavy' && (avail=['None','Light', 'Medium', 'Heavy'])
        return avail
    }
    Armor({armory, swap}) {
        return (
            <>
            <LabeledItem 
                label={'Armor'} 
                className={style('armor', {
                width:'auto !important'
                })}>
                <Radio 
                label='armor'
                data=
                    {armory.list()
                        .map(armor=>new Object({
                            path:'armor',
                            value:armor.value,
                            selected:armor.active,
                            label:armor.value
                        })
                    )} 
                    onChange={swap}
                    readonly={false}
                    vertical={false}
                />
            </LabeledItem>
            <Armor.ArmorClass armor={armory.wearing()} />
            </>
        )
    }
}

export class Weapon extends item {
    [immerable]=true
    constructor({value, classname, str, dex, pb})  {
        super()
        this.name;
        this.active=false
        this.value=value
        this.atk=Weapon.atk_bonus(str, dex, classname, pb)
        this.dmg={
            amount:(value=='Martial' ? '2d6' : '1d6'),
            type:new RadioArray({
                keys:['bludgeoning', 'piercing', 'slashing'],
                values:['Bludgeoning', 'Piercing', 'Slashing'],
                defaultActive:'bludgeoning'
            })
        }
        this.weight=new RadioArray({
            keys:['light', 'heavy'],
            values:['Light', 'Heavy'],
            defaultActive:'light'
        })
    }
    quick() {
        return (this.weight.light.active ? 7 : 10)
    }
    slow() {
        return (this.weight.heavy.active ? 13 : 10)
    }
    static atk_bonus(str, dex, charclass, pb) {
        return (['Rogue', 'Sharpshooter'].includes(charclass) ? dex+pb : str+pb)
    }
    static Weapon({wpn, namer, onChange}) {
        console.log(wpn)
        const addtl= {
            fontFamily:styles.mono,
            fontWeight:'bold',
            fontSize:styles.size+3,
        }
        return (
        <Snippet 
            snip={
                <CheckboxItem 
                    handler={onChange} 
                    styles={addtl} 
                    hideValue={true} 
                    name={'weapons'} 
                    item={{
                        value:wpn.value,
                        path:'weapons'
                    }} 
                    checked={wpn.active}> 
                            <Field data={{
                                text:`Weapon ${wpn.index}`,
                                path:`weapons.${wpn.index}.name`
                            }} 
                            handler={namer}
                            toggleable={true} />   
                    </CheckboxItem>}>
                <DataGrid>
                    <FeatureInfo label={'Damage'}>
                        <SmallMod value={wpn.dmg.amount} />
                        <wpn.dmg.type.Radio aray={wpn.dmg.type} path={`weapons.${wpn.index}.dmg.type`} handler={onChange} group={'damageType'} />
                    </FeatureInfo>
                    <FeatureInfo label={'Bonus'}>
                        <SmallMod value={wpn.atk}/>
                    </FeatureInfo>
                    <FeatureInfo label={'Class'}> 
                        <Metadata text={wpn.value} /> 
                    </FeatureInfo>
                    <FeatureInfo label={'Heft'}>
                        <wpn.weight.Radio aray={wpn.weight} path={`weapons.${wpn.index}.weight`} handler={onChange} group={'heft'} />
                    </FeatureInfo>
                    <FeatureInfo label='Speed'>
                        Quick: <SmallMod value={wpn.quick()} />
                        Slow: <SmallMod value={wpn.slow()} />
                    </FeatureInfo>
                </DataGrid>
        </Snippet>)}
    static Attack({wpn}) {
        if (wpn.active) {
            return (
                <LabeledItem label={'Attack'}>
                    <label>Bonus</label>
                    <SmallMod value={wpn.atk}/>
                    <label>Damage</label>
                    <SmallMod value={wpn.dmg.amount}/> 
                </LabeledItem>)
        }
      
    }
    
}

export class Arsenal  {
    [immerable]=true
    constructor({value, classname, str, dex, pb}) {
        var avail=this.get_weapons(value)
        var wpns=avail.map(a=>new Weapon({
                value:a,
                dex:dex,
                str:str,
                classname:classname,
                pb:pb
            }))
        var indices=_.range(avail.length)
        Object.assign(this, new RadioArray({keys:indices, values:wpns, defaultActive:0}))
    }
    get_weapons(value) {
       return value==['Simple'] ? ['Simple'] : ['Simple', 'Martial'] 
    }
    list() {
        return Object.values(this)
    }
    wielding() {
        return _.find(this.list(), r=>r.active)
    }
    static Weaponry({weapons, namer, swap}) {
        return (
        <LabeledItem label={'Weapons'}>
            <OptionList>
                {weapons.list().map(wpn=> <Weapon.Weapon namer={namer} wpn={wpn} onChange={swap} />)}
            </OptionList>
        </LabeledItem> )
    }
}


