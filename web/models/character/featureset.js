import { immerable } from "immer"
import _ from "lodash"
import { Item, LabeledItem } from "../../components/components/containers"
import React from "react"
import Entry from "../../elements/entry"
import { css } from "@emotion/css"
import { Menu } from "../../components/components/interactive"
import { useTheme } from "@emotion/react"
import { MenuItem } from "@mui/base"
import { Icon } from "../../components/components/images"
import { fs } from "../../elements/filters"

export class Groups {
    [immerable] = true
    constructor(aray, possessions = null) {
        this.by = ''
        this.filtered = { '': '' }
        this.sorted = ''
        this.content = { [this.by]: new Bin(aray) }
        aray.length > 0 && (this.apply_filters())
        possessions != null && (this.owned(possessions))

    }
    apply_filters() {
        var tabl = this.content[this.by][0].table
        this.regroup(fs[tabl].group)
        this.sort(fs[tabl].sort)
        this.filterBy(fs[tabl].filter)
    }
    *[Symbol.iterator]() {
        var list = Object.values(this.content)
        var fl = list.flat(10)
        for (var i = 0; i < fl.length; i++) {
            yield fl[i]
        }
    }
    owned(group) {
        this.forEach((item) => {
            if (group.includes(item)) {
                item.bought = true
            }
        })
    }
    static parse(data) {
        var by = data.by
        by == 'None' && (by = '')
        var items = Object.values(data.content).flat(2)
        if (items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                items[i] = Entry.parse(items[i])
            }
        }
        var self=new this(items)
        self.regroup(by)
        return self
    }
    forEach(func) {
        for (var o of this) {
            func(o)
        }
    }
    map(func) {
        for (var o of this) {
            return func(o)
        }
    }
    filter(func) {
        for (var o of this) {
            if (func(o) == true) {
                return o
            }
        }
    }
    filterBy(obj) {
        if (Object.keys(obj).length > 0) {
            var attr = Object.entries(obj)[0][0]
            var value = Object.entries(obj)[0][1]
            this.forEach((item) => {
                item.visible = (item.get(attr) == value)
            })
            this.filtered = { [attr]: value }
        }
    }
    remove(feature) {
        if (feature.required==false) {
            _.remove(this.content[this.get_location(feature)], f => f.id == feature.id)
            return (-1 * feature.xp)
        }
    }
    get_location(feature) {
        var location = feature.get(this.by)
        return location
    }
    get(feature) {
        return _.find(this.content[this.get_location(feature)], f => f.id == feature.id)
    }
    get_unique(attr) {
        return [...new Set(this.pool().map(t=>t[attr]))]
    }
    pool() {
        var pool = []
        this.forEach((f) => { pool.push(f) })
        pool = _.uniqBy(pool, 'id')
        return pool
    }
    includes(feature) {
        return _.find(this.pool(), item => item.id == feature.id) == undefined ? false : true
    }
    add(feature) {
        if (feature.buyable) {
            this.content[this.get_location(feature)].push(feature)
            return feature.xp
        }
    }
    sort(by) {
        Object.keys(this.content).forEach((key) => {
            this.content[key] = new Bin(_.sortBy(this.content[key], item => item.get(by)))
        })
    }
    regroup(prop) {
        var pool = this.pool()
        if (prop == '') {
            this.by = ''
            this.content = { '': new Bin(pool) }
        }
        else {
            var groups = new Object()
            var keys = [...new Set([...new Set(pool.map(s => s.get(prop)))].flat(10))]
            keys.forEach((k) => {
                groups[k] = new Bin()
            })
            pool.forEach((item) => {
                var ct = item.get(prop)
                if (Array.isArray(ct)) {
                    ct.forEach((c) => {
                        groups[c].push(item)
                    })
                }
                else {
                    groups[ct].push(item)
                }
            })
            this.by = prop
            this.content = groups
        }
    }
    empty() {
        return this.pool().length>0
    }
    get_options() {
        var pool = this.pool()
        if (pool.length > 0) {
            var loc = pool[0].table
            var path = pool[0].path
            var possible = [...new Set(pool.flatMap(f => Object.keys(f)))].filter(f => ruleset.reference.bins[loc].includes(f))
            return ({ table: loc, path: path, options: possible })
        }
    }
    displayMenu({ binner, filterer, sorter }) {
        const options = this.get_options()
        if (options!=undefined) {
        return (<BinControls fxs={{
            binner: binner,
            filterer: filterer,
            sorter: sorter
        }} filterValue={this.filtered} loc={options.table} path={options.path} possible={options.options} />) }
        else {
            return null
        }
    }
    display({ handler = null, asOption = true }) {
        function Bins({ bins, handler }) {
            return (
                <div>
                    {Object.keys(bins.content).map(by => bins.content[by].display({ label: by, handler: handler, asOption: asOption }))}
                </div>)
        }
        return <Bins bins={this} handler={handler} />      
    }
}

function BinControls({ fxs, filterValue, loc, path, possible }) {
    const theme = useTheme()
    return (
        <Menu icon={<Icon name='group' sx={css`
            svg {
                height:20px;
                width:auto;
            }
            
        `} />}>
            <LabeledItem label='Group By'>
                <MenuItem onClick={fxs.binner} slotProps={{ root: { table: loc, path: path, value: "" } }}>None</MenuItem>
                {possible.map(l => <MenuItem onClick={fxs.binner} slotProps={{ root: { table: loc, path: path, value: l } }}>{l.replace('_', ' ')}</MenuItem>)}
            </LabeledItem>
            <LabeledItem label='Filter By' sx={css`
                input[type='radio'] {
                    ${theme.styles.checkbox}
                }
            `}>
                <Item label='Tier'>
                    {[1, 2, 3, 4].map(t => <input type='radio' onChange={fxs.filterer} table={loc} path={path} name='tier' checked={`T${t}` == filterValue.tier} value={`T${t}`} />)}
                </Item>
            </LabeledItem>
            <LabeledItem label='Sort By'>
                <MenuItem onClick={fxs.sorter} slotProps={{ root: { table: loc, path: path, value: 'xp' } }}>XP</MenuItem>
            </LabeledItem>
        </Menu>
    )
}

export class Bin extends Array {
    [immerable] = true
    constructor(data = []) {
        super()
        Object.assign(this, Array.from(data))
    }
    display({ label, handler = null, asOption }) {
        var func = asOption ? 'displayOption' : 'displayFeature'
        function Bin({ data, label, handler = null }) {
            return (
                <div>
                    {label != "" && <h4>{label}</h4>}
                    <div className={css`
                        display:flex;
                        flex-wrap:wrap;
                        >div {
                            height: auto;
                        }
                    `}>
                        {data.map(f => f[func]({ handler: handler }))}
                    </div>
                </div>
            )
        }
        return (this.length > 0 || this.filter(f => f.visible == true).length > 0) ? <Bin data={this.filter(f => f.visible == true)} label={label} handler={handler} /> : <></>
    }
}