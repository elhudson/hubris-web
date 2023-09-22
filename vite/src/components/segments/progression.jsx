import {Block, Item, LabeledItem} from '@elements/containers'
import { Bonus, Counter, Tracker } from '@elements/numbers'

import Info from "@models/section"
import {Radio} from '@elements/interactive'

import React from 'react'
import { immerable } from "immer"
import _ from 'lodash'

export default class Progression extends Info {
    [immerable]=true
    constructor() {
        var skeleton={
            xp:{
                earned:6,
                spent:0
            }
        }
        super(skeleton)
    }
    budget() {
        return this.xp.earned-this.xp.spent
    }
    tier() {
        if (_.range(-1, 30).includes(this.xp.earned)) { return 1 }
        else if (_.range(30, 75).includes(this.xp.earned)) { return 2 }
        else if (_.range(75, 125).includes(this.xp.earned)) { return 3 }
        else { return 4 }

    }
    proficiency() {
        return this.tier()+1
    }
    static parse(raw) {
        return super.parse(raw)
    }
    trackXp({patch}) {
        return(<XP xp={this.xp} update={[patch('progression', 'increment'), patch('progression', 'decrement')]} />)
    }
    display({patch}) {
        function Progression({ progression, patch}) {
            progression.hero==(null || undefined) && (progression.hero=0)
            const [inc, dec]=[patch('progression', 'increment'), patch('progression', 'decrement')]
            return (
                <Block header={'Progression'}>
                    <XP xp={progression.xp} update={[inc, dec]} />
                    <Tier tier={progression.tier()} />
                    <Proficiency pro={progression.proficiency()} />   
                    <HeroPoints count={progression.hero} update={[inc, dec]} /> 
                </Block>
            )
        }
        return(<Progression progression={this} patch={patch} />)
    }
}

export function Tier({ tier, update = null }) {
    var d = [1, 2, 3, 4].map(item => new Object({ label: item, value: item, selected: true && (tier == item) }))
    return (
        <Item label={'tier'}>
            <Radio label={'tier'} data={d} onChange={update} readonly={true} vertical={false} />
        </Item>
    )}

function HeroPoints({count, update}) {
    return(
        <LabeledItem label='Hero Points'>
            <Counter update={update} item={{value:count, path:'hero'}} /> 
        </LabeledItem>
    )}

function XP({ xp, update }) {
    return (
    <LabeledItem label='XP'>
        <Tracker 
            right={{ value: xp.spent, label: 'spent', path: 'xp.spent', readOnly: true }}
            left={{ value: xp.earned, min:xp.spent<6 ? 6 : xp.spent, label: 'earned', path: 'xp.earned', readOnly: false }}
            update={update} 
        />
    </LabeledItem>
    )}

function Proficiency({ pro }) {
    return (
        <LabeledItem label='Proficiency'>
            <Bonus item={{label:'proficiency', value:pro, readonly:true}} />
        </LabeledItem>
    )}

