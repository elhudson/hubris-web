import { immerable } from "immer"
import _ from "lodash"
import React from "react"
import {Groups} from '../models/character/featureset'

export class Choices {
    [immerable] = true
    constructor() {

    }
    regroup(action) {
        _.get(this, action.path).regroup(action.data.getAttribute('value'))
    }
    filter(action) {
        _.get(this, action.path).filterBy({ [action.data.getAttribute('name')]: action.data.getAttribute('value') })
    }
    sort(action) {
        _.get(this, action.path).sort(action.data.getAttribute('value'))
    }
    all() {
        var self = new Array()
        Object.keys(this).forEach((item) => {
            self = _.concat(self, this[item].pool())
        })
        return self
    }
    includes(feature) {
        var self = this.all()
        return (self.map(s => s.id).includes(feature.id))
    }
    static from(obj) {
        var self = new Choices()
        Object.assign(self, obj)
        return self
    }
    addDrop(action, ch, free = false) {
        var feature = ruleset[action.table][action.data.value].clone()
        free && (feature.xp = 0)
        console.log(feature.name, feature.qualifies(ch), feature.removeable(ch))
        if ((action.data.checked == true && feature.qualifies(ch) && feature.affordable(ch)) || (action.data.checked == false && feature.removeable(ch))) {
            feature.buyable=true
            var tree = _.get(this, action.path)
            var func = action.data.checked ? 'add' : 'remove'
            var cost = _.get(ch, action.path)[func](feature, ch)
            cost != null && (ch.progression.xp.spent += cost)
            action.table == 'effects' && (this.handleMetadata(feature, func, ch))
            tree.get(feature).bought=action.data.checked
            tree.forEach((item) => {
                item.buyable=item.qualifies(ch)
            })
        }
    }
    handleMetadata(feature, act, ch) {
        const synthAction = (feature, act) => {
            return ({
                path: `powers.metadata.${feature.table}`,
                parent: 'options',
                table: `${feature.table}`,
                data: {
                    value: feature.id,
                    checked: act == 'add' ? true : false
                }
            })
        }
        var range = synthAction(feature.range, act)
        var duration = synthAction(feature.duration, act)
        this.addDrop(range, ch, true)
        this.addDrop(duration, ch, true)
    }
    display({ binner, handler }) {
        return (
            <div>
                {Object.keys(this).map(key =>
                    this[key].display({ binner: binner, handler: handler }))}
            </div>
        )
    }
}


export class Options extends Choices {
    [immerable] = true
    constructor(character) {
        super()
        var buyable = character.buyable()
        this.features = Choices.from(buyable.features)
        this.powers = Choices.from(buyable.powers)
        this.powers.metadata = Choices.from(buyable.powers.metadata)
        this.classes = new Groups(ruleset.classes.list())
        this.backgrounds = new Groups(ruleset.backgrounds.list())
    }
    empty(path) {
        return _.get(this,path).empty()
    }
}


