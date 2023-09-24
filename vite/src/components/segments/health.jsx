import { Block, Item, LabeledItem, Region, Row } from '@elements/containers'
import { Counter, Tracker } from '@elements/numbers'
import { Dropdown, Radio } from '@elements/interactive'
import { Field, Textbox } from '@elements/text'

import Info from "@models/section"
import React from "react";
import _ from "lodash";
import { immerable } from "immer"

export default class Health extends Info {
    [immerable] = true
    constructor() {
        var skeleton = {
            injury: 'uninjured',
            conditions: null,
            hp: {
                max: 1,
                current: null
            },
            hd: new HitDice()
        }
        super(skeleton)
    }
    static parse(raw) {
        var self = super.parse(raw)
        self.hd=new HitDice()
        try {
            self.hd = HitDice.parse(raw.hd)
        }
        catch {TypeError}
        self.hp.current==null && (self.hp.current=self.hp.max)
        return self
    }
    set_max_hp(tier, con) {
        this.hp.max=(3*tier)+con
    }
    increment(action) {
        Object.keys(action).includes('context') ?
            _.get(this, action.path).increment(action.context.progression.xp, action.context.classes.base.name) :
            super.increment(action)
    }
    decrement(action) {
        Object.keys(action).includes('context') ?
            _.get(this, action.path).decrement(action.context.progression.xp, action.context.classes.base.name) :
            super.decrement(action)
    }
    display({ patch }) {
        function Health({ health, patch }) {
            const injuries = patch('health', 'update')
            const hp = [patch('health', 'increment'), patch('health', 'decrement')]
            return (
                <Block header={'Health'}>
                    <HP hp={health.hp} update={hp} />
                    <Item label={'injuries'}>
                        <Injuries injury={health.injury} update={injuries} />
                    </Item>
                    <LabeledItem label={'conditions'}>
                        <Field toggleable={true} size='big' data={{ ...health.conditions, path: 'conditions' }} handler={injuries} />
                    </LabeledItem>
                    {health.hd.displayTracker({ update: hp })}
                </Block>)
        }
        return <Health health={this} patch={patch} />
    }

}

class HitDice {
    [immerable] = true
    constructor() {
        this.die = 'd2',
        this.max = 1,
        this.used = 1
    }
    static parse(raw) {
        var self = new HitDice()
        try {
            self.die = raw.die
            self.max = raw.max
            self.used = raw.used
        }
        catch {
            TypeError
        }
        return self
    }
    cost(cls) {
        var initial = ruleset.reference.base_hit_die_cost[cls]
        return (initial + (this.max - 1))
    }
    increment(xp, cls) {
        var cost = this.cost(cls)
        if (xp.earned - xp.spent >= cost) {
            this.max += 1
            xp.spent += cost
        }
    }
    decrement(xp, cls) {
        if (this.max > 1) {
            this.max -= 1
            var cost = this.cost(cls) * -1
            xp.spent += cost
        }
    }
    displayOption({ update }) {
        return (<HD hd={this} update={update} isOption={true} />)
    }
    displayTracker({ update }) {
        return (<HD hd={this} update={update} isOption={false} />)
    }
}

export function HD({ hd, update, isOption }) {
    console.log(data)
    var data = ruleset.reference.hd.map(h => new Object({ 
        label: h, 
        value: h, 
        selected: h == hd.die, 
        available: false }))
    return (
        <>
            <LabeledItem label='Hit Dice'>
            {isOption ?
                <Counter 
                    item={{ label: 'hit dice', value: hd.max, min: 0, readOnly: false, path: 'hd' }} update={update} /> :
                <Tracker 
                    left={{ label: 'used', value: hd.used, max: hd.max, min: 0, readOnly: false, path: 'hd.used' }}
                    right={{ label: 'max', value: hd.max, readOnly: true, path: 'hd.max' }}
                    update={update} />
            }
            </LabeledItem>
            <Item label={'die type'}>
                <Radio label={'hit die'} data={data} readonly={true} />
            </Item>
        </>
    )
}



function HP({ hp, update }) {
    return (
        <LabeledItem label='Hit Points'>
            <Tracker header={'HP'}
                left={{ label: 'current', value: hp.current, max: hp.max, min: 0, readOnly: false, path: "hp.current" }}
                right={{ label: 'max', value: hp.max, readOnly: true, path: 'hp.max' }}
                update={update} />
        </LabeledItem>)
}

function Injuries({ injury, update }) {
    return (
        <Dropdown name='injury' path={'injury'} data={ruleset.reference.injuries} handler={update} selected={injury} />
    )
}

