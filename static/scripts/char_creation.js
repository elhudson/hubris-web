class Ruleset {
    constructor(data) {
        Object.assign(this, data)
    }
}
has_ancestry = ['class_features', 'tag_features', 'effects', 'ranges', 'durations']
metadata = ['ranges', 'durations']
base_hit_die_cost = {
    "Wizard": 3,
    "Elementalist": 3,
    "Beguiler": 3,
    "Rogue": 2,
    "Priest": 2,
    "Barbarian": 1,
    "Knight": 1,
    "Sharpshooter": 1,
    "Fighter": 1
}

class Character {
    constructor(data) {
        if (Object.keys(data).includes('str')) {
            this.ability_scores=StatArray.from(data)
        }
        Object.keys(ruleset).filter(item => !item.includes('__')).forEach((key) => {
            if (Object.keys(data).includes(key)) {
                this[key] = new Featureset(data[key])
            }
            else {
                this[key] = new Featureset(0, 'ruleset', key)
            }
        })
        Object.keys(data).filter(item => Object.keys(ruleset).includes(item) == false).forEach((item) => {
            this[item] = data[item]
        })
        this.location = document.getElementsByTagName('meta')[0].baseURI
        this.hit_dice=1
        this.get_tags()
    }
    xp(expend) {
        this.xp_spent += expend
        this.xp_remaining = this.xp_earned - this.xp_spent
        document.getElementById('xp_spent').value = this.xp_spent
    }
    sufficient_xp(xp) {
        if (xp+this.xp_spent<=this.xp_earned && xp+this.xp_spent>=0) {
            return true
        }
        return false
    }
    async status() {
        this.level()
        this.power = await this.power_mod();
        this.armor_class=this.set_ac()
    }
    async power_mod() {
        const power_attr = ruleset.attributes[this.classes[0].relate['attributes']].name
        const pb = Number(this.tier) + 1
        this.power_mod = Number(this[power_attr.toLowerCase().slice(0, 3)]) + pb
        document.getElementById('power_bonus').setAttribute('value', this.power_mod)
    }
    calculate_tier() {
        const tier_cutoffs = {
            "0": 0,
            "1": 30,
            "2": 75,
            "3": 125,
            "4": 200
        }
        for (var tier of Object.keys(tier_cutoffs)) {
            if (this.xp_spent > tier_cutoffs[tier]) {
                return Number(tier)+1
            }
        }
    }
    level() {
        this.tier=this.calculate_tier()
        this.proficiency=this.tier+1
        this.max_hp=3*(this.tier)+this.ability_scores.con
        if (!Object.hasOwn(this,'current_hp')) {
            this.current_hp=this.max_hp
        }
        if (!Object.hasOwn(this,'powers')) {
            this.powers=0
        }
        document.getElementById('powers_used').value=this.powers
        document.getElementById('proficiency_bonus').value=this.proficiency
        document.getElementById('hp_max').value=this.max_hp
        document.getElementById('hp_left').value=this.current_hp
        document.querySelector(`#tier #tier_${this.tier}`).checked=true
    }
    fetch_options() {
        const o = {}
        has_ancestry.forEach((table) => {
            const options = new Featureset(Object.values(ruleset[table])).qualifies_for(this)
            o[table] = options
        })
        this.options = o
        document.getElementById('hd').value=1;
    }
    async render_options() {
        this.fetch_options()
        Object.keys(this.options).forEach(async (table) => {
            var r = await this.options[table].render()
            document.getElementById(table).append(r)
        })
    }
    init_stats() {
        this.stats = new StatArray();
        this.stats.background_boosts(this);
        ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach((item) => {
            this.stats.display(item)
        })
    }
    form() {
        const form = document.getElementById('data')
        const me = JSON.stringify(this)
        form.setAttribute('value', me)
    }
    set_ac() {
        const armor = this.classes[0].armor_proficiencies
        var ac = Number(10 + this.ability_scores.dex)
        if (armor == "Light") {
            ac += this.proficiency
        }
        if (armor == 'Medium') {
            ac = 14 + this.proficiency
        }
        if (armor == 'Heavy') {
            ac = 18 + this.proficiency
        }
        document.getElementById("ac").setAttribute("value", ac)
        return ac
    }
    use_power(dir) {
        if (dir=='+') {
            this.powers+=1
        }
        else if (this.powers>0) {
            this.powers-=1
        }
        document.getElementById('powers_used').value=this.powers
        document.getElementById('power_dc').value=10+this.powers
    }
    hd(direction) {
        if (direction=='add') {
            var cost=base_hit_die_cost[character.classes[0].name]+(this.hit_dice-1)
            if (this.sufficient_xp(cost)) {
                this.hit_dice+=1
                this.xp(cost)
            }
            else {
                alert('XP budget exceeded. Go on adventures to earn some more!')
            }
        }
        else {
            var net=base_hit_die_cost[character.classes[0].name]+(this.hit_dice-2)
            if (this.sufficient_xp(net*-1) && this.hit_dice>1) {
                this.hit_dice-=1
                this.xp(net*-1)
            }
        }
        document.getElementById('hd').value=this.hit_dice
        this.form();
    }
    async add_feature(option) {
        if (option.table=='skills') {
            var search=this.skills.find(s=>s.id==option.id)
            search.proficiency(this)
        }
        else {
            this[option.table].push(option);
            if (option.table=='effects') {
                this.add_feature(option.range)
                this.add_feature(option.duration)
            }
            await option.display_children(this);
        }
    }
    already_owned(feature) {
        const owned = character[feature.table].map(item => item.id)
        if (owned.includes(feature.id)) {
            return true
        }
        else {
            return false
        }
    }
    remove_feature(option) {
        if (option.table=='skills') {
            var search=this.skills.find(s=>s.id==option.id)
            search.proficiency(this)
        }
        else {
            this[option.table] = this[option.table].filter(item => item.id != option.id)
            option.delete_children(this)
        }
    }
    toggle(event, feature, character=null) {
        if (character!=null && feature.table=='skills') {
            feature.cost(character,event)
            // if (event.target.checked==false) {
            //     feature.cost+=1
            // }
        }
        if (event.target.checked) {
            if (this.sufficient_xp(feature.xp)==true) {
                this.add_feature(feature)
                this.xp(feature.xp)
            }
            else {
                alert('XP budget exceeded. Go on adventures to earn some more!')
                event.target.checked=false
          }
        }
        else {
            this.remove_feature(feature)
            this.xp(-1 * feature.xp)
        }
        this.form()
    }
    define_skills() {
        const s=new SkillArray(Object.values(ruleset.skills))
        s.forEach((skill)=> {
            if (this.skills.map(sk=>sk.id).includes(skill.id)) {
                skill.proficient=true
                skill.bonus=this.tier+1+Number(this.ability_scores[skill.code])
            }
            else {
                skill.proficient=false
                skill.bonus=Number(this.ability_scores[skill.code])
            }
        })
        this.skills=s
    }
    async render_skills() {
        this.define_skills();
        const t=await this.skills.render();
        document.getElementById('skills').append(t)
    }
    async render_sheet() {
        await this.render_stats();
        this.tags.forEach((tag)=> {
            const d=$.parseHTML(`<div class='tag'> ${tag.name} </div>`)[0]
            document.getElementById('tags').append(d)
        })
        var s=this.has_set();
        if (s.length>>0) {
            s.forEach(async (table)=> {
                const rend=await this[table].render();
                document.getElementById(table).append(rend)
            })
        }
    }
    async render_stats() {
        var stats=await this.ability_scores.render()
        Object.keys(stats).forEach((stat)=>{
            var assoc_skills=this.skills.filter(skill=>skill.code==stat)
            var p=document.createElement('div')
            assoc_skills.forEach(async (s)=> {
                var r=await s.render();
                p.append(r)
            })
            stats[stat].append(p)
            document.getElementById('stats').append(stats[stat])
        })
    }
    get_tags() {
        var base_tags=ruleset.classes[this.classes[0].id].tags
        base_tags.forEach((t)=> {
            this.tags.push(ruleset.tags[t.id])
        })
    }
    has_set() {
        const haveable=['class_features','tag_features','effects','ranges','durations']
        return haveable.filter(obj=>Object.keys(this).includes(obj) && this[obj].length>0)
    }
}

