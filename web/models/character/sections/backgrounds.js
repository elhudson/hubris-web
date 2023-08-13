import Info from "../section";
import Entry from "../../../elements/feature";

export default class Backgrounds extends Info {
    constructor() {
        var skeleton={
            primary:null,
            secondary:null
        }
        super(skeleton)
    }
    static parse(json) {
        var self=super.parse(json)
        try {
        self.primary=Entry.parse(self.primary)
        self.secondary=Entry.parse(self.secondary)}
        catch {{Error}}
        return self
    }
    includes(id) {
        return this.primary.id==id || this.secondary.id==id
    }
    add(background, character) {
        var available=_.find(Object.keys(this), f=>this[f]==null)
        this[available]=background
        if (this.primary!=null & this.secondary!=null) {
            character.stats.boosts(this)
            character.skills.auto(this)
        }
    }
    remove(background) {
        var occupied=_.find(Object.keys(this), f=>this[f].id==background.id)
        this[occupied]=null
    }
    display() {
        return this.displayFeature()
    }
}