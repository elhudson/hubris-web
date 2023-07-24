import { useImmerReducer } from 'use-immer'
import { StatArray } from './stats';
import { FeatureArray, SkillArray } from './structures';
import { immerable, current } from 'immer'
import * as _ from 'lodash'
import { Entry, Collection } from './feature';
import { Groups } from '../pages/creation';

export class Character {
    [immerable] = true
    constructor(data) {
        Object.assign(this, data);
        this.ability_scores = StatArray.from(data);
        this.skills.owned = SkillArray.parse(data.skills, ruleset.skills);
    }
    static parse(data) {
        var ch=new Character(data)
        Object.keys(data).forEach((k)=> {
            if (Object.keys(ruleset).filter(i=>i.includes('__')==false).includes(k)) {
                ch[k]=data[k].map(d=>Entry.parse(d))
            }
        })
        ch.ability_scores=data.ability_scores
        return ch
    }
    static async load(id) {
        const from_file = await fetch('/static/characters/' + id + '.json')
        const data = await from_file.json()
        return new Character(data)
    }
    static create(id) {
        var scores=new StatArray()
        var self=new Character({
            id:id,
            xp_earned:6,
            xp_spent:0,
            skills:ruleset.skills.list()})
        self.ability_scores=scores
        return self
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
    pwr({ xp=this.xp_spent, cls=this.classes[0] }) {
        var attr = ruleset.attributes[cls.relate['attributes']].name
        var pb=this.proficiency(xp)
        return Number(this.ability_scores[attr.toLowerCase().slice(0, 3)]) + pb  
    }
    class_tags() {
        this.tags=this.classes[0].links('tags')
    }
    has(feature) {
        if (Object.hasOwn(this,feature.table)) {
        var r=this[feature.table].map(f=>f.id)
        return r.includes(feature.id) }
        else {return false}
    }
    available(obj, column) {
        return obj.links(column).filter(t=>t.qualifies(this))
    }
    buyable() {
        var options=new Object();
        options.class_features=new Groups(this.available(this.classes[0],'class_features'))
        options.tag_features=new Groups(_.uniqBy(this.tags.flatMap(t=>this.available(t,'tag_features')), 'id'))
        options.effects=new Groups(_.uniqBy(this.tags.flatMap(t=>this.available(t, 'effects')), 'id'))
        options.effects.forEach((ef)=> {ef.quald_by(this)})
        return options
    }
}

export function useCharacter(ch) {    
    const [character, dispatch] = useImmerReducer(dispatcher, ch)
    function dispatcher(draft, action) {
        const snapshot=()=> {return current(draft)}
        function adder(draft, feature) {
            draft[feature.table]==undefined && (draft[feature.table]=[])
            feature.qualifies(snapshot()) && draft[feature.table].push(feature) 
            ruleset.reference.has_ancestry.includes(feature.table) && (ancestry(draft, feature, true))
        }
        function ancestry(draft, feature, add) {
            add ? spender(draft, feature.xp) : refunder(draft, feature.xp)
            feature.table=='effects' && (metadata(draft, feature, add))
        }
        function remover(draft, feature) {
            if (feature.removeable(snapshot())) {
                _.remove(draft[feature.table], i=>i.id==feature.id)
                ruleset.reference.has_ancestry.includes(feature.table) && ancestry(draft, feature, false)
            }
        }
        function spender(draft, cost) {
            var cost=Number(action.cost)
            draft.xp_spent+=cost
        }
        function refunder(draft, cost) {
            var cost=Number(action.cost)
            draft.xp_spent-=cost
        }
        function metadata(draft, feature, add) {
            var rng=ruleset.ranges[feature.range.id]
            var dur=ruleset.durations[feature.duration.id]
            if (add) {
                adder(draft, rng)
                adder(draft, dur)
            }
            else {
                remover(draft, rng)
                remover(draft, dur)

            }
        }
        if (action.type=='add') {
            var f=ruleset[action.target][action.id]
           adder(draft, f)
        }
        if (action.type=='drop') {
            var f=ruleset[action.target][action.id]
            remover(draft, f)
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

