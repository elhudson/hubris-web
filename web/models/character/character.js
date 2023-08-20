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
import { Item } from '../../components/components/containers';
import { useTheme } from '@emotion/react';
import { css } from '@emotion/css';
export class Character {
    [immerable] = true
    constructor(id) {
        this.id = id
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
            trash: '/delete?' + new URLSearchParams({ character: this.id })
        }
    }
    clone() {
        return _.cloneDeep(this)
    }
    static async request(id) {
        var request = await fetch('/character?' + new URLSearchParams({ character: id }))
        var json = await request.json()
        var character = Character.parse(json)
        sessionStorage.setItem('character', JSON.stringify(character))
        return character
    }
    static assemble() {
        return Character.parse(JSON.parse(sessionStorage.getItem('character')))
    }
    async delete() {
        var resp = await fetch(this.routes.trash).then((j) => j.json())
        sessionStorage.removeItem('character')
        alert(resp.msg)
    }
    static parse(data) {
        var ch = new Character(data.id)
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
    static async load(id = null) {
        id == null && (id = new URLSearchParams(window.location.href.split('?')[1]).get('character'))
        if (Object.hasOwn(sessionStorage, 'character')) {
            var v = Character.assemble()
            v.id = id
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
        console.log(this.routes.ref)
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
                effects: this.classes.base == null ? new Groups([]) : new Groups([this.classes.effects()]),
                metadata: {
                    ranges: new Groups(ruleset.ranges.list()),
                    durations: new Groups(ruleset.durations.list())
                }
            }
        }
        return options
    }
    controls() {
        function CharacterControls({ ch }) {
            const handleSave = async () => {
                sessionStorage.setItem('character', JSON.stringify(ch))
                var resp = await ch.write()
                alert(resp.msg)
            }
            const handleLevelup = () => {
                window.location.assign(ch.routes.levelup)
            }
            const handleSheet = () => {
                window.location.assign(ch.routes.sheet)
            }
            const handleTrash = async () => {
                await ch.delete()
            }
            return (
                <Buttons>
                    <Button onClick={handleSave}>
                        <Icon name={'save'} /></Button>
                    <Button onClick={handleLevelup}>
                        <Icon name={'levelup'} />
                    </Button>
                    <Button onClick={handleSheet}>
                        <Icon name={'character-sheet'} /></Button>
                    <Button onClick={handleTrash}>
                        <Icon name={'trash'} />
                    </Button>
                </Buttons>
            )
        }
        return <CharacterControls ch={this} />
    }
    thumbnail() {
        function Thumbnail({ ch }) {
            const theme=useTheme()
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
                        white-space: nowrap;
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
                    {ch.controls()}
                    <div className={css`
                        border: ${theme.border};
                        padding: 5px;
                    `}>
                        <div>
                            <Item label={'Class'}>
                                <text>{ch.classes.base.name}</text>
                            </Item>
                        </div>
                        <div>
                            <Item label={'Backgrounds'}>
                                <text>
                                    {ch.backgrounds.primary.name} & {ch.backgrounds.secondary.name}
                                </text>
                            </Item>
                        </div>
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