class StatArray {
    constructor() {
        this.points = 28;
        this.str = -2;
        this.dex = -2;
        this.con = -2;
        this.int = -2;
        this.wis = -2;
        this.cha = -2;
        this.boosted = []
    }
    score_values = {
        "-2": 0,
        "-1": 1,
        "0": 2,
        "1": 3,
        "2": 5,
        "3": 8,
        "4": 12
    }
    background_boosts(char) {
        char.backgrounds.forEach((bg) => {
            this.boosted.push(ruleset.attributes[bg.relate.attributes].name.toLowerCase().slice(0, 3))
        })
    }
    increase_score(score) {
        var step = this.score_values[String(this[score] + 1)] - this.score_values[String(this[score])]
        console.log(step)
        if (this.points - step >= 0 && this[score] < 4) {
            this[score] += 1
            this.points -= step
            this.display(score)
        }
    }
    decrease_score(score) {
        var step = this.score_values[String(this[score]) - 1] - this.score_values[String(this[score])]
        console.log(step)
        if (this[score] > -2 && this.points - step <= 28) {
            this[score] -= 1
            this.points -= step
            this.display(score)
        }
    }
    display(score) {
        document.getElementById(score).value = this[score]
        if (this.boosted.includes(score)) {
            document.getElementById(score).value = Number(this[score] + 1)
        }
        document.getElementById('pts_remaining').value = this.points
    }
    finalize() {
        const copy = Object.assign(new Object(), this)
        copy.boosted.forEach((boost) => {
            copy[boost] += 1
        })
        return copy
    }
    output(character) {
        character.ability_scores=this.finalize()
    }
    static from(character) {
        const r=new StatArray();
        r.str=Number(character.str)
        r.dex=Number(character.dex)
        r.con=Number(character.con)
        r.int=Number(character.int)
        r.wis=Number(character.wis)
        r.cha=Number(character.cha)
        return r
    }
    async render() {
        var stats={}
        const v=['str','dex','con','int','wis','cha']
        v.forEach(async (stat)=> {
            const parsed={
                "code":stat,
                "value":this[stat]
            }
            const r=await stat_template.render({stat:parsed})
            stats[stat]=r
        })
        return stats
    }
}

