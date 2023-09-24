import Background from "@models/entry";
import Info from "@models/section";
import _ from 'lodash';
export default class Backgrounds extends Info {
    constructor() {
        var skeleton = {
            primary: null,
            secondary: null
        }
        super(skeleton)
    }
    static parse(json) {
        var self = super.parse(json)
        try {
            self.primary = Background.parse(self.primary)
            self.primary.name=ruleset.backgrounds[self.primary.id].name
            self.secondary = Background.parse(self.secondary)
            self.secondary.name=ruleset.backgrounds[self.secondary.id].name    
        }
        catch {Error}
        
        return self
    }
    includes(id) {
        return this.primary.id == id || this.secondary.id == id
    }
    add(background, character) {
        var available = _.find(Object.keys(this), f => this[f] == null)
        this[available] = background
        background.adjust_stats(character, 'add')
        background.adjust_skills(character, 'add')
    }
    remove(background, character) {
        var occupied = _.find(Object.keys(this), f => this[f].id == background.id)
        this[occupied] = null
        background.adjust_stats(character, 'remove')
        background.adjust_skills(character, 'remove')
    }
}