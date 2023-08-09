import Info from "../section"
import { immerable } from "immer"
import React from "react";
import {Region, Row, LabeledItem, Block} from 'hubris-components/containers'
import {Radio, Dropdown} from 'hubris-components/interactive'
import {Textbox} from 'hubris-components/text'
import {Tracker} from 'hubris-components/numbers'
import { styles, style } from "hubris-components/styles";




export default class Health extends Info {
    [immerable] = true
    constructor() {
        var skeleton={
            injury:'uninjured',
            conditions:null,
            hp: {
                max:null,
                current:null
            },
            hd: {
                die:null,
                max:null,
                used:null
            }
        }
        super(skeleton)
        
    }
    // parse(character) {
    //     super.parse(character)
    //     var frame=new Health()
    //     var tier=character.progression.tier()
    //     var con=character.ability_scores.con
    //     var hit_die=character.classes[0].hit_dice
    //     this.injury = this.set_attribute(character, 'health.injury', 'uninjured')
    //         this.hp = {
    //             max: (tier * 3) + con,
    //             current: character.health==undefined ? (tier*3)+con : character.health.hp.current
    //         },
    //         this.hd = {
    //             die: hit_die,
    //             used: character.health==undefined ? 0 : character.health.hd.current,
    //             max: character.health==undefined ? 1 : character.health.hd.max
    //         },
    //         this.conditions = ""
    //     return frame
    // }
    Health({health, patch}) {
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
                    <HD hd={health.hd} update={hp}/>
                </Block>
        )
    }
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

function HD({hd, update}) {
    console.log(hd)
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
            <Tracker header={'Hit Dice'}
                    left={{label:'used', value:hd.used, max:hd.max, min:0, readOnly:false, path:'hd.used'}} 
                    right={{label:'max', value:hd.max, readOnly:true, path:'hd.max'}}
                    update={update} />
            <Radio label={'hit die'} data={data} readonly={true}/>
        </div>


    )
}