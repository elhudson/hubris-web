import { immerable } from "immer"
import Info from "../section"
import Entry from "../../../elements/feature"
import React from 'react'
import {Region, Block, Item} from 'hubris-components/containers'
import {Dropdown} from 'hubris-components/interactive'
import { Ruleset } from "../../../rules/ruleset"

export default class Classes extends Info {
    [immerable]=true
    constructor() {
        var skeleton={
            base:null
        }
        super(skeleton)
    }
    includes(id) {
        return this.base.id==id
    }
    class_features() {
        var ids=this.base.class_features.map(f=>f.id)
        var features=ids.map(i=>ruleset.class_features[i])
        return features
    }
    tag_features() {
        var ids=this.base.tags.map(f=>f.id)
        var features=ruleset.tag_features.list().filter(f=>ids.includes(f.tags.id))
        return features
    }
    effects() {
        var tag_ids=this.base.tags.map(t=>t.id)
        var all=[]
        tag_ids.forEach((id)=> {
            var effects=ruleset.effects.list().filter(f=>f.tags.map(t=>t.id).includes(id))
            all=all.concat(effects)
        })
        return all
    }
    add(feature) {
        this.base=feature
    }
    remove(feature) {
        this.base=null
    }
    static parse(json) {
        var self=new Classes()
        json.classes!=undefined && (self.base=Entry.parse(json.classes.base))
        return self
    }
}