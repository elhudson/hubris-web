import { useImmerReducer } from 'use-immer'
import { immerable, current } from 'immer'
import * as _ from 'lodash'
import Entry from '../../rules/feature';
import { Choices, Groups } from '../../rules/sorts';
import Bio from './sections/bio';
import Skills from './sections/skills';
import Stats from './sections/stats';
import Progression from './sections/progression';
import Health from './sections/health';
import Combat from './sections/combat';
import Features from './sections/features';
import Powers from './sections/powers';
import Classes from './sections/class';
import Backgrounds from './sections/backgrounds'
import Info from './section';
import { json } from 'react-router-dom';

export class Character {
    [immerable] = true
    constructor(id) {
        this.id = id
        this.classes = new Classes()
        this.backgrounds = new Backgrounds()
        this.bio = new Bio()
        this.combat = new Combat()
        this.stats = new Stats()
        this.skills=new Skills()
        this.progression = new Progression()
        this.health = new Health()
        this.features=new Features()
        this.powers=new Powers()
    }
    clone() {
        return _.cloneDeep(this)
    }
    static async request(id) {
        var request = await fetch(`/${id}`)
        var json = await request.json()
        var character = Character.parse(json)
        if (sessionStorage.getItem(id) == null) {
            sessionStorage.setItem(id, JSON.stringify(character))
        }
        return character
    }
    static parse(data) {
        var ch = new Character(data.id)
            ch.classes=Classes.parse(data.classes)
            ch.backgrounds=Backgrounds.parse(data.backgrounds)
            ch.stats=Stats.parse(data.stats)
            ch.features=Features.parse(data.features, ch.backgrounds)
            ch.progression=Progression.parse(data.progression)
            ch.powers=Powers.parse(data.powers, {
                scores:ch.stats.scores,
                pb:ch.progression.proficiency(),
                attr:ch.classes.base.attributes
            })
            ch.skills=Skills.parse(data.skills, {
                scores:ch.stats,
                pb:ch.progression.proficiency()
            })
            ch.bio=Bio.parse(data.bio)
            ch.combat=Combat.parse(data.combat, {
                str:ch.stats.scores.str.value, 
                dex:ch.stats.scores.dex.value, 
                pb:ch.progression.proficiency(),
                classname:ch.classes.base.name
            })
            ch.health=Health.parse(data.health)
        return ch
    }
    static load(id) {
        if (sessionStorage.getItem(id) == null) {
            return 'Character not found!'
        }
        else {
            return this.parse(JSON.parse(sessionStorage.getItem(id)))
        }
    }
    static create(id) {
        return new Character(id)
    }
    save() {
        sessionStorage.setItem(this.id, JSON.stringify(this))
    }
    async write() {
        Object.keys(this).forEach(async (key)=> {
            var req= {
                method: 'POST',
                body: JSON.stringify({[key]:this[key]}),
                headers:new Headers({
                    'Content-Type':'application/json'
                })
            }
            await fetch(`/${this.id}`, req)
        })
            
    }
    has(feature) {
        try {
            return _.get(this, feature.path).includes(feature)
        }
        catch {TypeError} {
            return false
        }
    }
    available(obj, column) {
        var r=obj.links(column).filter(t => t.qualifies(this))
        return r
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
        if (feature != null && feature != undefined) {
            this[feature.table] == undefined && (this[feature.table] = [])
            _.remove(this[feature.table], f => f.id == feature.id)
            var illegal = this[feature.table].filter(f => f.legal(this) == false)
            illegal.forEach((i) => {
                this.refund(i)
            })
            feature.defaults.forEach((f) => {
                if (f != null && f.removeable(this)) {
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
        if (this.tags == undefined) {
            this.tags = this.class_tags
        }
        var options={
            features:{
                class_features:new Groups(this.classes.class_features()),
                tag_features:new Groups(this.classes.tag_features())
            },
            powers:{
                effects:new Groups(this.classes.effects()),
                metadata:{
                    ranges:new Groups(ruleset.ranges.list()),
                    durations:new Groups(ruleset.durations.list())
                }
            }
        }
        return options
    }
}

export function useCharacter(ch, url) {
    ch.options = new Choices(ch, url)
    const [character, dispatch] = useImmerReducer(dispatcher, ch)
    function dispatcher(draft, action) {
        if (action.needs_context) {
            action.context=draft
        }
        draft[action.parent][action.type](action, draft)

        
        // if (followup == 'add' || followup == 'drop') {
        //     var success = draft.options.addDrop(action, current(draft))
        //     draft[action.path].add(ruleset[action.path][action.data.value])
        //     draft.options[action.path].forEach((opt)=>{
        //         opt.buyable=opt.qualifies(draft)
        //         console.log(opt.qualifies(draft))
        //     })
        //     if (success && action.type == 'drop') {
        //         draft[action.path].remove(rulset[action.path][action.data.value])
        //     }
        //     else {
        //         alert('Cannot add or remove this feature!')
        //     }
        // }

        
        // current(draft).save()

        // if (action.type == 'add') {

        // }
        // if (action.type == 'drop') {
        //     var f = ruleset[action.target][action.id]
        //     draft.refund(f)
        // }
        // if (action.type == 'bin') {
        //     draft.options[action.target].regroup(action.value)
        // }
        // if (action.type == 'bio') {
        //     action.content == "" && (action.content = action.inner)
        //     draft.bio.update(action.target, action.content)
        // }
        // if (action.type == 'update-score') {
        //     var ref = current(draft)
        //     if (action.direction == 'up') {
        //         var atm = action.costs[action.value]
        //         var next = action.costs[Number(action.value) + 1]
        //         var diff = next - atm
        //         if (ref.ability_scores.points - diff >= 0) {
        //             draft.ability_scores[action.code] += 1
        //             draft.ability_scores.points -= diff
        //         }
        //     }
        //     if (action.direction == 'down') {
        //         var atm = action.costs[action.value]
        //         var next = action.costs[Number(action.value) - 1]
        //         var diff = next - atm
        //         draft.ability_scores[action.code] -= 1
        //         draft.ability_scores.points -= diff
        //     }
        // }
    }
    return [character, dispatch]
}

export function generatePatch(dispatcher) {
    const patch = (parent, type, needs_context=false) => {
        const handleChange = (e) => {
            dispatcher({
                type: type,
                parent: parent,
                needs_context: needs_context,
                src: e.target.tagName,
                path: e.target.getAttribute('path'),
                data: e.target,
                table:e.target.getAttribute('table')
            })
        }
        return handleChange
    }
    return patch
}