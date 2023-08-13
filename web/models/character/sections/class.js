import { immerable } from "immer"
import Info from "../section"
import Entry from "../../../elements/feature"
import React from 'react'
import {Region, Block, Item} from 'hubris-components/containers'
import {Dropdown} from 'hubris-components/interactive'
import { Ruleset } from "../../../rules/ruleset"
import { Arsenal, Armory } from "./combat"

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
    static parse(raw) {
        var self=super.parse(raw)
        self.base=Entry.parse(raw.base)
        return self
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
    tags() {
        var tag_ids=this.base.tags.map(t=>t.id)
        return tag_ids.map(t=>ruleset.tags[t])
    }
    add(feature, character) {
        this.base=feature
        character.health.hd.die=this.base.hit_dice
        character.powers.attr=this.base.attributes.name.slice(0, 3).toLowerCase()
        character.tags=this.base.tags.map(t=>ruleset.tags[t.id])
        character.combat.weapons=Arsenal.create({value:this.base.weapon_proficiencies, classname:this.base.name, str:character.stats.scores.str.value, dex:character.stats.scores.dex.value, pb:character.progression.proficiency()})
        character.combat.armor=Armory.assemble({cls:this.base.armor_proficiencies, dex:character.stats.scores.dex.value, pb:character.progression.proficiency()})
    }
    remove(feature) {
        this.base=null
    }
}