class SkillArray extends Array {
    constructor(data) {
        super();
        Object.assign(this,data);
        for (var i=0;i<this.length;i++) {
            this[i]=Feature.parse(this[i])
        }
    }
    async render() {
        const parent=document.createElement('div')
        this.forEach(async (skill)=> {
            var s=await skill.render();
            parent.append(s)
        })
        return parent
    }
}

class Feature {
    constructor(data) {
        Object.assign(this, data)
    }
    static parse(data) {
        if (data.table == 'effects') {
            return new Effect(data)
        }
        if (metadata.includes(data.table)) {
            return new Metadata(data)
        }
        if (data.table=='skills') {
            return new Skill(data)
        }
        else {
            return new Feature(data)
        }
    }
    async get_template() {
        const t = new Template('feature');
        await t.get_template();
        this.template = t
    }
    clone() {
        const clone = Feature.parse(this);
        return clone
    }
    define_ancestry() {
        this.requirements = {}
        this.requirements[this.table] = new Featureset(ruleset[this.table][this.id].requires)
    }
    async define_children() {
        this.required_for = {}
        this.required_for[this.table] = new Featureset(ruleset[this.table][this.id].required_for)
    }
    define_crossclass() {
        if (this.table == 'tags') {
            this.required_for['tag_features'] = new Featureset(Object.values(ruleset.tag_features).filter(f => f.tags.id == this.id))
        }
        if (this.table == 'tag_features') {
            this.requirements['tags'] = new Featureset([ruleset.tags[this.fetch_relational_ids('tags')]])
        }
        if (this.table == 'class_features') {
            this.requirements['classes'] = new Featureset([ruleset.classes[this.fetch_relational_ids('classes')]])
        }
        if (this.table == 'effects') {
            this.requirements['tags'] = new Featureset(ruleset.effects[this.id].tags.map(t => ruleset.tags[t.id]))
        }
        if (this.table == 'ranges' || this.table == 'durations') {
            this.requirements['effects'] = new Featureset(Object.values(ruleset.effects).filter(item => this.tree.includes(item.tree)))
        }
    }
    fetch_relational_ids(attr) {
        if (Object.hasOwn(this, attr)) {
            return this[attr].id
        }
        else {
            return this.relate[attr]
        }
    }
    of_tier(char) {
        return Number(this.tier.split('T')[1]) <= char.tier
    }
    meets_requirements(req, char) {
        const char_ids = char[req].get_ids()
        const option_ids = this.get_requirement_ids(req)
        if (option_ids.length < 1) {
            return true
        }
        else {
            const overlap = option_ids.filter(id => char_ids.includes(id))
            if (overlap.length > 0) {
                return true
            }
            else {
                return false
            }
        }
    }
    available(char) {
        if (this.of_tier(char)) {
            var is_avail = true;
            if (has_ancestry.includes(this.table)) {
                this.define_ancestry();
                this.define_crossclass();
                Object.keys(this.requirements).forEach((key) => {
                    if (this.meets_requirements(key, char) == false) {
                        is_avail = false
                    }
                })
            }
            return is_avail
        }
        else {
            return false
        }
    }
    get_requirement_ids(table) {
        return this.requirements[table].map(item => item.id)
    }
    async load_children() {
        const children = []
        this.required_for[this.table].forEach((feature) => {
            feature = Feature.parse(feature);
            children.push(feature);
        })
        this.children = children
    }
    async display_children(char) {
        this.define_children();
        await this.load_children();
        var sibling = document.getElementById(this.id).parentElement.parentElement
       console.log(sibling)
        this.children.forEach(async (child) => {
            if (child.available(char)) {
                const ch = await child.render();
                sibling.after(ch)
            }
        })
    }
    async delete_children(char) {
        this.children.forEach(async (child) => {
            if (!child.available(char)) {
                try {
                    document.getElementById(child.id).parentElement.parentElement.remove()
                }
                catch { TypeError }
            }
        })
    }
    async render() {
        var r;
        if (this.table == 'tag_features') {
            const copy = this.clone();
            delete copy.tags
            r = await feature_template.render({ feature: copy })
        } else {
            r = await feature_template.render({ feature: this })
        }
        if (this.__proto__.constructor == Feature) {
            r.querySelector('input[type="checkbox"]').style.display == 'none'
        }
        const f = this.clone()
        r.querySelector('input[type="checkbox"]').onclick = function () { character.toggle(event, f) }
        return r
    }
}

