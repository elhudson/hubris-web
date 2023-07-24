import { Entry, Feature } from "./feature.js";
import React from 'react';
import { SkillArray } from "./structures.js";

export class Ruleset extends Object {
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
            possible_props:['ticks','desc','power','xp','tags','tree','description'],
            point_costs: {
                "-2": 0,
                "-1": 1,
                "0": 2,
                "1": 3,
                "2": 5,
                "3": 8,
                "4": 12
            },
            grouping:['tags','xp','tree','power','range','duration','class_paths', 'weapon_proficiencies', 'armor_proficiencies', 'hit_die']
        }
    }
    condition(url, character) {
        const conditions = {
            class:(character) => {return character.classes.length==1},
            backgrounds:(character)=>{return character.backgrounds.length==2},
            stats:(character)=>{return character.ability_scores.points==0},
            xp:(character)=> {return true}
        }
        return conditions[url](character)
    }
    static async load() {
        var data=JSON.parse(localStorage.getItem('HUBRIS-ruleset'))
        if (data==null) {
            var request = await fetch('/static/ruleset.json')
            data = await request.json()
        }
        var ruleset = new Ruleset(data);
        window.ruleset=ruleset;
        localStorage.setItem('HUBRIS-ruleset', JSON.stringify(ruleset))
        return ruleset
    }
}

export class RulesLookup {
    constructor(data) {
        var tester=Object.values(data)[0]
        this.left=Object.keys(tester)[0]
        this.right=Object.keys(tester)[1]
        this.corr=new Array()
        Object.values(data).forEach((val)=> {
            val=Object.values(val)
            var left=Entry.parse(val[0])
            val[1].forEach((c)=> {
                var pair={
                    [this.left]:left,
                    [this.right]:Entry.parse(c)
                }
                this.corr.push(pair)
            })
        })
    }
    match(id, target, table) {
        var matches= this.corr.filter(i=>i[table].id==id)
        var result=matches.map(match=>match[target])
        return result
    }
}

export class Rules {
    constructor(data) {
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
    display() {
        var data=this.list()
        return (<RRules data={data} />)}
}

function RRules({data}) {
    return(
    <div className='ruleset'>
        {data.map(d=><Feature label={d.name} feature={d} />)}
    </div>)}



