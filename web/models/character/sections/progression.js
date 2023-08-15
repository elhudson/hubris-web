import Info from "../section"
import { immerable } from "immer"
import {Region, Block, Row, LabeledItem} from '../../../components/components/containers'
import React from 'react'
import {Radio} from '../../../components/components/interactive'
import { Tracker, Bonus } from '../../../components/components/numbers'
import {style, styles} from '../../../components/components/styles'

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
    Progression({ progression, patch}) {
        const [inc, dec]=[patch('progression', 'increment'), patch('progression', 'decrement')]
        const tier=progression.tier()
        const proficiency=progression.proficiency()
        return (
            <Block header={'Progression'} >
                <div style={{display:'inline-flex'}}>
                    <XP xp={progression.xp} tier={tier} update={[inc, dec]} />
                    <Proficiency pro={proficiency} />     
                </div>            
            </Block>
    
        )
    }
}



export function Tier({ tier, update = null }) {
    var d = [1, 2, 3, 4].map(item => new Object({ label: item, value: item, selected: true && (tier == item) }))
    return (
        <Radio label={'tier'} data={d} onChange={update} readonly={true} vertical={false} />
    )
}
function XP({ xp, tier, update }) {
    var styled=style('hd', {
        border:styles.border,
        '& > div': {
            borderTop:'none',
            borderLeft:'none',
            borderRight:'none',
            margin:0
        }
    })
    return (
    <div className={styled}>
        <Tracker 
            header={'XP'}
            right={{ value: xp.spent, label: 'spent', path: 'xp.spent', readOnly: true }}
            left={{ value: xp.earned, min:xp.spent, label: 'earned', path: 'xp.earned', readOnly: false }}
            update={update} 
        />
        <Tier tier={tier}/>
    </div>
    )
}
function Proficiency({ pro }) {
    return(
        <Bonus override={{marginTop:0+' !important', marginBottom:0+' !important'}} item={{label:'proficiency', value:pro, readonly:true}} />
    )
}

