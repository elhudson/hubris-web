import { immerable, current } from "immer"
import _ from "lodash"
import React, { useState } from "react"
import { Radio } from "../../components/components/interactive"
import { nanoid } from "nanoid"

export default class Info {
    [immerable]=true
    constructor(skeleton) {
        Object.assign(this, skeleton)
    }
    static parse(raw) {
        var self=new this
        raw!=undefined && (Object.assign(self, raw))
        return self
    }
    set_attribute(character, path, default_value) {
        var data=_.get(character, path)
        if (data==undefined) {
            var loc=path.split('.').slice(1)
            _.set(this, loc, default_value)
        }
    }
    activate(action) {
        var target=_.get(this, action.path)
        target.active=action.data.checked
    }
    update(action) {
        if (action.src=='SELECT') {
            var path=action.path
            _.set(this, path, action.data.selectedOptions[0].value)
        }
        if (action.src=='INPUT' || action.src=='TEXTAREA') {
            var path=action.path
            _.set(this, path, action.data.value)
        }
    }
    increment(action) {
        var val=_.get(this,action.path)
        var max=action.data.getAttribute('max')
        if (val<max) {
            _.set(this, action.path, val+1)
        }
    }
    decrement(action) {
        var val=_.get(this,action.path)
        var min=action.data.getAttribute('min')
        if (val>min) {
            _.set(this, action.path, val-1)
        }
    }
    radioSwitch(action) {
        var target=_.get(this, action.path).list()
        var prev=_.find(target, f=>f.active==true)
        prev.active=false
        var cur=_.find(target, f=>f.value==action.data.defaultValue)
        cur.active=true
    }
    add(action) {
        return ruleset[action.path][action.data.value]
    }
}


export class Item {
    [immerable]=true
    constructor(data=null) {
        Object.assign(this, data)
    }
}


export class RadioArray {
    [immerable]=true
    constructor({keys, values, defaultActive, immutable=null}) {
        for (var i=0; i<keys.length; i++) {
            this[keys[i]]= new Object()
            if (values[i].value==undefined) {
                this[keys[i]].value=values[i]
            }
            else {
                this[keys[i]]=values[i]
            }
            this[keys[i]].active=false
            this[keys[i]].index=i
            keys[i]==defaultActive && (this[keys[i]].active=true)
            keys[i]==immutable && (this[keys[i]].active=true)
        }
    }
    static parse(raw) {
        var defaultActive=_.find(Object.keys(raw), r=>raw[r].active)
        var self=new RadioArray({keys:Object.keys(raw), values:Object.values(raw), defaultActive:defaultActive})
        return self
        
    }
    list() {
        return Object.values(this)
    }
    active() {
        return _.find(this.list(), f=>f.active)
    }
    activate(value) {
        var target=_.find(this.list(), v=>v.value==value)
        target.active=true
        this.list().forEach((val)=> {
            val.value!=value && (val.active==false)
        })
    }
    display({path, group, handler, vert=true}) {
        function RadioArray({aray, path, group, handler}) {
            var uniq_group=group+'_'+nanoid()
            var processed=aray.list().map(item=> 
                new Object({
                    label:item.value,
                    value:item.value,
                    selected:item.active,
                    path:path
                })) 
            return (
                <Radio vertical={vert} label={uniq_group} data={processed} onChange={handler} />
            )
        }
        return(<RadioArray path={path} group={group} handler={handler} aray={this}/>)
    }
   
}