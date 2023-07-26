import { immerable, current } from "immer"
import _ from "lodash"

export class Choices {
    [immerable] = true
    constructor(character, url) {
        url == 'xp' && Object.assign(this, character.buyable())
        url == 'class' && Object.assign(this, { 'classes': new Groups(ruleset.classes.list()) })
        url == 'backgrounds' && Object.assign(this, { 'backgrounds': new Groups(ruleset.backgrounds.list()) })
    }
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
    clone_branch(feature) {
        var branch = this.get_branch(feature)
        return _.cloneDeep(branch)
    }
    dequal(char, feature) {
        var branch = this.get_branch(feature)
        this.content[this.find_branch(feature)] = branch.filter(b => b.addable(char) || char.has(b))
    }
    enqueue(feature) {
        if (feature!=undefined) {
        var branch = this.get_branch(feature)
        if (this.pool().map(p=>p.id).includes(feature.id)==false) {
            branch.push(feature)
        }
    }
    }
    dequeue(feature) {
        var branch = this.get_branch(feature)
        _.remove(branch, f => f.id == feature.id)
    }
    qual(char, feature) {
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
    get(feature) {
        var coordinates = this.coordinates(feature)
        return this.content[coordinates.branch][coordinates.index]
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