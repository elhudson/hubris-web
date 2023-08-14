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
    static parse(raw) {
        var self= super.parse(raw)
        Object.keys(self.scores).forEach((score)=> {
            self.scores[score]=AbilityScore.parse(raw.scores[score])
        })
        return self
    }
    skill_bonus(skill, pb) {
        this.scores[skill.code].bonus(skill, pb)
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
        var bg1, bg2
        if (Array.isArray(backgrounds)) {
            bg1=backgrounds[0]
            bg2=backgrounds[1]
        }
        else {
            bg1=backgrounds.primary
            bg2=backgrounds.secondary
        }
        if (bg1!=null && bg2!=null) {
            this.scores[bg1.attributes.name.slice(0,3).toLowerCase()].boostify()
            this.scores[bg2.attributes.name.slice(0,3).toLowerCase()].boostify()
        }
    }
    displayAllocate(update) {
        function Stats({stats, update}) {
            return(
                <div>
                    <DC item={{label:'Remaining', value:stats.points}}/>
                    <div style={{
                    display:'grid',
                    gridTemplateColumns:'repeat(3, auto)'}}>
                        {Object.keys(stats.scores).map(code=> stats.scores[code].display(update))}
                    </div>
                </div>
            )
        }
        return <Stats stats={this} update={update}/>
        
    }
    StatsSkills({stats, skills}) {
        var grouped = skills.by_attribute()
        Object.keys(grouped).forEach((code)=> {
            grouped[code].bonus=stats.scores[code].value
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
                            {grouped[code].map(c=>c.display())}
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
        if (self.max==5) {
            self.cost=function(value=this.value) {
                var mapping={
                    '-1':0,
                    '0':1,
                    '1':2,
                    '2':3,
                    '3':5,
                    '4':8,
                    '5':12
                }
                return mapping[value]
            }
        }

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
                '3':5,
                '4':8,
                '5':12
            }
            return mapping[value]
        }
    }
    increment(points) {
        console.log(this.cost())
        if (this.value<this.max) {
            var net_cost=Math.abs(this.cost()-this.cost(this.value+1))
            if (this.affordable(points, net_cost)) {
                this.value+=1
                return net_cost
            }
        }
        return false

    }
    bonus(skill, pb) {
        if (skill.proficient) {
            skill.bonus=this.value+pb
        }
        else {
            skill.bonus=this.value
        }
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
            return(
                <Counter item={{label:label, value:value, path:`scores.${label}`}} update={handler}/>
            )
        }
        return <Stat label={this.code} value={this.value} handler={handler}/>
    }

}