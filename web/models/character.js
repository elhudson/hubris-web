import { useImmerReducer } from 'use-immer'
import { StatArray } from '../rules/stats';
import { SkillArray } from '../rules/structures';
import { immerable, current } from 'immer'
import * as _ from 'lodash'
import { Entry } from '../rules/feature';
import { Groups } from '../rules/sorts';

export class Character {
    [immerable] = true
    constructor(data) {
        Object.assign(this, data);
        this.ability_scores = StatArray.from(data);
        this.skills.owned = SkillArray.parse(data.skills, ruleset.skills);
    }
    clone() {
        return _.cloneDeep(this)
    }
    static parse(data) {
        var ch = new Character(data)
        Object.keys(data).forEach((k) => {
            if (Object.keys(ruleset).filter(i => i.includes('__') == false).includes(k)) {
                ch[k] = data[k].map(d => Entry.parse(d))
            }
        })
        ch.ability_scores = data.ability_scores
        ch.bio=Bio.parse(data.bio)
        return ch
    }
    static load(id) {
        if (sessionStorage.getItem(id)==null) {
            return this.create(id)
        }
        else {
            return this.parse(JSON.parse(sessionStorage.getItem(id)))
        }
    }
    static create(id) {
        var scores = new StatArray()
        var self = new Character({
            id: id,
            xp_earned: 6,
            xp_spent: 0,
            skills: ruleset.skills.list(),
            bio:new Bio()
        })
        self.ability_scores = scores
        return self
    }
    save() {
        sessionStorage.setItem(this.id,JSON.stringify(this))
    }
    write(url) {
        fetch(url, {
            method:'POST',
            body:sessionStorage.getItem(this.id)
        })
    }
    tier(xp = this.xp_spent) {
        var spent = Number(xp)
        if (_.range(0, 30).includes(spent)) { return 1 }
        else if (_.range(30, 75).includes(spent)) { return 2 }
        else if (_.range(75, 125).includes(spent)) { return 3 }
        else { return 4 }
    }
    proficiency(xp = this.xp_spent) {
        var tier = this.tier(xp)
        return tier + 1
    }
    ac({ xp = this.xp_spent, dex = this.ability_scores.dex, armor = this.armor }) {
        if (armor == undefined) {
            armor = this.classes[0].armor_proficiencies
        }
        var proficiency = this.proficiency(xp)
        var cls;
        armor == 'Light' && (cls = 10 + dex + proficiency)
        armor == 'Medium' && (cls = 14 + proficiency)
        armor == 'Heavy' && (cls = 18 + proficiency)
        return cls
    }
    atk({ xp = this.xp_spent, cls = this.classes[0].name, dex = this.ability_scores.dex, str = this.ability_scores.str }) {
        var proficiency = this.proficiency(xp)
        if (['Rogue', 'Sharpshooter'].includes(cls)) {
            return dex + proficiency
        }
        else {
            return str + proficiency
        }
    }
    pwr({ xp = this.xp_spent, cls = this.classes[0] }) {
        var attr = ruleset.attributes[cls.relate['attributes']].name
        var pb = this.proficiency(xp)
        return Number(this.ability_scores[attr.toLowerCase().slice(0, 3)]) + pb
    }
    class_tags() {
        return this.classes[0].links('tags')
    }
    has(feature) {
        if (Object.hasOwn(this, feature.table)) {
            var r = this[feature.table].map(f => f.id)
            return r.includes(feature.id)
        }
        else { return false }
    }
    available(obj, column) {
        return obj.links(column).filter(t => t.qualifies(this))
    }
    add(feature) {
        if (feature != null) {
            this[feature.table] == undefined && (this[feature.table] = [])
            this[feature.table].push(feature)
            feature.defaults.forEach((f) => {
                this.add(f)
            })
            this.options[feature.table].get(feature).bought = true
            this.options[feature.table].qual(this, feature)
        }
    }
    purchase(feature) {
        if (feature.addable(this)) {
            this.xp_spent += feature.xp
            this.add(feature)
        }
        else {
            alert('Not eligible!')
            document.getElementById(feature.id).checked = false
        }
    }
    refund(feature) {
        if (feature.removeable(this)) {
            this.xp_spent -= feature.xp
            this.remove(feature)
        }
        else {
            alert('This is a default feature!')
        }
    }
    remove(feature) {
        if (feature != null && feature != undefined ) {
            this[feature.table] == undefined && (this[feature.table] = [])
            _.remove(this[feature.table], f => f.id == feature.id)
            var illegal = this[feature.table].filter(f => f.legal(this) == false)
            illegal.forEach((i) => {
                this.refund(i)
            })
            feature.defaults.forEach((f) => {
                if (f!=null && f.removeable(this)) {
                    this.remove(f)
                }
            })
            if (this.options[feature.table].pool().map(f => f.id).includes(feature.id)) {
                this.options[feature.table].get(feature).bought = false
            }
            this.options[feature.table].dequal(this, feature)
        }
    }
    buyable() {
        var options = new Object();
        if (this.tags == undefined) {
            this.tags = this.class_tags()
        }
        options.class_features = new Groups(this.available(this.classes[0], 'class_features'))
        options.tag_features = new Groups(_.uniqBy(this.tags.flatMap(t => this.available(t, 'tag_features')), 'id'))
        options.effects = new Groups(_.uniqBy(this.tags.flatMap(t => this.available(t, 'effects')), 'id'))
        options.effects.forEach((ef) => { ef.quald_by(this) })
        options.ranges = new Groups([])
        options.durations = new Groups([])
        return options
    }
}

class Bio {
    [immerable]=true
    constructor() {
        this.name;
        this.gender;
        this.appearance;
        this.backstory;
        this.alignment='lg'
    }
    update(prop, v) {
        this[prop]=v
    }
    static parse(json) {
        const b=new Bio()
        Object.assign(b,json)
        return b
    }
}

export function useCharacter(ch) {    
    const [character, dispatch] = useImmerReducer(dispatcher, ch)
    function dispatcher(draft, action) {
        if (action.type=='add') {
            var f=ruleset[action.target][action.id]
            draft.purchase(f)
        }
        if (action.type=='drop') {
            var f=ruleset[action.target][action.id]
            draft.refund(f)
        }
        if (action.type=='bin') {
            draft.options[action.target].regroup(action.value)
        }
        if (action.type=='bio') {
            action.content=="" && (action.content=action.inner)
            draft.bio.update(action.target, action.content)
        }
        if (action.type=='update-score') {
            var ref=current(draft)
            if (action.direction=='up') {
                var atm=action.costs[action.value]
                var next=action.costs[Number(action.value)+1]
                var diff=next-atm
                if (ref.ability_scores.points-diff>=0) {
                    draft.ability_scores[action.code]+=1
                    draft.ability_scores.points-=diff
                }
            }
            if (action.direction=='down') {
                var atm=action.costs[action.value]
                var next=action.costs[Number(action.value)-1]
                var diff=next-atm
                draft.ability_scores[action.code]-=1
                draft.ability_scores.points-=diff
            }
        }
    }
    return [character, dispatch]
}


