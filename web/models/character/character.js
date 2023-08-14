import { useImmerReducer } from 'use-immer'
import React from 'react';
import { immerable, current } from 'immer'
import * as _ from 'lodash'
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
import {Button, Controls} from 'hubris-components/interactive'

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
            ch.options=new Choices(ch, 'xp')
            ch.bought()
        return ch
    }
    bought() {
        var locations=['features.class_features', 'features.tag_features', 'powers.effects', 'powers.metadata.ranges', 'powers.metadata.durations']
            locations.forEach((location)=> {
            _.get(this.options, location).forEach((feature)=> {
                feature.bought=_.get(this, location).includes(feature)
                feature.buyable=feature.qualifies(this)
            })
        })
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
    buyable() {
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
    controls() {
        function CharacterControls({ch}) {
            const handleSave=()=> {
                console.log(ch)
                sessionStorage.setItem(ch.id, JSON.stringify(ch))
                ch.write()
            }
            const handleLevelup=()=> {
                window.location.assign(`/level/${ch.id}`)
            }
            const handleSheet=()=> {
                window.location.assign(`/sheet/${ch.id}`)
            }
            return(
            <Controls sx={{position:'fixed'}}>
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={handleLevelup}>Level Up</Button>
                <Button onClick={handleSheet}>Character Sheet</Button>
            </Controls>
            )}
        return <CharacterControls ch={this} />
    }
}

export function useCharacter(ch, url=null) {
    url!=null && (ch.options = new Choices(ch, url))
    const [character, dispatch] = useImmerReducer(dispatcher, ch)
    function dispatcher(draft, action) {
        if (action.needs_context) {
            action.context=draft
        }
        draft[action.parent][action.type](action, draft)
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