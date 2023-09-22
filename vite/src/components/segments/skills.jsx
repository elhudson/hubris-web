import { current, immerable } from "immer";

import { DC } from "@elements/numbers";
import React from "react";
import {Skill} from '@models/entry';
import _ from "lodash";

export default class Skills extends Array {
    [immerable]=true
    constructor() {
        super()
        for (var i of _.range(0,18)) {
            this[i]=ruleset.skills.list()[i].clone()
            this[i].proficient=false
        }
    }
    static parse(data, context) {
        var self=new Skills()
        for (var i=0;i<self.length;i++) {
            try {
                self[i]=Skill.parse(data[i])
            }
            catch {
                TypeError
            }
        }
        self.bonuses(context.scores, context.pb)
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
            return (
            <div>
                {inCreation && <DC item={{value:free, label:'Remaining'}} />}
                {Object.keys(groups).map(group=> 
                <div>
                    <h4>{group}</h4>
                    <div>
                        {groups[group].map(g=>g.display({handler:handler}))}
                    </div>
                </div>)}                
            </div>)
        }
        var remain=free-this.get_known()        
        return(<Skills skills={this} free={remain} handler={handler} inCreation={inCreation}/>)
    }
}