class Featureset extends Array {
    constructor(data, section = null, subsection = null) {
        super();
        Object.assign(this, _.uniqWith(data, _.isEqual))
        this.forEach((feature) => {
            this[this.indexOf(feature)] = Feature.parse(feature)
        })
        this.section = section;
        this.subsection = subsection;
        if (!this.is_empty()) {
            if (section == null) {
                this.section = 'ruleset'
            }
            if (subsection == null) {
                this.subsection = this[0].table
            }
        }
    }
    async get_template() {
        const t = new Template('set');
        await t.get_template();
        this.template = t
    }
    sort(attr) {
        if (this.is_simple(attr)) {
            if (typeof (this[0][attr]) == String) {
                return super.sort((a, b) => a[attr].localeCompare(b[attr]))
            }
            else {
                return super.sort((a, b) => a[attr] - b[attr])
            }
        }
        else {
            return super.sort((a, b) => a[attr].name.localeCompare(b[attr].name))
        }
    }
    default_attrs() {
        const mappings = {
            'class_features': 'class_paths',
            'tag_features': 'tags',
            'effects': 'tree',
            'ranges': 'tree',
            'durations': 'tree'
        }
        return mappings[this.subsection]
    }
    group(attr = null) {
        if (attr == null) {
            attr = this.default_attrs()
        }
        if (this.is_empty()) {
            throw new Error('Empty featureset')
        }
        if (this.is_simple(attr)) {
            return this.group_simple(attr)
        }
        else {
            return this.group_complex(attr)
        }
    }
    group_simple(simple) {
        const paths = {}
        this.forEach((feature) => {
            if (!Object.keys(paths).includes(String(feature[simple]))) {
                paths[String(feature[simple])] = new Array();
            }
            paths[String(feature[simple])].push(feature)
            feature.get_sorter = function () {
                return feature[simple]
            }
        })
        return new Group(paths, simple);
    }
    group_complex(complex) {
        const paths = {}
        this.forEach((feature) => {
            if (!Object.keys(paths).includes(feature[complex].name)) {
                paths[feature[complex].name] = new Array();
            }
            paths[feature[complex].name].push(feature)
            feature.get_sorter = function () {
                return feature[complex].name
            }
        })
        return new Group(paths, complex);
    }
    is_simple(attr) {
        if (['tree', 'xp', 'tier'].includes(attr)) {
            return true
        }
        else {
            return false
        }
    }
    is_empty() {
        if (this.length == 0) {
            return true
        }
        else {
            return false
        }
    }
    qualifies_for(character) {
        if (this.length > 0) {
            return this.filter(item => item.available(character))
        }
    }
    get_ids() {
        return this.map(item => item.id)
    }
    async render() {
        const t = await set_template.render({ set: this })
        this.forEach(async (f) => {
            const r = await f.render()
            t.children[1].append(r)
        })
        return t
    }
}

