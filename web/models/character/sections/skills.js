import { immerable, current} from "immer";
import _ from "lodash";
import React from "react";
import {style} from '../../../components/components/styles'

import { CheckboxItem } from "../../../components/components/text";
import { LabeledItem } from "../../../components/components/containers";
import { DC } from "../../../components/components/numbers";


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
                if (skills[i].proficient==true) {
                    self[i].proficient=true
                }
            }
        }
        self.bonuses(data.scores, data.pb)
        return self
    }
    bonuses(scores, pb) {
        this.forEach((skill)=> scores.skill_bonus(skill, pb))
    }
    get(id) {
        return _.find(this, i=>i.id==id)
    }
    get_known() {
        return _.countBy(this,f=>f.proficient==true).true
    }
    addDrop(action) {
        var target=this.get(action.data.value)
        var int=action.context.stats.scores.int.value
        action.data.checked ? 
            target.select(action.context.skills, action.context.progression, int) 
            : target.deselect(action.context.skills, action.context.progression, int)
    }
    by_attribute() {
        let v={}
        var codes=[...new Set(this.map(t=>t.code))]
        codes.forEach((code)=> {
            v[code]=_.filter(this, c=>c.code==code)
        })
        return v
    }
    display({handler=null, free, inCreation=false}) {
        function Skills({skills, free, handler, inCreation}) {
            var groups=skills.by_attribute()
            var leeway=(free>0)
            return (
            <div>
                {inCreation && <DC item={{value:free, label:'Remaining'}} />}
                {Object.keys(groups).map(group=> 
                <div>
                    <h4>{group}</h4>
                    <div>
                        {groups[group].map(g=>g.display({handler:handler, disabled:leeway}))}
                    </div>
                </div>)}                
            </div>)
        }
        var remain=free-this.get_known()
        return(<Skills skills={this} free={remain} handler={handler} inCreation={inCreation}/>)
    }
}