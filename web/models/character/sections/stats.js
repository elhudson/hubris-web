import Info from "../section"
import { immerable, current } from "immer"
import { Region, Block, OptionList, Border, LabeledItem } from '../../../components/components/containers'
import React from 'react'
import { Bonus, Tracker, DC, Counter } from '../../../components/components/numbers'
import { useTheme } from "@emotion/react"
import { css } from "@emotion/css"


export default class Stats extends Info {
    [immerable] = true
    constructor() {
        super()
        this.points = 28;
        this.scores = {}
        ruleset.reference.skill_codes.forEach((code) => {
            this.scores[code] = new AbilityScore(code)
        })
    }
    static parse(raw) {
        var self = super.parse(raw)
        Object.keys(self.scores).forEach((score) => {
            self.scores[score] = AbilityScore.parse(raw.scores[score])
        })
        return self
    }
    skill_bonus(skill, pb) {
        this.scores[skill.code].bonus(skill, pb)
    }
    increment(action) {
        var target = _.get(this, action.path)
        var cost = target.increment(this.points)
        if (cost != false) {
            this.points -= cost
        }
    }
    decrement(action) {
        var target = _.get(this, action.path)
        var cost = target.decrement(this.points)
        if (cost != false) {
            this.points -= cost
        }
    }
    boost(background) {
        this.scores[background.code()].boostify()
    }
    deboost(background) {
        this.scores[background.code()] = new AbilityScore(this.background.code(), this.scores[background.code()].value)
    }
    displayAllocate(update) {
        function Stats({ stats, update }) {
            return (
                <div>
                    <DC item={{ label: 'Remaining', value: stats.points }} />
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, auto)'
                    }}>
                        {Object.keys(stats.scores).map(code => stats.scores[code].display(update))}
                    </div>
                </div>
            )
        }
        return <Stats stats={this} update={update} />

    }
    display({ skills }) {
        function WithSkills({ stats, skills }) {
            const theme = useTheme()
            var grouped = skills.by_attribute()
            Object.keys(grouped).forEach((code) => {
                grouped[code].bonus = stats.scores[code].value
            })
            return (
                <Block header={'Stats'}>
                    {Object.keys(grouped).map(code =>
                    <div>
                        <LabeledItem label={code}>
                            <Bonus item={{ value: grouped[code].bonus, label: code, id: code }} />
                        </LabeledItem>
                        <div className={css`
                            border:${theme.border};
                            margin:5px;
                            `}>
                            <OptionList>
                                {grouped[code].map(c => c.display({handler:null, inCreation:false}))}
                            </OptionList>
                        </div>
                    </div>)}
                </Block>)}
        return (<WithSkills stats={this} skills={skills} />)
    }
}


class AbilityScore {
    [immerable] = true
    constructor(code, value = -2) {
        this.code = code
        this.value = value
        this.max = 4
        this.min = -2
    }
    static parse(ob) {
        var self = new AbilityScore(ob.code)
        Object.assign(self, ob)
        if (self.max == 5) {
            self.cost = function (value = this.value) {
                var mapping = {
                    '-1': 0,
                    '0': 1,
                    '1': 2,
                    '2': 3,
                    '3': 5,
                    '4': 8,
                    '5': 12
                }
                return mapping[value]
            }
        }

        return self
    }
    cost(value = this.value) {
        var mapping = {
            "-2": 0,
            "-1": 1,
            "0": 2,
            "1": 3,
            "2": 5,
            "3": 8,
            "4": 12
        }
        return mapping[value]
    }
    affordable(points, cost) {
        if (points - cost > -1 || points - cost > 29) {
            return true
        }
        else {
            return false
        }
    }
    boostify() {
        this.max = 5
        this.min = -1
        this.value += 1
        this.cost = function (value = this.value) {
            var mapping = {
                '-1': 0,
                '0': 1,
                '1': 2,
                '2': 3,
                '3': 5,
                '4': 8,
                '5': 12
            }
            return mapping[value]
        }
    }
    increment(points) {
        if (this.value < this.max) {
            var net_cost = Math.abs(this.cost() - this.cost(this.value + 1))
            if (this.affordable(points, net_cost)) {
                this.value += 1
                return net_cost
            }
        }
        return false

    }
    bonus(skill, pb) {
        if (skill.proficient) {
            skill.bonus = this.value + pb
        }
        else {
            skill.bonus = this.value
        }
    }
    decrement(points) {
        if (this.value > this.min) {
            var net_cost = -1 * Math.abs(this.cost() - this.cost(this.value - 1))
            if (this.affordable(points, net_cost)) {
                this.value -= 1
                return net_cost
            }
        }
        return false
    }
    display(handler) {
        function Stat({ label, value, handler }) {
            return (
                <LabeledItem label={label}>
                    <Counter item={{ label: label, value: value, path: `scores.${label}` }} update={handler} />
                </LabeledItem>
            )
        }
        return <Stat label={this.code} value={this.value} handler={handler} />
    }

}