class Metadata extends Feature {
    constructor(data) {
        super(data);
    }
    async render(is_default = false) {
        if (document.getElementById(this.id)==null) {
            document.getElementById(`${this.table}_tab`).style.visibility = 'visible'
            var base = await super.render();
            if (is_default == true) {
                base.querySelector('input[type="checkbox"]').checked = true;
                base.querySelector('input[type="checkbox"]').disabled = true;
            }
            return base
        }
    }
}

class Effect extends Feature {
    constructor(data) {
        super(data);
        this.range = Feature.parse(this.range)
        this.duration = Feature.parse(this.duration)
    }
    async display_children(char) {
        await super.display_children(char);
        await this.range.render(true).then((result) => document.getElementById('ranges').append(result))
        await this.range.display_children(char);
        await this.duration.render(true).then((result) => document.getElementById('durations').append(result))
        await this.duration.display_children(char);
    }
    async delete_children(char) {
        await super.delete_children(char);
        if (!String(char.effects.map(e => e.tree)).includes(this.tree)) {
            document.getElementById(this.range.id).parentElement.parentElement.remove();
            document.getElementById(this.duration.id).parentElement.parentElement.remove();
            if (document.getElementById('ranges').firstElementChild.firstElementChild.children.length == 0) {
                document.getElementById(`ranges_tab`).style.visibility = 'hidden'
                document.getElementById(`durations_tab`).style.visibility = 'hidden'
            }
        }
    }
}

class Skill extends Feature {
    constructor(data) {
        super(data);
        if (Object.hasOwn(this,'attributes')) {
            this.code=this.attributes.name.toLowerCase().slice(0,3)
        }
    }
    async render() {
        const r=await skill_template.render({skill:this})
        if (this.proficient) {
            r.firstElementChild.checked=true
            r.firstElementChild.disabled=true
        }
        const copy=this.clone()
        r.firstElementChild.onclick=function() {character.toggle(event,copy,character)}
        return r
    }
    cost(character,event) {
        var owned=character.skills.filter(s=>s.proficient).length
        character.free_skills=4+Number(character.ability_scores.int)-owned
        if (event.target.checked) {
            character.free_skills-=1
        }
        // else {
        //     character.free_skills-=2
        // }
        console.log(character.free_skills)
        if (character.free_skills<0) {
            this.xp=Math.abs(character.free_skills)+1
        }
        else {
            this.xp=0

        }
    }
    proficiency(character) {
        if (this.proficient==false) {
            this.proficient=true
            this.bonus=Number(character.ability_scores[this.code])+character.tier+1
        }
        else {
            this.proficient=false
            this.bonus=Number(character.ability_scores[this.code])
        }
        document.getElementById(this.id).nextElementSibling.value=this.bonus
    }
}

