import { Ruleset, Rules } from '../rules/ruleset.js'
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client'
import { Character, useCharacter } from '../rules/character.js'
import { useImmer, useImmerReducer } from 'use-immer'
import { current, immerable } from 'immer';
import { Option, Entry, Checkbox } from '../rules/feature.js'
import { NextPage, Counter, Icon, DC } from '../utils.js';
import { FeatureArray } from '../rules/structures.js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import '../styles/pages/creation.scss';
import _, { repeat } from 'lodash';
import { ReactSVG } from 'react-svg';

await Ruleset.load();

const root = createRoot(document.getElementById('content'))

var id = document.querySelector('body').getAttribute('data-id')
var ch = Character.create(id)
if (sessionStorage.getItem(id) != null) {
    var data = JSON.parse(sessionStorage.getItem(id))
    ch = Character.parse(data)
}
var url = window.location.pathname.split('/')[1]
root.render(<CreationPage url={url} ch={ch} />)

function CreationPage({ url, ch }) {
    if (url == 'xp') {
        ch.class_tags()
    }
    const [char, dispatchChanges] = useCharacter(ch)
    function handleAddDrop(e) {
        var which;
        if (e.target.checked == true) {
            which = 'add'
        }
        if (e.target.checked == false) {
            which = 'drop'
        }
        dispatchChanges({
            type: which,
            target: e.target.getAttribute('location').replace(' ', '_'),
            id: e.target.id,
            cost: e.target.getAttribute('cost')
        })
        if (e.target.getAttribute('location') == 'effects') {
            return {
                ranges: ruleset.effects[e.target.id].range,
                durations: ruleset.effects[e.target.id].duration
            }
        }
    }
    if (url!='stats') {
        return <Choices table={url} ch={char} handler={handleAddDrop} />
    }
}

function SinglePage({ bins, binner, handler }) {
    var tabl=Object.values(bins)[0]
    return <Options bins={tabl} binner={binner} handler={handler} />
}

function TabbedPage({ data, handler, bin = null }) {
    return (<Tabs>
        <TabList>
            {Object.keys(data).map(k => <Tab>{k.replace('_', ' ')}</Tab>)}
        </TabList>
        {Object.values(data).map(v => <TabPanel>
            <Options bins={v} binner={bin} handler={handler} />
        </TabPanel>)}
    </Tabs>)
}

function Choices({ table, ch, handler }) {
    var options, next;
    switch (table) {
        case 'class': {
            options = {classes:new Groups(ruleset.classes.list())}
            next = 'backgrounds'
            break
        }
        case 'backgrounds': {
            options={backgrounds:new Groups(ruleset.backgrounds.list())}
            next = 'stats'
            break
        }
        case 'xp': {
            options=ch.buyable()
            next = 'fluff'
            break
        }
    }
    const [choices, dispatch] = useImmerReducer(dispatcher, options)
    function dispatcher(draft, action) {
        var meta = action.meta
        function add(draft, action, ch) {
            var feature = featurify(action)
            draft[feature.table]==undefined && (draft[feature.table]=[])
            index(draft, feature) == -1 && draft[feature.table].push(feature)
            draft[feature.table][index(draft, feature)].bought = true
            draft[feature.table].push(...children(feature, draft, ch))
        }
        function featurify(action) {
            var f;
            Object.hasOwn(action, 'table') ? f = 'table' : f = 'location'
            return ruleset[action[f]][action.id]
        }
        function remove(draft, action, ch) {
            var feature = featurify(action)
            if (feature.removeable(ch)) {
                draft[feature.table].content[draft.by][index(draft, feature)].bought = false
                draft[feature.table].content[draft.by] = draft[feature.table].filter(f => (f.qualifies(ch) || ch.has(f)))
            }
        }
        function index(draft, feature) {
            var index = draft[feature.table].findIndex(f => f.id == feature.id)
            return index
        }
        function children(feature, draft, ch) {
            var children = feature.children()
                .filter(child => child.qualifies(ch))
                .filter(child => draft[feature.table].includes(child) == false)
            return children
        }
        function metadata(meta, plus, ch) {
            var func;
            plus ? func = add : func = remove
            Object.keys(meta).forEach((table) => {
                meta[table].check = true
                func(draft, meta[table], ch)
            })
        }
        if (action.type == 'add') {
            add(draft, action, ch)
            meta != undefined && (metadata(meta, true, char))

        }
        if (action.type == 'drop') {
            remove(draft, action, ch)
            meta != undefined && (metadata(meta, false, char))
        }
        if (action.type == 'group') {
            draft[action.location].regroup(action.value)
        }
    }
    function handleSelection(e) {
        var meta = handler(e)
        var which;
        e.target.checked ? which = 'add' : which = 'drop'
        dispatch({
            type: which,
            id: e.target.id,
            check: e.target.check,
            location: e.target.getAttribute('location'),
            meta: meta
        })
    }
    function handleBin(e) {
        dispatch({
            type: 'group',
            location: e.target.getAttribute('location'),
            value: e.target.value
        })
    }
    if (Object.keys(options).length>1) {
        return (<TabbedPage data={choices} bin={handleBin} handler={handleSelection} />)
    }
    else {
        return (<SinglePage bins={choices} binner={handleBin} handler={handleSelection} />)
    }
}

function Options({ title = null, bins, binner, handler }) {
    return (
        <div class='category'>
            <h1>{title}</h1>
            <div class='options'>
                <Bins bins={bins} binner={binner} handler={handler} />
            </div>
        </div>)
}

function BinButtons({ bins, handler }) {
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

export class Groups {
    [immerable] = true
    constructor(aray) {
        this.by = ''
        this.content = { [this.by]: aray }
    }
    *[Symbol.iterator]() {
        var list = Object.values(this.content)
        var fl = list.flat(10)
        for (var i = 0; i < fl.length; i++) {
            yield fl[i]
        }
    }
    forEach(func) {
        for (var o of this) {
            func(o)
        }
    }
    pool() {
        var pool = []
        this.forEach((f) => { pool.push(f) })
        pool = _.uniqBy(pool, 'id')
        return pool
    }
    regroup(prop) {
        var pool = this.pool()
        if (prop == '') {
            this.by = ''
            this.content = { '': pool }
        }
        else {
            var groups = new Object()
            var keys = [...new Set([...new Set(pool.map(s => s.get(prop)))].flat(10))]
            keys.forEach((k) => {
                groups[k] = []
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
}

function Bins({ bins, binner, handler }) {
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
                {Object.keys(bins.content).map(bin => <Bin label={bin} features={bins.content[bin]} handler={handler} />)}
            </div>
        </>
    )
}

function Bin({ label, features, handler }) {
    return (
        <div class='group'>
            <h1>{label}</h1>
            {features.map(f => <Option option={f} handler={handler} buyable={true} />)}
        </div>
    )

}

function AbilityScores({ dispatchChanges, char }) {
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
            <DC item={stat} />
            <div class='stats'>
                {data.map(d => <Counter limiter={char.ability_scores.points} item={d} boosted={boosts.includes(d.code)} update={updateScore} costs={ruleset.reference.point_costs} />)}
            </div>
        </>
    )
}



