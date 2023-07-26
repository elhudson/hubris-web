import React from "react"
import { Icon } from "../utils"
import { repeat } from "lodash"
import { Option } from "./option"
import { Feature } from "./feature"

export function Category({ title = null, bins, binner, handler=null }) {
    return (
        <div class='category'>
            <h1>{title}</h1>
            <div class='warehouse'>
                <Bins bins={bins} binner={binner} handler={handler} />
            </div>
        </div>)
}

function BinButtons({ bins, handler}) {
    var fl = Object.keys(bins.content).flatMap(k => bins.content[k])
    var loc = fl.flat(10)[0].table
    var possible = [...new Set(fl.flatMap(f => props(f)))].filter(f => ruleset.reference.grouping.includes(f))
    function props(obj) {
        return Object.keys(obj)
    }
    return (
        <div className='group-buttons'>
            <button onClick={handler} location={loc} value={''} aria-selected={'' == bins.by}>None</button>
            {possible.map(l => <button location={loc} onClick={handler} value={l} aria-selected={l == bins.by}>{l.replace('_', ' ')}</button>)}
        </div>
    )
}


function Bins({ bins, binner, handler=null}) {
    function styles(bins) {
        var columns, rows;
        var categories = Object.keys(bins.content).length
        if (categories > 4) {
            columns = Math.floor(categories / 4)
            rows = categories / columns
        } else {
            columns = categories
            rows = 1
        }
        var width = 100 / columns
        var height = 100 / rows
        var grid = {
            display: 'grid',
            gridTemplateColumns: repeat(`${width}%`, columns),
            gridTemplateRows: repeat(`${height}`, rows)
        }
        return grid
    }
    return (
        <>
            <div className='controls'>
                <Icon name='group' />
                <BinButtons bins={bins} handler={binner} />
            </div>
            <div class='groups' style={styles(bins)}>
                {Object.keys(bins.content).map(bin => <Bin label={bin} data={bins.content[bin]} handler={handler} />)}
            </div>
        </>
    )
}


function Bin({ data, label, handler=null }) {
    var content
    if (handler!=null) {
        content = data.map(f => <Option bought={f.bought} option={f} handler={handler} buyable={true} />)
    }
    else {
        content = data.map(f => <Feature feature={f} />)
    }
    return (
        <div class='group'>
            <h1>{label}</h1>
            <div class='item-list'>
                {content}
            </div>
        </div>
    )

}