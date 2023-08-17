import { immerable, current} from "immer";
import _ from "lodash";
import React from "react";
import {style, styles} from '../../../components/components/styles'

import { CheckboxItem } from "../../../components/components/text";
import { LabeledItem } from "../../../components/components/containers";
export default class Skills extends Array {
    [immerable]=true
    constructor() {
        super()
        for (var i of _.range(0,18)) {
            this[i]=ruleset.skills.list()[i]
        }
    }
    static parse(skills, data) {
        var self=new Skills()
        if (skills.length<18) {
            var profs=skills.map(e=>e.id)
            self.forEach((skill)=> {
                profs.includes(skill.id) && (skill.proficient=true)
            })
        }
        else {
            for (var i=0;i<skills.length;i++) {
                if (skills[i].proficient) {
                    self[i].proficient=true
                }
            }
        }
        self.bonuses(data.scores, data.pb)
        return self
    }
    bonuses(scores, pb) {
        console.log(scores, pb)
        this.forEach((skill)=> scores.skill_bonus(skill, pb))
    }
    auto(backgrounds) {
        backgrounds.primary.skills.length>0 && (_.find(this, i=>i.id==backgrounds.primary.skills[0].id).proficient=true)
        backgrounds.secondary.skills.length>0 && (_.find(this, i=>i.id==backgrounds.secondary.skills[0].id).proficient=true)
    }
    addDrop(action) {
        var target=_.find(this, i=>i.id==action.data.value)
        action.data.checked ? target.select(action.context.stats.scores.int, action.context.skills, action.context.progression) 
        : target.deselect(action.context.stats.scores.int, action.context.skills, action.context.progression)
    }
    by_attribute() {
        let v={}
        var codes=[...new Set(this.map(t=>t.code))]
        codes.forEach((code)=> {
            v[code]=_.filter(this, c=>c.code==code)
        })
        return v
    }
    display({handler}) {
        function Skills({skills, handler}) {
            const display=style('skills', {
                display:'grid',
                gridTemplateColumns:'repeat(3, auto)'
            })
            var groups=skills.by_attribute()
            return (
            <div className={display}>
                {Object.keys(groups).map(group=> 
                <LabeledItem label={group}>
                    {groups[group].map(g=>
                        <CheckboxItem hideValue={true} checked={g.proficient} item={{label:g.name, value:g.id}} handler={handler}/>
                    )}
                </LabeledItem>)}                
            </div>)
        }
        return(<Skills skills={this} handler={handler}/>)
    }
}