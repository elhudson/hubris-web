import { useImmerReducer } from 'use-immer'
import React from 'react';
import { immerable, current } from 'immer'
import * as _ from 'lodash'
import { Choices, Groups, Options } from '../../elements/sorts';
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
import { Button, Buttons, Controls } from '../../components/components/interactive'
import { Icon } from '../../components/components/images';
import { styles } from '../../components/components/styles';
import { Alignment } from './sections/bio';
import { Tier } from './sections/progression';
import { useTheme } from '@emotion/react';
import { css } from '@emotion/css';
import { Block, Item } from '../../components/components/containers';


export class Character {
    [immerable] = true
    constructor(id, user) {
        this.id = id
        this.user = user
        this.classes = new Classes()
        this.backgrounds = new Backgrounds()
        this.bio = new Bio()
        this.combat = new Combat()
        this.stats = new Stats()
        this.skills = new Skills()
        this.progression = new Progression()
        this.health = new Health()
        this.features = new Features()
        this.powers = new Powers()
        this.routes = {
            sheet: '/sheet?' + new URLSearchParams({ character: this.id }),
            ref: '/character?' + new URLSearchParams({ character: this.id }),
            levelup: '/levelup?' + new URLSearchParams({ character: this.id }),
            trash: '/delete?' + new URLSearchParams({ character: this.id }),
            characters: '/characters?' + new URLSearchParams({ user: this.user })
        }
    }
    clone() {
        return _.cloneDeep(this)
    }
    static async request(id) {
        var url='/character?'+ new URLSearchParams({ character: id })
        var request=await fetch(url)
        var json = await request.json()
        var character = Character.parse(json)
        return character
    }
    static assemble() {
        console.log(JSON.parse(sessionStorage.getItem('character')))
        return Character.parse(JSON.parse(sessionStorage.getItem('character')))
    }
    async delete() {
        var resp = await fetch(this.routes.trash).then((j) => j.json())
        sessionStorage.removeItem('character')
        alert(resp.msg)
    }
    static parse(data) {
        var ch = new Character(data.id, data.user)
        ch.classes = Classes.parse(data.classes)
        ch.backgrounds = Backgrounds.parse(data.backgrounds)
        ch.stats = Stats.parse(data.stats)
        ch.features = Features.parse(data.features, ch.backgrounds)
        ch.progression = Progression.parse(data.progression)
        ch.powers = Powers.parse(data.powers, {
            scores: ch.stats.scores,
            pb: ch.progression.proficiency(),
            attr: ch.classes.base == null ? { name: 'Strength' } : ch.classes.base.attributes
        })
        ch.skills = Skills.parse(data.skills, {
            scores: ch.stats,
            pb: ch.progression.proficiency()
        })
        ch.bio = Bio.parse(data.bio)
        ch.combat = Combat.parse(data.combat, {
            str: ch.stats.scores.str.value,
            dex: ch.stats.scores.dex.value,
            pb: ch.progression.proficiency(),
            classname: ch.classes.base == null ? 'Wizard' : ch.classes.base.name
        })
        ch.health = Health.parse(data.health)
        ch.options = new Options(ch)
        ch.bought()
        return ch
    }
    bought() {
        var locations = ['features.class_features', 'features.tag_features', 'powers.effects', 'powers.metadata.ranges', 'powers.metadata.durations']
        locations.forEach((location) => {
            _.get(this.options, location).forEach((feature) => {
                feature.bought = _.get(this, location).includes(feature)
                feature.buyable = feature.qualifies(this)
            })
        })
    }
    static async load(id) {
        if (Object.hasOwn(sessionStorage, 'character') && JSON.parse(sessionStorage.getItem('character')).id==id) {
            var v = Character.assemble()
            return v
        }
        else {
            var v = await Character.request(id)
            return v
        }
    }
    save() {
        sessionStorage.setItem('character', JSON.stringify(this))
    }
    async write() {
        var req = {
            method: 'POST',
            body: JSON.stringify(this),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }
        var r = await fetch(this.routes.ref, req).then((r) => r.json())
        return r
    }
    has(feature) {
        try {
            return _.get(this, feature.path).includes(feature)
        }
        catch { TypeError } {
            return false
        }
    }
    available(obj, column) {
        var r = obj.links(column).filter(t => t.qualifies(this))
        return r
    }
    buyable() {
        var options = {
            features: {
                class_features: this.classes.base == null ? new Groups([]) : new Groups(this.classes.class_features()),
                tag_features: this.classes.base == null ? new Groups([]) : new Groups(this.classes.tag_features())

            },
            powers: {
                effects: this.classes.base == null ? new Groups([]) : new Groups(this.classes.effects()),
                metadata: {
                    ranges: new Groups(ruleset.ranges.list()),
                    durations: new Groups(ruleset.durations.list())
                }
            }
        }
        return options
    }
    controls(action) {
        const controls = {
            save: async () => {
                sessionStorage.setItem('character', JSON.stringify(this))
                var resp = await this.write()
                alert(resp.msg)
            },
            levelup: () => {
                window.location.assign(this.routes.levelup)
            },
            sheet: () => {
                window.location.assign(this.routes.sheet)
            },
            delete: async () => {
                await this.delete()
                window.location.assign(this.routes.characters)
            },
            characters: () => {
                window.location.assign(this.routes.characters)
            }
        }

        return controls[action]
    }
    header({ patch = null }) {
        function Sheet({ ch, patch = null }) {
            var update = patch('bio', 'update')
            return (
                <Block header={'Bio'}>
                    <Item label={'name'}>
                        <text>
                            {ch.name}
                        </text>
                    </Item>
                    <Item label={'class'}>
                        <text>{ch.classes.base.name}</text>
                    </Item>
                    <Item label={'backgrounds'} >
                        <text>{ch.backgrounds.primary.name + ' & ' + ch.backgrounds.secondary.name}</text>
                    </Item>
                    <Alignment update={update} selected={ch.bio.alignment} />
                </Block>
            )
        }
        return (<Sheet ch={this} patch={patch} />)
    }
    thumbnail() {
        function Thumbnail({ ch }) {
            const theme = useTheme()
            return (
                <div className={css`
                    border: ${theme.border};
                    padding:5px;
                    height: fit-content;
                    width: 100%;
                    > div {
                        margin-bottom:5px;
                    }
                `}>
                    <div className={css`
                        border: ${theme.border};
                        width: 100%;
                        text-transform: uppercase;
                        text-align: center;
                        font-weight: bold;
                        a {
                            color: ${theme.text};
                        }
                    `}>
                        <a href={ch.routes.sheet}>
                            {ch.bio.name}
                        </a>
                    </div>
                    <div className={css`
                        border:${theme.border};
                        svg {
                            height: 150px;
                            width: 150px;
                        }
                    `}>
                        <Icon name={`classes__${ch.classes.base.name.toLowerCase()}`} />
                    </div>
                    <div>
                        <Buttons>
                            <Button onClick={ch.controls('levelup')}>Level Up</Button>
                            <Button onClick={ch.controls('delete')}>Delete</Button>
                            <Button onClick={ch.controls('sheet')}>Sheet</Button>
                        </Buttons>
                    </div>
                    <div className={css`
                        border: ${theme.border};
                        padding: 5px;
                    `}>
                        <Item label={'Class'}>
                            <text>{ch.classes.base.name}</text>
                        </Item>
                        <Item label={'Backgrounds'}>
                            <text>
                                {ch.backgrounds.primary.name} & {ch.backgrounds.secondary.name}
                            </text>
                        </Item>
                        <Alignment selected={ch.bio.alignment} />
                        <Tier tier={ch.progression.tier()} />
                    </div>
                </div>
            )
        }
        return Thumbnail({ ch: this })
    }
}

export function SaveButton({ ch }) {
    const handleSave = () => {
        sessionStorage.setItem(ch.id, JSON.stringify(ch))
        ch.write()
    }
    return (
        <div style={{ position: 'fixed', width: 'fit-content', background: styles.background, top: 30, right: 30 }}>
            <Button onClick={handleSave}>
                <Icon name={'save'} size={40} />
            </Button>
        </div>
    )
}

export function useCharacter(ch) {
    const [character, dispatch] = useImmerReducer(dispatcher, ch)
    function dispatcher(draft, action) {
        if (action.needs_context) {
            action.context = draft
        }
        draft[action.parent][action.type](action, draft)
    }
    return [character, dispatch]
}

export function generatePatch(dispatcher) {
    const patch = (parent, type, needs_context = false) => {
        const handleChange = (e) => {
            dispatcher({
                type: type,
                parent: parent,
                needs_context: needs_context,
                src: e.target.tagName,
                path: e.target.getAttribute('path'),
                data: e.target,
                table: e.target.getAttribute('table')
            })
        }
        return handleChange
    }
    return patch
}