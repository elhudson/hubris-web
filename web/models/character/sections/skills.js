import { immerable } from "immer";
import { Ruleset } from "../../../rules/ruleset";
import _ from "lodash";

export default class Skills extends Array {
    [immerable]=true
    constructor() {
        super()
        for (var i of _.range(0,18)) {
            this[i]=ruleset.skills.list()[i]
        }
    }
    static parse(skills) {
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
        return self
    }
    by_attribute() {
        let v={}
        var codes=[...new Set(this.map(item=>item.code))]
        codes.forEach((code)=> {
            v[code]=this.filter(item=>item.code==code)
        })
        return v
    }
}