class Group {
    constructor(data, section) {
        this.grouper = section
        Object.keys(data).forEach((header) => {
            this[header] = o
        })
    }
    keys() {
        return Object.keys(this)
    }
    async render(parent) {
        Object.keys(this).forEach(async (heading) => {
            try {
                const sub = await this[heading].render()
                parent.append(sub)
            }
            catch { TypeError }
        })
    }
}

class Template {
    constructor(name) {
        this.name = name;
    }
    async get_template() {
        const f = await fetch(`/static/snippets/${this.name}.html`).then((result) => result.text()).then((result) => nunjucks.compile(result))
        this.tpl = f;
    }

    async render(content) {
        function has(obj, target) {
            return Object.hasOwn(obj, target)
        }
        content['has'] = has;
        const item = $.parseHTML(this.tpl.render(content))[0]
        return item
    }
}


async function load_character(id) {
    await load_ruleset();
    await load_templates();
    c = new Character(await fetch(`/static/characters/${id}.json`)
        .then((result) => result.json()));
    if (c.location.includes('stats')) {
        c.init_stats();
    }
    if (c.location.includes('xp')) {
        c.tier=1;
        c.render_options();
        c.render_skills();
    }
    if (c.location.includes('sheet')) {
        await c.status();
        c.define_skills();
        c.render_sheet();
    }
    window.character = c;
}

async function load_ruleset() {
    request = await fetch('/static/ruleset.json')
    data = await request.json()
    ruleset = new Ruleset(data);
    window.ruleset = ruleset;
}

async function load_templates() {
    f = new Template('feature')
    await f.get_template()
    s = new Template('set')
    await s.get_template()
    sk = new Template('skill')
    await sk.get_template()
    st= new Template('stats')
    await st.get_template()
    window.stat_template=st;
    window.skill_template=sk;
    window.feature_template = f;
    window.set_template = s;
}

// ABILITY SCORES




// LOAD INITIAL ABILITIES 



async function load_abilities() {
    const options = await fetch_options()
    Object.keys(options.features).forEach(async (tab) => {
        if (options.features[tab] != undefined) {
            f = await render_tree(options.features[tab])
            document.getElementById(tab).appendChild(f)
        }
    })
    Object.keys(options.metadata).forEach(async (tab) => {
        if (options.metadata[tab] != undefined) {
            f = await render_tree(options.metadata[tab])
            document.getElementById(tab).appendChild(f)
        }
    })
    await load_skills()
}

async function fetch_metadata(effects) {
    durations = Array()
    ranges = Array()
    if (effects.Buffs) {
        durations.push(effects.Buffs[0].duration)
        ranges.push(effects.Buffs[0].range)
    }
    if (effects.Debuffs) {
        durations.push(effects.Debuffs[0].duration)
        ranges.push(effects.Debuffs[0].range)
    }
    if (Object.keys(effects).includes("Damage")) {
        if (effects.Damage.length > 0) {
            durations.push(effects.Damage[0].duration)
            ranges.push(effects.Damage[0].range)
        }
    }
    if (Object.keys(effects).includes("Healing")) {
        if (effects.Healing.length > 0) {
            durations.push(effects.Healing[0].duration)
            ranges.push(effects.Healing[0].range)
        }
    }
    return { "durations": durations, "ranges": ranges }
}

// TOGGLE AVAILABLE ABILITIES

function effect_toggle(item_id, item_table) {
    log_xp(item_id, item_table)
    tree = document.getElementById(item_id).parentElement.parentElement
    tree_tag = tree.getAttribute("data-tree")
    selected_siblings = document.querySelectorAll(`[id='${tree.id}'] input[type="checkbox"]:checked`)
    selected_effects = document.querySelectorAll(`[id='effects'] input[type="checkbox"]:checked`)
    if (selected_siblings.length == 1) {
        toggle_metadata_tabs(1)
        toggle_tree(1, tree_tag)
    }
    if (selected_siblings.length == 0) {
        toggle_tree(0, tree_tag)
    }
    if (selected_effects.length == 0) {
        toggle_metadata_tabs(0)
    }
}

