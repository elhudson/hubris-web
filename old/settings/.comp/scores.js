import React from "react"
import { Points, Counter } from "./utils.js"

export function AbilityScores({ dispatchChanges, char }) {
    function updateScore(direction, costs, current, code) {
        dispatchChanges({
            direction: direction,
            costs: costs,
            code: code,
            type: 'update-score',
            value: current
        })
    }
    var attrs = ruleset.attributes.list()
    attrs.forEach((a) => { a.code = a.name.slice(0, 3).toLowerCase() })
    var boosts = char.backgrounds.map(b => b.attributes.name.toLowerCase().slice(0, 3))
    var data = attrs.map(a => new Object({ value: char.ability_scores[a.code], code: a.code, label: a.name, id: a.id, max: 4, min: -2, readonly: false }))
    var stat = { value: char.ability_scores.points, readonly: true, label: 'Points' }
    return (
        <>
            <Points item={stat} />
            <div class='stats'>
                {data.map(d => <Counter limiter={char.ability_scores.points} item={d} boosted={boosts.includes(d.code)} update={updateScore} costs={ruleset.reference.point_costs} />)}
            </div>
        </>
    )
}

