import * as _ from 'lodash';
import { css } from '@emotion/css';
import { useTheme } from '@emotion/react';
import { immerable } from 'immer';
import { useImmerReducer } from 'use-immer';
import Uri from 'jsuri';

import { Block, Item } from '@elements/containers';
import { Button, Buttons, Alert } from '@elements/interactive';
import { Icon } from '@elements/images';
import { CharacterNotFoundError, CharacterUndefinedError } from '@components/errors';

import Groups, { Ranges, Durations, Effects } from '@models/featureset';

import Options from '@sections/options'
import Classes from '@sections/class'
import Backgrounds from '@sections/backgrounds'
import Bio, { Alignment } from '@sections/bio'
import Combat from '@sections/combat'
import Stats from '@sections/stats'
import Skills from '@sections/skills'
import Progression, { Tier } from '@sections/progression'
import Health from '@sections/health';
import Features, { ClassFeatures, TagFeatures } from '@sections/features';
import Powers from '@sections/powers';

import { classes } from '@assets/icons'

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
    static parse(data) {
        console.log(data)
        var ch = new Character(data.id, data.user)
        ch.classes = Classes.parse(data.classes)
        ch.backgrounds = Backgrounds.parse(data.backgrounds)
        ch.stats = Stats.parse(data.stats)
        ch.features = Features.parse(data.features)
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
        ch.health.set_max_hp(ch.progression.tier(), ch.stats.scores.con.value)
        ch.options = new Options(ch)
        ch.bought()
        return ch
    }
    clone() {
        return _.cloneDeep(this)
    }
    static async request(id) {
        var url = '/character?' + new URLSearchParams({ character: id })
        var request = await fetch(url)
        var json = await request.json()
        var character = Character.parse(json)
        !_.isUndefined(character) && localStorage.setItem(character.id, JSON.stringify(character))
        return character
    }
    static retrieve(id) {
        const in_focus = sessionStorage.getItem('character')
        if (!_.isNull(in_focus)) {
            if (JSON.parse(in_focus).id == id) {
                return Character.parse(JSON.parse(in_focus))
            }
        }
        else {
            if (Object.keys(localStorage).includes(id)) {
                return Character.parse(JSON.parse(localStorage.getItem(id)))
            }
            else {
                throw new CharacterNotFoundError('')
            }
        }
    }
    async delete() {
        var resp = await fetch(this.routes.trash).then((j) => j.json())
        sessionStorage.removeItem('character')
        localStorage.removeItem(this.id)
        alert(resp.msg)
    }
    complete() {
        return (!_.isUndefined(this) && this.classes.base != null)
    }
    bought() {
        var locations = ['classes', 'backgrounds', 'features.class_features', 'features.tag_features', 'powers.effects', 'powers.metadata.ranges', 'powers.metadata.durations']
        locations.forEach((location) => {
            _.get(this.options, location).forEach((feature) => {
                try {
                    feature.bought = _.get(this, location).includes(feature)
                    feature.bought = _.get(this, location).base.id == feature.id
                    feature.bought = _.get(this, location).primary.id == feature.id
                    feature.bought = _.get(this, location).secondary.id == feature.id
                }
                catch { Error }
                feature.buyable = feature.qualifies(this)
            })
        })
    }
    static async load(id) {
        try {
            return Character.retrieve(id)
        }
        catch { CharacterNotFoundError } {
            var v = await Character.request(id)
            return v
        }
    }
    save() {
        localStorage.setItem(this.id, JSON.stringify(this))
        sessionStorage.setItem('character', JSON.stringify(this))
    }
    static async from_url() {
        const id = new Uri(window.location.href).getQueryParamValue('character')
        const character = await Character.load(id)
        return character
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
                class_features: this.classes.base == null ? new ClassFeatures([]) : new ClassFeatures(this.classes.class_features()),
                tag_features: this.classes.base == null ? new TagFeatures([]) : new TagFeatures(this.classes.tag_features())

            },
            powers: {
                effects: this.classes.base == null ? new Effects([]) : new Effects(this.classes.effects()),
                metadata: {
                    ranges: new Ranges(ruleset.ranges.list()),
                    durations: new Durations(ruleset.durations.list())
                }
            },
            classes: new Groups(ruleset.classes.list()),
            backgrounds: new Groups(ruleset.backgrounds.list())

        }
        return options
    }
    controls(action) {
        const controls = {
            save: async () => {
                sessionStorage.setItem('character', JSON.stringify(this))
                var resp = await this.write().then((j)=>JSON.parse(j.body))
                return (
                    <Alert msg={resp.msg} />
                )
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
                        <text>{ch.bio.name}</text>
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
                        <Icon path={classes[ch.classes.base.name.toLowerCase()]} />
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
        return this.complete() ? Thumbnail({ ch: this }) : <></>
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
    if (ch != null) {
        const [character, dispatch] = useImmerReducer(dispatcher, ch)
        function dispatcher(draft, action) {
            if (action.needs_context) {
                action.context = draft
            }
            draft[action.parent][action.type](action, draft)
        }
        return [character, dispatch]
    }
    else {
        throw new CharacterUndefinedError('')
    }

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