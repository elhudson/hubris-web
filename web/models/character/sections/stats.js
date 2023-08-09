import Info from "../section"
import { immerable, current } from "immer"
import {Region, Block, OptionList, Border} from 'hubris-components/containers'
import React from 'react'
import {Bonus, Tracker, DC, Counter} from 'hubris-components/numbers'
import { CheckboxItem } from 'hubris-components/text'
import {style} from 'hubris-components/styles'
import { Ruleset } from "../../../rules/ruleset"

export default class Stats extends Info {
    [immerable]=true
    constructor() {
        super()
        this.points = 28;
        this.scores={}
        ruleset.reference.skill_codes.forEach((code)=> {
            this.scores[code]=new AbilityScore(code)
        })
    }
    static parse(json) {
        var self=super.parse('stats', json)
        Object.keys(self.scores).forEach((key)=> {
            self.scores[key]=AbilityScore.parse(self.scores[key])
        })
        if (json.backgrounds!=undefined) {
            self.boosts(json.backgrounds)
        }
        return self        
    }
    increment(action) {
        var target=_.get(this, action.path)
        var cost=target.increment(this.points)
        if (cost!=false) {
            this.points-=cost
        }
    }
    decrement(action) {
        var target=_.get(this, action.path)
        var cost=target.decrement(this.points)
        if (cost!=false) {
            this.points-=cost
        }
    }
    boosts(backgrounds) {
        console.log(backgrounds)
        this.scores[backgrounds.primary.attributes.name.slice(0,3).toLowerCase()].boostify()
        this.scores[backgrounds.secondary.attributes.name.slice(0,3).toLowerCase()].boostify()
    }
    increase_score(score) {
        var step = this.score_values[String(this[score] + 1)] - this.score_values[String(this[score])]
        console.log(step)
        if (this.points - step >= 0 && this[score] < 4) {
            this[score] += 1
            this.points -= step
        }
    }
    decrease_score(score) {
        var step = this.score_values[String(this[score]) - 1] - this.score_values[String(this[score])]
        console.log(step)
        if (this[score] > -2 && this.points - step <= 28) {
            this[score] -= 1
            this.points -= step
        }
    }
    finalize() {
        const copy = Object.assign(new Object(), this)
        copy.boosted.forEach((boost) => {
            copy[boost] += 1
        })
        return copy
    }
    output(character) {
        character.ability_scores=this.finalize()
    }
    display(update) {
        const display={
            display:'grid',
            gridTemplateColumns:'repeat(3, auto)'
        }
        return(
            <div>
                <DC item={{label:'Remaining', value:this.points}}/>
                <div style={display}>
                {Object.keys(this.scores).map(code=> this.scores[code].display(update))}
                </div>
            </div>
        )
    }
    StatsSkills({stats, skills}) {
        var grouped = skills.by_attribute()
        Object.keys(grouped).forEach((code)=> {
            grouped[code].bonus=stats[code]
        })
        return (
            <Block header={'Stats'} className={style("stat", 
            {
                display:'grid', 
                gridTemplateColumns:'50% 50%',
                '& div': {
                    width: 'auto'
                    }
            })}>
                {Object.keys(grouped)
                    .map(code =>
                    <Border>
                        <div>
                        <Bonus item={{value: grouped[code].bonus, label: code, id: code}} />
                        <OptionList>
                            {grouped[code].map(c=><CheckboxItem item={{label:c.name, value:c.bonus, id:c.id}} checked={c.proficient} />)}
                        </OptionList>
                        </div>
                    </Border>)}
                </Block>
        )
    }
}


class AbilityScore {
    [immerable]=true
    constructor(code, value=-2) {
        this.code=code
        this.value=value
        this.max=4
        this.min=-2
    }
    static parse(ob) {
        var self=new AbilityScore(ob.code)
        Object.assign(self, ob)
        return self
    }
    cost(value=this.value) {
        var mapping= {
            "-2": 0,
            "-1": 1,
            "0": 2,
            "1": 3,
            "2": 5,
            "3": 8,
            "4": 12
        }
        return mapping[value]
    }
    affordable(points, cost) {
        if (points-cost>-1 || points-cost>29) {
            return true
        }
        else {
            return false
        }
    }
    boostify() {
        this.max=5
        this.min=-1
        this.value+=1
        this.cost=function(value=this.value) {
            var mapping={
                '-1':0,
                '0':1,
                '1':2,
                '2':3,
                '3':8,
                '4':8,
                '5':12
            }
            return mapping[value]
        }
    }
    increment(points) {
        if (this.value<this.max) {
            var net_cost=Math.abs(this.cost()-this.cost(this.value+1))
            if (this.affordable(points, net_cost)) {
                this.value+=1
                return net_cost
            }
        }
        return false

    }
    decrement(points) {
        if (this.value>this.min) {
            var net_cost=-1*Math.abs(this.cost()-this.cost(this.value-1))
            if (this.affordable(points, net_cost)) {
                this.value-=1
                return net_cost
        }
    }
    return false 
}
    display(handler) {
        function Stat({label, value, handler}) {
            console.log(handler)
            return(
                <Counter item={{label:label, value:value, path:`scores.${label}`}} update={handler}/>
            )
        }
        return <Stat label={this.code} value={this.value} handler={handler}/>
    }

}