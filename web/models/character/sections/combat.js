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
            armor:new Armory(),
            weapons:new Arsenal(),
            initiative:-2
        }
        super(skeleton)
    }
    static parse(raw, data) {
        var self=super.parse(raw)
        self.armor=Armory.parse(self.armor)
        self.armor.list().forEach((item)=> {
            item.ac=Armor.armor_class(item.value, data.dex, data.pb)
        })
        self.weapons=Arsenal.parse(self.weapons)
        self.weapons.list().forEach((item)=> {
            item.atk=Weapon.atk_bonus({str:data.str, dex:data.dex, charclass:data.classname, pb:data.pb})
        })
        return self
    }
    Combat({patch, combat}) {
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
    constructor() {
        super()
    }
    static create({value, index, dex, proficiency}) {
        var self=new Armor()
        self.index=index
        self.value=value
        self.ac=Armor.armor_class(value, dex, proficiency)
        self.active=false
        return self
    }
    static parse(raw) {
        var self=new Armor()
        Object.assign(self, raw)
        return self
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
    constructor() {
        this[0]=null
    }
    static assemble({cls, dex, pb}) {
        var self=new Armory()
        var avail=Armory.get_armors(cls)
        for (var i=0;i<avail.length;i++) {
            self[i]=Armor.create({
                value:avail[i],
                index:i,
                dex:dex,
                proficiency:pb
            })
        }
        self[0].active=true
        return self
    }
    set_acs(dex, pb) {
        this.list().forEach((item)=> {
            item.ac=Armor.armor_class(item.value, dex, pb)
        })
    }
    static parse(raw) {
        var self=new Armory()
        Object.keys(raw).forEach((r)=> {
            self[r]=Armor.parse(raw[r])
        })
        return self
    }
    list() {
        return Object.values(this)
    }
    wearing() {
        return _.find(this.list(), f=>f.active)
    }
    static get_armors(value) {
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
    constructor() {
        super()
        this.name=""
        this.active=false;
        this.value=""
        this.atk=""
        this.dmg={
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
    static create({value, classname, str, dex, pb})  {
        var self=new Weapon()
        self.name='untitled'
        self.active=false
        self.value=value
        self.dmg.amount=value=='Martial' ? '2d6' : '1d6',
        self.atk=Weapon.atk_bonus({str:str, dex:dex, classname:classname, pb:pb})
        return self
        
    }
    static parse(raw) {
        var self=new Weapon()
        Object.assign(self, raw)
        self.weight=RadioArray.parse(raw.weight)
        self.dmg.type=RadioArray.parse(raw.dmg.type)
        return self
    }
    quick() {
        return (this.weight.light.active ? 7 : 10)
    }
    slow() {
        return (this.weight.heavy.active ? 13 : 10)
    }
    static atk_bonus({str, dex, charclass, pb}) {
        return (['Rogue', 'Sharpshooter'].includes(charclass) ? dex+pb : str+pb)
    }
    static Weapon({wpn, namer, onChange}) {
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
    constructor() {
        this[0]=new Weapon()
    }
    set_bonuses(str, dex, classname, pb) {
        this.list().forEach((item)=> {
            item.atk=Weapon.atk_bonus(str, dex, classname, pb)
        })
    }
    static create({value, classname, str, dex, pb}) {
        var self=new Arsenal()
        var avail=self.get_weapons(value)
        var wpns=avail.map(a=>Weapon.create({
                value:a,
                dex:dex,
                str:str,
                classname:classname,
                pb:pb
            }))
        var indices=_.range(avail.length)
        Object.assign(self, new RadioArray({keys:indices, values:wpns, defaultActive:0}))
        return self
    }
    static parse(raw) {
        var self=new Arsenal()
        Object.assign(self,RadioArray.parse(raw))
        Object.keys(self).forEach((key)=>{
            self[key]=Weapon.parse(self[key])
        })
        return self
        
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


