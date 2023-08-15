import Info from "../section"
import { immerable } from "immer"
import React from "react";
import {Region, Row, LabeledItem, Block} from '../../../components/components/containers'
import {Radio, Dropdown} from '../../../components/components/interactive'
import {Textbox} from '../../../components/components/text'
import {Tracker, Counter} from '../../../components/components/numbers'
import { styles, style } from "../../../components/components/styles";
import _ from "lodash";




export default class Health extends Info {
    [immerable] = true
    constructor() {
        var skeleton={
            injury:'uninjured',
            conditions:null,
            hp: {
                max:1,
                current:1
            },
            hd: new HitDice()
        }
        super(skeleton)
    }
    static parse(raw) {
        var self=super.parse(raw)
        self.hd=HitDice.parse(raw)
        self.hp.max=self.hd.max_hp()
        return self
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
    display({patch}) {
        function Health({health, patch}) {
            const injuries=patch('health', 'update')
            const hp=[patch('health','increment'), patch('health', 'decrement')]
            return (
                    <Block header={'Health'}>
                        <HP hp={health.hp} update={hp}/>
                        <Row>
                        <LabeledItem label={'injuries'}>
                                <Injuries injury={health.injury} update={injuries}/>
                            </LabeledItem>
                            <LabeledItem label={'conditions'}>
                                <Textbox data={health.conditions} id={'conditions'} handler={injuries}/>
                            </LabeledItem>
                        </Row>
                        {health.hd.displayTracker({update:hp})}
                    </Block>)
            }
        return <Health health={this} patch={patch}/>
    }

}

class HitDice {
    [immerable]=true
    constructor() {
        this.die='d2',
        this.max=1,
        this.used=1
    }
    static parse(raw) {
        var self=new HitDice()
        try {
        Object.assign(self, raw) 
        }
        catch {{Error}}
        return self
    }
    max_hp() {
        var base=Number(this.die.split('d').at(-1))
        Number(this.die.split('d')[0])==2 && (base=base*2)
        return base
    } 
    cost(cls) {
        var initial=ruleset.reference.base_hit_die_cost[cls]
        return (initial+(this.max-1))
    }
    increment(xp, cls) {
        var cost=this.cost(cls)
        if (xp.earned-xp.spent>=cost) {
            this.max+=1
            xp.spent+=cost
        }
    }
    decrement(xp, cls) {
        var cost=this.cost(cls)*-1
        if (this.max>1) {
            this.max-=1
            xp.spent+=cost
        }
    }
    displayOption({update}) {
        return (<HD hd={this} update={update} isOption={true} />)
    }
    displayTracker({update}) {
        return(<HD hd={this} update={update} isOption={false} />)
    }
}

export function HD({hd, update, isOption}) {
    var styled=style('hd', {
        border:styles.border,
        '& > div': {
            borderTop:'none',
            borderLeft:'none',
            borderRight:'none',
            margin:0
        }

    })
    var data=ruleset.reference.hd.map(h=>new Object({label:h, value:h, selected:h==hd.die, available:false}))
    return(
        <div className={styled}>
            {isOption ?
            <Counter item={{label:'hit dice', value:hd.max, min:0, readOnly:false, path:'hd'}} update={update}/> : 
            <Tracker header={'Hit Dice'}
            left={{label:'used', value:hd.used, max:hd.max, min:0, readOnly:false, path:'hd.used'}} 
            right={{label:'max', value:hd.max, readOnly:true, path:'hd.max'}}
            update={update} /> 
            }
            <Radio label={'hit die'} data={data} readonly={true}/>
        </div>
    )
}



function HP({hp, update}) {
    return(
        <Tracker header={'HP'}
                left={{label:'current', value:hp.current, max:hp.max, min:0, readOnly:false, path:"hp.current" }}
                right={{label:'max', value:hp.max, readOnly:true, path:'hp.max'}}
            update={update} />)
}

function Injuries({injury, update}) {
    return(
        <Dropdown name='injury' path={'injury'} data={ruleset.reference.injuries} handler={update} selected={injury} />
    )
}

