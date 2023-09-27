import { Item, LabeledItem } from "@elements/containers"

import Entry from "@models/entry"
import { Icon } from "@elements/images"
import { Menu } from "@elements/interactive"
import { MenuItem } from "@mui/base"
import React, { createContext, useCallback, useContext } from "react"
import _ from "lodash"
import { css } from "@emotion/css"
import { views, Filters, Sorters, Groupers, sectionContext } from "@models/filters"
import { current, immerable, isDraft } from "immer"
import { useTheme } from "@emotion/react"


export const viewContext=createContext(null)

function BinControls({ fxs, options, current }) {
    return (
        <Menu icon={
            <Icon name={'ui/toggles'} size={30} />
        }>
            <sectionContext.Provider value={{
                loc: options.table,
                path: options.path,
                possible: options.options
            }}>
                <viewContext.Provider value={current}>
                    <Filters filterer={fxs.filterer} />
                </viewContext.Provider>
                {/* <Groupers grouper={fxs.binner} />
                <Sorters sorter={fxs.sorter} /> */}
            </sectionContext.Provider>
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
        console.log(asOption)
        var func = asOption ? 'displayOption' : 'displayFeature'
        function Bin({ data, label, handler = null }) {
            return (
                <BinFrame label={label}>
                    {data.map(f => f[func]({ handler: handler }))}
                </BinFrame>
            )
        }
        return (this.length > 0 || this.filter(f => f.visible == true).length > 0) ?
            <Bin data={this.filter(f => f.visible == true)} label={label} handler={handler} /> :
            <></>
    }
}

export function BinLabel({ text }) {
    const theme = useTheme()
    return (
        <>
            {(text != "" && text != 'None') && <div className={css`
                border-bottom:${theme.border};
                text-transform:uppercase;
                font-weight:bold;
                margin:5px;
                display:flex;
                div {
                    margin:0px;
                }
                svg {
                    margin-right:10px;
                }
            `}>
                {text}
            </div>}
        </>
    )
}


export function BinFrame({ label, children }) {
    const theme = useTheme()
    return (
        <details open={true} className={css`
            border:${theme.border};
            [open] {
                    div {
                        border-bottom:unset;
                    }
                }
        `}>
            <summary className={css`
                display:inline;
                :hover {
                    cursor:pointer;
                }
            `}>
                <BinLabel text={label} />
            </summary>
            <div className={css`
                display:flex;
                flex-wrap:wrap;
                >div {
                    height: auto;
                }
            `}>
                {children}
            </div>
        </details>
    )
}

export default class Groups {
    [immerable] = true
    constructor(aray, possessions = null) {
        this.by = ''
        this.filtered = {}
        this.sorted = ''
        this.content = { [this.by]: new Bin(aray) }
        aray.length > 0 && (this.apply_filters())
        possessions != null && (this.owned(possessions))

    }
    apply_filters() {
        var tabl = this.content[this.by][0].table
        this.regroup(views[tabl].group)
        this.sort(views[tabl].sort)
        this.filterBy(views[tabl].filter)
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
        var self = new this(items)
        self.regroup(by)
        return self
    }
    forEach(func) {
        for (var o of this) {
            func(o)
        }
    }
    map(func) {
        var ls=[]
        for (var o of this) {
            ls.push(func(o))
        }
        return ls
    }
    filter(func) {
        var ls = []
        for (var o of this) {
            if (func(o) == true) {
                ls.push(o)
            }
        }
        return ls
    }
    filterBy(obj) {
        if (Object.keys(obj).length > 0) {
            var attr = Object.entries(obj)[0][0]
            var value = Object.entries(obj)[0][1]
            if (isNaN(value)==false) {
                value=Number(value)
            }
            this.filtered = { 
                ...this.filtered,
                [attr]: value 
            }
            this.forEach((item) => {
                item.visible=item.matches(this.filtered)
            })
           
        }
    }
    remove(feature) {
        if (feature.required == false) {
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
        return [...new Set(this.pool().map(t => t[attr]))]
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
        return this.pool().length > 0
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
        const chosen = {
            filter: this.filtered,
            sorter: this.sorted,
            grouper: this.by
        }
        if (options != undefined) {
            return (
                <viewContext.Provider value={chosen}>
                    <BinControls
                        fxs={{
                            binner: binner,
                            filterer: filterer,
                            sorter: sorter
                        }}
                        options={options}
                        current={chosen}
                    />
                </viewContext.Provider>
            )

        }

        else {
            return null
        }
    }
    display({ handler = null, asOption = true }) {
        return(<Bins bins={this} handler={handler} asOption={asOption}/>)
    }
}

export function Bins({ bins, handler, asOption}) {
    return (
        <div className={css`
            >* {
                margin:5px;
            }
        `}>
            {Object.keys(bins.content).map(by => bins.content[by].display({ label: by, handler: handler, asOption: asOption }))}
        </div>)
}

export class Effects extends Groups {
    constructor(data) {
        super(data)
    }
}

export class Ranges extends Groups {
    constructor(data) {
        super(data)
    }
}

export class Durations extends Groups {
    constructor(data) {
        super(data)
    }
}