import Info from "../section";

export default class Backgrounds extends Info {
    constructor() {
        var skeleton={
            primary:null,
            secondary:null
        }
        super(skeleton)
    }
    static parse(json) {
        return super.parse('backgrounds', json)
    }
    includes(id) {
        return this.primary.id==id || this.secondary.id==id
    }
    add(background) {
        var available=_.find(Object.keys(this), f=>this[f]==null)
        this[available]=background
    }
    remove(background) {
        var occupied=_.find(Object.keys(this), f=>this[f].id==background.id)
        this[occupied]=null
    }
}