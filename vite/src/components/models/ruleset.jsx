import Entry from '@models/entry';

export default class Ruleset extends Object {
    constructor(data) {
        super(data);
        Object.assign(this, data)
        Object.keys(this).forEach((table) => {
            this[table]=new Rules(this[table]) 
        })
        this.reference = {
            has_ancestry: ['class_features', 'tag_features', 'effects', 'ranges', 'durations'],
            metadata: ['ranges', 'durations'],
            base_hit_die_cost: {
                "Wizard": 3,
                "Elementalist": 3,
                "Beguiler": 3,
                "Rogue": 2,
                "Priest": 2,
                "Barbarian": 1,
                "Knight": 1,
                "Sharpshooter": 1,
                "Fighter": 1
            },
            hd: ['d2', 'd3', 'd4', 'd6', '2d4'],
            alignments: {
                lg: 'Lawful Good',
                ng: 'Neutral Good',
                cg: 'Chaotic Good',
                ln: 'Lawful Neutral',
                tn: 'True Neutral',
                cn: 'Chaotic Neutral',
                le: 'Lawful Evil',
                ne: 'Neutral Evil',
                ce: 'Chaotic Evil'
            },
            injuries: {
                blinded: 'Blinded',
                advAgainst: 'Advantage on attacks against you',
                uninjured: 'No active injury'
            },
            skill_codes:['str','dex','con','int','wis','cha'],
            armors:['Light', 'Medium','Heavy'],
            point_costs: {
                "-2": 0,
                "-1": 1,
                "0": 2,
                "1": 3,
                "2": 5,
                "3": 8,
                "4": 12
            },
            grouping:['tags','xp','tree','power','range','duration','class_paths', 'weapon_proficiencies', 'armor_proficiencies', 'hit_die'],
            bins:{
                classes:['weapon_proficiencies', 'armor_proficiencies', 'hit_die'],
                backgrounds:['skills', 'attributes'],
                tag_features:['tags', 'xp'],
                class_features:['class_paths', 'xp'],
                effects:['power', 'xp', 'tree', 'tags'],
                ranges:['power', 'xp', 'tree'],
                durations:['power', 'xp', 'tree']
            }
        }
    }
    condition(url, character) {
        console.log(url)
        const conditions = {
            class:(character) => {return character.classes.base!=null},
            backgrounds:(character)=>{return character.backgrounds.primary!=null && character.backgrounds.secondary!=null},
            stats:(character)=>{return character.stats.points==0},
            skills:(character)=>{return ((2+character.stats.scores.int.value)-character.skills.filter(f=>f.proficient==true).length)<1},
            bio:(character)=>{return true}
        }
        return conditions[url](character)
    }
    static async load() {
        var data=JSON.parse(localStorage.getItem('HUBRIS-ruleset'))
        if (data==null || data==undefined) {
            var request = await fetch('/rules');
            data = await request.json()
        }
        var ruleset = new Ruleset(data);
        window.ruleset=ruleset;
        localStorage.setItem('HUBRIS-ruleset', JSON.stringify(ruleset))
        return ruleset
    }
}

export class Rules {
    constructor(data) {
        data=Object.fromEntries(Object.entries(data).filter(f=>f[0]!='table'))
        this.table=Object.entries(data)[0][1].table
        Object.keys(data).forEach((key)=> {
            this[key]=Entry.parse(data[key])
        })
    }
    list() {
        return Array.from(Object.values(this)).slice(1)
    }
    ids() {
        return Array.from(Object.keys(this))
    }
}