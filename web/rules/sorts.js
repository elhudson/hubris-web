import { immerable, current } from "immer"
import _ from "lodash"
import { Block, LabeledItem } from "hubris-components/containers"
import React from "react"
import { Controls, Button } from "hubris-components/interactive"
import {style, styles} from 'hubris-components/styles'
import { Armory, Arsenal } from "../models/character/sections/combat"
import Entry from "../elements/feature"

export class Choices {
    [immerable] = true
    constructor(character=null, url=null) {
        if (url == 'xp') {
            var buyable=character.buyable()
            this.features=Choices.from(buyable.features)
            this.powers=Choices.from(buyable.powers)
            this.powers.metadata=Choices.from(buyable.powers.metadata)    
        }
        url == 'class' && Object.assign(this, { 'classes': new Groups(ruleset.classes.list()) })
        url == 'backgrounds' && Object.assign(this, { 'backgrounds': new Groups(ruleset.backgrounds.list()) })
    }
    regroup(action) {
        _.get(this, action.path).regroup(action.data.value)
    }
    static from(obj) {
        var self=new Choices()
        Object.assign(self, obj)
        return self
    }
    edits(ch, obj) {
        var mapping={
            classes:function() {
                ch.health.hd.die=obj.hit_die
            },
            backgrounds:function() {
                ch.stats.boosts(ch.backgrounds)
                ch.skills.auto(ch.backgrounds)
            }
        }
           mapping[obj.table]()
    }
    addDrop(action, ch, free=false) {
        var feature=ruleset[action.table][action.data.value].clone()
        free && (feature.xp=0)
        if ((action.data.checked==true && feature.qualifies(ch)) || (action.data.checked==false && feature.removeable(ch))) {
            var tree=_.get(this, action.path)
            var func=action.data.checked ? 'add':'remove'
            var cost=_.get(ch, action.path)[func](feature, action.context)
            cost!=null && (ch.progression.xp.spent+=cost)
            action.table=='effects' && (this.handleMetadata(feature, func, ch))
            tree.get(ruleset[action.table][action.data.value]).bought=action.data.checked
            tree.forEach((item)=> {
                if (item.qualifies(ch) || item.bought==true) {
                    item.buyable=true
                    if (item.removeable(ch)==false || item.xp==0) {
                        item.buyable=false
                    }
                }
                else {
                    item.buyable=false
                }
            })
        }
    }
    handleMetadata(feature, act, ch) {
        const synthAction=(feature, act)=> {
            return({
                path:`powers.metadata.${feature.table}`,
                parent:'options',
                table:`${feature.table}`,
                data:{
                    value:feature.id,
                    checked:act=='add' ? true:false
                }
            })
        }
        var range=synthAction(feature.range, act)
        var duration=synthAction(feature.duration, act)
        this.addDrop(range, ch, true)
        this.addDrop(duration, ch, true)
    }
    display({binner, handler}) {
        return(
            <div>
            {Object.keys(this).map(key=>
                this[key].display({binner:binner, handler:handler}))}
            </div>
        )
    }
}

export class Groups {
    [immerable] = true
    constructor(aray) {
        this.by = ''
        this.content = { [this.by]: new Bin(aray) }
        this.defaults={class_features:'class_paths', tag_features:'tags', effects:'tree', ranges:'tree', durations:'tree'}
        try {
            this.regroup(this.defaults[aray[0].table])
        }
        catch {
            {Error}
        }
    }
    *[Symbol.iterator]() {
        var list = Object.values(this.content)
        var fl = list.flat(10)
        for (var i = 0; i < fl.length; i++) {
            yield fl[i]
        }
    }
    static parse(data) {
        var by=data.by
        var items=Object.values(data.content).flat(2)
        for (var i=0;i<items.length;i++) {
            items[i]=Entry.parse(items[i])
        }
        var self=new Groups(items)
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
            if (func(o)==true) {
                return o
            }
        }
    }
    clone_branch(feature) {
        var branch = this.get_branch(feature)
        return _.cloneDeep(branch)
    }
    dequal(char, feature) {
        var branch = this.get_branch(feature)
        this.content[this.find_branch(feature)] = branch.filter(b => b.addable(char) || char.has(b))
    }
    add(feature) {
        var branch = this.get_branch(feature)
        branch.push(feature)
        return feature.xp
    }
    remove(feature) {
        var branch = this.get_branch(feature)
        _.remove(branch, f => f.id == feature.id)
        return(-1*feature.xp)
    }
    qual(feature) {
        if (feature.descendable) {
            feature.children().forEach((child) => {
                this.enqueue(child)
            })
        }
    }
    get_branch(feature) {
        var branch = this.find_branch(feature)
        return this.content[branch]
    }
    find_branch(feature) {
        var location = feature.get(this.by)
        location == 'None' && (location = "")
        return location
    }
    find_index(feature) {
        var branch = this.find_branch(feature)
        var index = this.content[branch].findIndex(f => f.id == feature.id)
        return index
    }
    coordinates(feature) {
        var branch = this.find_branch(feature)
        var index = this.find_index(feature)
        if (index == -1) {
            this.enqueue(feature)
            index = this.find_index(feature)
        }
        return { branch: branch, index: index }
    }
    pool() {
        var pool = []
        this.forEach((f) => { pool.push(f) })
        pool = _.uniqBy(pool, 'id')
        return pool
    }
    includes(feature) {
        return _.find(this.pool(), item=>item.id==feature.id)==undefined ? false : true
    }
    get(feature) {
        var coordinates = this.coordinates(feature)
        return this.content[coordinates.branch][coordinates.index]
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
    display({binner, handler=null, asOption=true}) {
        function Bins({bins, binner, handler=null}) {
            var pool=bins.pool()
            if (pool.length>0) {
                var loc=pool[0].table
                var path=pool[0].path
            var possible = [...new Set(pool.flatMap(f => props(f)))].filter(f => ruleset.reference.bins[loc].includes(f))
            function props(obj) {
                return Object.keys(obj)
            }
            var cols=Object.keys(bins.content).length
            cols>4 && (cols=4)
            const display=style('bins', {
                display:'grid',
                gridTemplateColumns:`repeat(${cols}, auto)`

            })
            return (
                <> 
                    <Controls icon={'group'}>
                        <Button onClick={binner} table={loc} path={path} value={''} aria-selected={'' == bins.by}>None</Button>
                        {possible.map(l => <Button table={loc} path={path} onClick={binner} value={l} aria-selected={l == bins.by}>{l.replace('_', ' ')}</Button>)}
                    </Controls>
                    <div className={display}>
                        {Object.keys(bins.content).map(by => bins.content[by].display({label:by, handler:handler, asOption:asOption}))}
                    </div>
                </>
            )
            }
            else {
                return (<></>)
            }
            
        } 
        return <Bins bins={this} binner={binner} handler={handler}/>
    }
}

export class Bin extends Array {
    [immerable]=true
    constructor(data=[]) {
        super(...Array.from(data))
        this.sort('xp')
    }
    sort(by) {
        Object.assign(this, _.sortBy(this, item=>_.get(item, by)))
    }
    display({label, handler=null, asOption}) {
        var func=asOption ? 'displayOption':'displayFeature'
        function Bin({ data, label, handler=null }) {
            return (
                <Block header={label}>
                    { data.map(f => f[func]({handler:handler})) }
                </Block>
            )}
        return (<Bin data={Array.from(this)} label={label} handler={handler} />)
    }
}