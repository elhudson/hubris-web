import { createContext, useContext } from "react"
import _, { attempt } from 'lodash'
import { LabeledItem } from '@elements/containers'
import { MenuItem, useTab } from "@mui/base"
import { viewContext } from "@models/featureset"
import { css } from "@emotion/css"
import { useTheme } from "@emotion/react"
import icons from '@assets/icons'
import { Icon } from "../elements/images"

import {Label} from '@elements/interactive'

const view_template = (table, filter, sort, group) => {
    return ([table, {
        filter: filter,
        sort: sort,
        group: group
    }]
    )
}

const view_aray = []
const sort = 'xp'
const filter = { 'tier': 1 }

export const sectionContext = createContext(null)

view_aray.push(view_template('class_features', filter, sort, 'class_paths'))
view_aray.push(view_template('classes', {}, 'name', '""'))
view_aray.push(view_template('backgrounds', {}, 'name', 'setting'))
view_aray.push(view_template('tag_features', filter, sort, 'tags'))
view_aray.push(view_template('effects', filter, sort, 'tree'))
view_aray.push(view_template('ranges', filter, sort, 'tree'))
view_aray.push(view_template('durations', filter, sort, 'tree'))

export const views = Object.fromEntries(view_aray)

function generate_option({ attr, values = null, table }) {
    const locs = {
        'class_features': 'features.class_features',
        'tag_features': 'features.tag_features',
        'effects': 'powers.effects',
        'ranges': 'powers.metadata.ranges',
        'durations': 'powers.metadata.ranges'
    }
    const prop_values = {
        tier: [1, 2, 3, 4],
        tags: ruleset.tags.list().map(t => t.name),
        tree: ['Buffs', 'Debuffs', 'Damage', 'Healing']
    }
    values == null && (values = prop_values[attr])
    return values.map(v => new Object({
        name: attr,
        value: v,
        table: table,
        path: locs[table]
    }))
}

function table_filters(table) {
    const generators = {
        tree: (table) => generate_option({ attr: 'tree', table: table }),
        tier: (table) => generate_option({ attr: 'tier', table: table }),
        tags: (table) => generate_option({ attr: 'tags', table: table })
    }
    return (
        table == 'class_features' ? {
            tier: generators.tier(table)
        } :
        table == 'tag_features' ? {
            tier: generators.tier(table),
            tags: generators.tags(table)
        } :
        table == 'effects' ? {
            tier: generators.tier(table),
            tags: generators.tags(table),
            tree: generators.tree(table)
        } :
        table=='ranges' ? {
            tier:generators.tier(table),
            tree: generators.tree(table)
        } :
        table=='durations' ? {
            tier:generators.tier(table),
            tree:generators.tree(table)
        } :
        null
    )
}

export function Filters({ filterer }) {
    const tab = useContext(sectionContext)
    const filters = table_filters(tab.loc)
    return (
        <div className={css`
            display:grid;
            grid-template-columns:min-content auto;
            grid-column-gap:5px;
            max-width:200px;
            padding:5px;
        `}>
            {filters != null &&
                <>
                    {Object.keys(filters).map(filter =>
                        <View
                            type='filter'
                            label={filter}
                            data={filters[filter]}
                            handler={filterer}
                        />
                    )}
                </>}
        </div>

    )
}

function View({ label, type, data, handler }) {
    const theme=useTheme()
    const chosen=useContext(viewContext)[type]
    return (
        <>
            <div className={css`
                font-size:${theme.small+2}px;
                text-transform:uppercase;
                font-weight:bold;
                text-decoration:underline;
            `}>
                {label}
            </div>
            <div className={css`
                display:flex;
                flex-wrap:wrap;
            `}>
                {data.map(d =>
                    <ViewOption 
                        data={d} 
                        handler={handler} 
                        selected={chosen[label]==d.value}
                    />)}
            </div>
        </>
    )
}

function ViewOption({ data, handler, selected=false }) {
    const theme=useTheme();
    return (
        <div className={css`
            font-size:${theme.small}px;
            ${theme.styles.button}
            width:fit-content;
            padding:0px 3px;
            margin:3px;
            position:relative;
            &:hover {
                cursor:pointer;
            }
            &[aria-selected=true] {
                background-color:${theme.muted};
                color: ${theme.background};
            }
        `}
            {...data}
            onClick={handler}
            aria-selected={selected}>
                {['tags', 'tree'].includes(data.name) ? 
                        <Icon
                        path={icons[data.value.toLowerCase()]} 
                        size={14}
                        color={selected ? theme.background : theme.text}
                    />                     
                    : data.value}
        </div>
    )
}

export function Groupers({ grouper }) {
    const select = useContext(sectionContext)
    select.possible.push('')
    return (
        <LabeledItem label='Group By'>
            {select.possible.map(l => <MenuItem onClick={grouper} slotProps={{ root: { table: select.loc, path: select.path, value: l } }}>{l.replace('_', ' ')}</MenuItem>)}
        </LabeledItem>
    )
}

export function Sorters({ sorter }) {
    const select = useContext(sectionContext)
    return (
        <LabeledItem label='Sort By'>
            <MenuItem onClick={sorter} slotProps={{ root: { table: select.loc, path: select.path, value: 'xp' } }}>XP</MenuItem>
        </LabeledItem>
    )
}