function toggle_tree(toggle, tree) {
    if (toggle == 0) { disp = "none" } else { disp = "block" }
    ranges = document.querySelectorAll(`[id='ranges'] [data-tree='${tree}']`)
    ranges.forEach((item) => {
        item.style.display = disp
    })
    durations = document.querySelectorAll(`[id='durations'] [data-tree='${tree}']`)
    durations.forEach((item) => {
        item.style.display = disp
    })
}

async function serve_options(item_id, table, tpl) {
    if (table != "skills") {
        const t = await load_requirements(table)
        t[item_id].required_for.forEach(async (item) => {
            if (document.getElementById(item.id) == null) {
                document.getElementById(item_id).parentElement.after(await feature(tpl, item))
            }
            else {
                document.getElementById(item.id).parentElement.style.display = "block"
            }
        })
    }
}

async function remove_options(item_id, table) {
    const t = await load_requirements(table)
    t[item_id].required_for.forEach((item) => {
        document.getElementById(item.id).parentElement.style.display = "none"
    })
}

// SKILLS

async function get_skills() {
    table = await load_requirements("__classes__skills")
    skills = Array()
    Object.values(table).forEach((val) => {
        v = val.skills.map(skill => [skill.name, skill.id])
        v.forEach((item) => {
            skills.push(item)
        })
    })
    ids = [...new Set(skills.map(s => s[1]))]
    names = [...new Set(skills.map(s => s[0]))]
    sks = new Array()
    for (var i = 0; i < ids.length; i++) {
        s = { "name": names[i], "id": ids[i] }
        sks.push(s)
    }
    return sks
}

async function load_skills() {
    skills = await get_skills();
    char_skills = character.backgrounds.map(bg => bg.relate.skills)
    skills.forEach((skill) => {
        s = skill_proficiency(skill)
        s.firstElementChild.onclick = function () { track_skill_xp(skill.id) }
        if (char_skills.includes(skill.id)) {
            s.firstElementChild.setAttribute("checked", true)
            s.firstElementChild.setAttribute("disabled", true)
        }
        document.getElementById("skillList").appendChild(s)
    })
}

// TRACK XP EXPENDITURE

function spend_xp(item_id, item_table, item_cost = null) {
    budget = Number(character.xp_earned)
    current = Number(character.xp_spent)
    itf = document.getElementById(item_id)
    console.log(itf)
    if (item_cost == null) {
        item_cost = Number(itf.value)
    }
    if (current + item_cost > budget) {
        alert("XP budget exceeded. Go on adventures to earn some more!")
        if (itf.type == "checkbox") {
            itf.checked = false;
        }
    }
    else {
        character.xp_spent += item_cost
        log_to_character(item_id, item_table, 0)
        document.getElementById("xp_spent").setAttribute("value", current + item_cost)
        if (item_table == "hit_die") {
            document.getElementById(item_id).innerHTML = Number(document.getElementById(item_id).innerHTML) + 1
            document.getElementById("hd_form").setAttribute("value", Number(document.getElementById(item_id).innerHTML) + 1)
        }
    }
}

function refund_xp(item_id, item_table, item_cost = null) {
    budget = Number(character.xp_earned)
    current = Number(character.xp_spent)
    itf = document.getElementById(item_id)
    if (item_cost == null) { item_cost = Number(itf.value) }
    if (current - item_cost >= 0) {
        document.getElementById("xp_spent").setAttribute("value", current - item_cost)
        character.xp_spent -= item_cost
        log_to_character(item_id, item_table, 1)
        if (item_table == "hit_die") {
            document.getElementById(item_id).innerHTML = Number(document.getElementById(item_id).innerHTML) - 1
            document.getElementById("hd_form").setAttribute("value", Number(document.getElementById(item_id).innerHTML) - 1)
        }
    }
}

function log_xp(item_id, item_table, is_req = true, item_cost = null) {
    cb = document.getElementById(item_id)
    if (cb.checked) {
        spend_xp(item_id, item_table, item_cost)
        if (is_req == true) { serve_options(item_id, item_table) }
    }
    else {
        if (item_table == "skills") { refund_xp(item_id, item_table, item_cost = Number(item_cost) + 1) }
        else { refund_xp(item_id, item_table, item_cost) }
        if (is_req) { remove_options(item_id, item_table) }
    }
}

