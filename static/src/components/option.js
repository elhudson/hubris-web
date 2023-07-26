import { Feature } from "./feature"
import React from "react"

export function Option({ option, handler, bought }) {
    var checkbox=<Checkbox feature={option} bought={bought} handler={handler} cost={option.xp} />
    return <Feature feature={option} check={checkbox} />
}

export function Checkbox({ feature, bought, handler, cost }) {
    return (<input type='checkbox' cost={cost} checked={bought} location={feature.table} onChange={handler} id={feature.id}></input>)
}