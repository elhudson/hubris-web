import { Feature } from "./feature.js";
import { SkillArray } from "./structures.js";
export class Ruleset extends Object {
  constructor(data) {
    super(data);
    Object.assign(this, data);
    Object.keys(this).forEach(table => {
      this[table] = new Rules(this[table]);
    });
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
      skill_codes: ['str', 'dex', 'con', 'int', 'wis', 'cha']
    };
  }
  static async load() {
    var request = await fetch('/static/ruleset.json');
    var data = await request.json();
    var ruleset = new Ruleset(data);
    return ruleset;
  }
}
export class Rules {
  constructor(data) {
    Object.keys(data).forEach(key => {
      this[key] = Feature.parse(data[key]);
    });
  }
  list() {
    return Array.from(Object.values(this));
  }
  ids() {
    return Array.from(Object.keys(this));
  }
}