function track_skill_xp(skill_id) {
    skills = document.querySelectorAll(".skillprof:checked")
    skills_bought = skills.length - 2
    skill_cost = skills_bought + 1
    log_xp(skill_id, "skills", is_req = false, skill_cost)
}

// LOG CHARACTER CHOICES

async function log_to_character(ability_id, ability_table, add_or_subtract) {
    if (add_or_subtract == 0) {
        if (!Object.keys(character).includes(ability_table)) {
            character[ability_table] = Array()
        }
        if (ability_table != "hit_die_count") {
            table = await load_requirements(ability_table)
            character[ability_table].push(table[ability_id])
        }
        else {
            character[ability_table] = Number(character[ability_table]) + 1
        }
    }
    if (add_or_subtract == 1) {
        character[ability_table] = character[ability_table].filter(item => item.id != ability_id)
    }
    character.write_to_form()
}

async function send_data() {
    form = document.forms[0]
    await fetch("xp", {
        method: 'POST',
        body: new FormData(form)
    })
}

// HIT DICE 

function increment_hd_xp() {
    count = Number(document.getElementById("hit_die_count").innerHTML)
    cost = Number(base_hit_die_cost[character.classes[0].name])
    spend_xp("hit_die_count", item_table = "hit_die", cost)

}

function decrement_hd_xp() {
    count = Number(document.getElementById("hit_die_count").innerHTML)
    cost = Number(base_hit_die_cost[character.classes[0].name])
    refund_xp("hit_die_count", item_table = "hit_die", cost)
}
// DISPLAY TABS

function toggle_metadata_tabs(toggle) {
    if (toggle == 1) {
        document.getElementById("ranges_tab").style.display = "block"
        document.getElementById("durations_tab").style.display = "block"
        document.getElementById("ranges").classList.add(["tabcontent"])
        document.getElementById("durations").classList.add(["tabcontent"])
    }
    if (toggle == 0) {
        document.getElementById("ranges_tab").style.display = "none"
        document.getElementById("durations_tab").style.display = "none"
        document.getElementById("ranges").classList.remove(["tabcontent"])
        document.getElementById("durations").classList.remove(["tabcontent"])
    }
}

function openTab(tab_id) {
    target = document.getElementById(tab_id)
    tabs = document.getElementsByClassName("tabcontent")
    for (i in tabs) {
        if (tabs[i].id != tab_id) {
            tabs[i].style.display = "none"
        }
        else {
            tabs[i].style.display = "block"
        }
    }
}

// TRACK DATA


function fresh_start(form_id) {
    localStorage.clear()
    var form = document.getElementById(form_id)
    form.reset()
}

function count_columns() {
    trees = document.getElementsByClassName("tree")
    shown = Array()
    for (i in trees) {
        console.log(trees[i].style.display)
        if (trees[i].style.display == "block") {
            shown.push(trees[i])
        }
    }
    num_elements = shown.length
    for (j in shown) {
        shown[j].parentElement.style.width = `${100 / num_elements}%`
    }
}

function clear_selections() {
    localStorage.clear()
}

function save_selections() {
    document.cookie = localStorage.getItem("selections")
    document.cookie["SameSite"] = "None"
}

// UTILITIES

async function load_requirements(table_name) {
    request = await fetch(`/static/requirements/${table_name}.json`)
    data = await request.json()
    return data
}

function limit_selections(elem_name, max_selections) {
    let all = document.getElementsByName(elem_name)
    var sum = 0
    for (var i in all) {
        if (all[i].checked) {
            sum += 1
            if (sum > max_selections) {
                alert("Max number of selections exceeded.")
                all[i].checked = false
            }
        }
    }
}

function clear_character() {
    sessionStorage.removeItem('character')
}




// TEMPLATES


async function feature(feature) {
    item = await render(feature);
    if (feature.table == 'effects') {
        item.firstElementChild.onclick = function () { effect_toggle(feature.id, 'effects') }
    }
    else {
        item.firstElementChild.onclick = function () { log_xp(feature.id, feature.table) }
    }
    return item
}
