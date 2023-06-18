class Ruleset {
    constructor(data) {
        Object.assign(this, data)
    }
}

class Character {
    constructor(data) {
        Object.assign(this, data)
    }
    populate_skills() {
        ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach((item) => {
            document.getElementById(item).setAttribute('value', this[item])
            this.score_points = 28
        })
    }
    increase_attr(attr) {
        var cur = this[attr]
        var cost = score_values[String(cur + 1)]
        var refund = score_values[String(cur)]
        var max = 4
        if (this.boosts.includes(attr)) {
            max = 5
            cost = score_values[String(cur)]
            refund = score_values[String(cur - 1)]
        }
        if (cur + 1 > max) {
            alert('You cannot increase this ability score any further.')
        }
        else {
            if (this.score_points - cost >= 0) {
                this[attr] += 1
                this.score_points += refund
                this.score_points -= cost
                document.getElementById(attr).setAttribute('value', this[attr])
                document.getElementById('pts_remaining').setAttribute('value', this.score_points)
            }
            else {
                alert("You don't have enough points left to increase that ability score.")
            }
        }
    }
    decrease_attr(attr) {
        var cur = this[attr]
        var min = -2
        var cost = score_values[String(cur - 1)]
        var refund = score_values[String(cur)]
        if (this.boosts.includes(attr)) {
            min = -1
            cost = score_values[String(cur - 2)]
            refund = score_values[String(cur - 1)]
        }
        if (cur - 1 < min) {
            alert('You cannot decrease this ability score any further.')
        }
        else {
            this[attr] -= 1
            this.score_points += refund
            this.score_points -= cost
            document.getElementById(attr).setAttribute('value', this[attr])
            document.getElementById('pts_remaining').setAttribute('value', this.score_points)
        }
    }
    write_to_form() {
        form = document.getElementById('data')
        me = JSON.stringify(this)
        form.setAttribute('value', me)
    }
    is_available(feature) {
        is_avail = false
        if (of_tier(feature) && has_prq(feature)) {
            if (feature.table == "class_features") {
                if (feature.classes.id == character.classes[0].id) {
                    is_avail = true
                }
            }
            if (["tag_features", "effects"].includes(feature.table)) {
                if (has_tag(tags, feature)) {
                    is_avail = true
                }
            }
        }
        return is_avail
    }
    async define_tags() {
        const r = await load_requirements('__classes__tags')
        this.tags = r[this.classes[0].id]['tags']
    }
    async set_background(background_id) {
        console.log(background_id)
        const backgrounds = await load_requirements('backgrounds')
        if (!Object.hasOwn(this, 'backgrounds')) {
            this.backgrounds = new Array()
        }
        this.backgrounds.push(backgrounds[background_id])
    }
}

async function load_character(id, set_stats = false) {
    request = await fetch('static/characters/' + id + ".json")
    data = await request.json()
    c = new Character(data)
    await c.define_tags()
    if (set_stats) { c.populate_skills() }
    window.character = c;
}

async function load_ruleset() {
    request = await fetch('static/requirements/global.json')
    data = await request.json()
    rules = new Ruleset(data)
    return rules
}

// ABILITY SCORES

const score_values = {
    "-2": 0,
    "-1": 1,
    "0": 2,
    "1": 3,
    "2": 5,
    "3": 8,
    "4": 12
}

const sample_arrays = [
    [4, 3, 0, 0, 0, 0],
    [4, 4, 0, 0, -2, -2],
    [4, 3, 3, -2, -2, -2],
    [4, 3, 2, 0, -1, -2],
    [3, 3, 3, 0, -1, -1],
    [3, 2, 2, 2, 1, 0],
    [2, 2, 2, 2, 2, 1]
]

// FILTER ABILITIES

function has_tag(tags, item) {
    class_tags = tags[character.classes[0].id].tags.map(tag => tag.id)
    if (item.tags.length > 1) {
        item_tags = item.tags.map(tag => tag.id)
        if (item_tags.filter(item => class_tags.includes(item)).length > 0) {
            return item
        }
        else {
            return false
        }
    }
    else {
        item_tag = item.tags.id
        if (class_tags.includes(item_tag)) {
            return item
        }
        else {
            return false
        }
    }
}

function of_tier(effect) {
    effect_tier = Number(effect.tier.split("T")[1])
    if (Number(character.tier) >= effect_tier) {
        return true
    }
    return false
}

function has_prq(feature) {
    known = character[feature.table]
    if (feature.requires.length > 0) {
        if (known != undefined) {
            prq = feature.requires.map(item => item.id)
            prq.forEach((item) => {
                if (known.includes(item)) {
                    return true
                }
            })
            return false
        }
        else {
            return false
        }
    }
    else {
        return true
    }
}

function is_available(feature, tags) {
    is_avail = false
    if (of_tier(feature) && has_prq(feature)) {
        if (feature.table == "class_features") {
            if (feature.classes.id == character.classes[0].id) {
                is_avail = true
            }
        }
        if (["tag_features", "effects"].includes(feature.table)) {
            if (has_tag(tags, feature)) {
                is_avail = true
            }
        }
    }
    return is_avail
}

function bin_by_attr(list, attr) {
    const tree = {}
    if (["tree", "xp"].includes(attr)) {
        list.forEach((item) => {
            if (Object.keys(tree).includes(item[attr]) == false) {
                tree[item[attr]] = new Array();
            }
            tree[item[attr]].push(item)
        })
    }
    else {
        list.forEach((item) => {
            if (Object.keys(tree).includes(item[attr].name) == false) {
                tree[item[attr].name] = new Array();
            }
            tree[item[attr].name].push(item)
        })
    }
    return tree
}

// LOAD INITIAL ABILITIES 

async function fetch_options() {
    tags = await load_requirements("__classes__tags")
    effect_data = await load_requirements("effects")
    tag_features_data = await load_requirements("tag_features")
    class_features_data = await load_requirements("class_features")
    effects = bin_by_attr(Object.values(effect_data).filter(item => is_available(item, tags)), "tree")
    meta = await fetch_metadata(effects)
    ranges = bin_by_attr(meta.ranges, "tree")
    durations = bin_by_attr(meta.durations, "tree")
    tag_features = bin_by_attr(Object.values(tag_features_data).filter(item => is_available(item, tags)), "tags")
    class_features = bin_by_attr(Object.values(class_features_data).filter(item => is_available(item, tags)), "class_paths")
    return { "features": { "effects": effects, "tag_features": tag_features, "class_features": class_features }, "metadata": { "ranges": ranges, "durations": durations } }
}

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

async function render_tree(tree) {
    headings = Object.keys(tree)
    doc = document.createElement("div")
    is_meta = false
    headings.forEach((header) => {
        html = $.parseHTML(`<div class="feature_group"></div>`)[0]
        html.id = Math.floor(Math.random() * 89999 + 10000)
        html.setAttribute("data-tree", header)
        entries = tree[header]
        entries.forEach((item) => {
            elem=feature(item)
            if (["ranges", "durations"].includes(item.table)) {
                is_meta = true
                elem.firstElementChild.setAttribute("checked", true)
                elem.firstElementChild.setAttribute("disabled", true)
                serve_options(item.id, item.table)
            }
            html.append(elem)
        })
        if (is_meta) {
            html.style.display = "none";
            doc.appendChild($.parseHTML(`<h3 style='display:none'>${header}</h3>`)[0])
        }
        else {
            doc.appendChild($.parseHTML(`<h3>${header}</h3>`)[0])
        }
        doc.appendChild(html)
    })
    return doc
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

async function serve_options(item_id, table) {
    if (table != "skills") {
        const t = await load_requirements(table)
        t[item_id].required_for.forEach((item) => {
            if (document.getElementById(item.id) == null) {
                document.getElementById(item_id).parentElement.after(feature(item))
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
    skills = await get_skills()
    char_skills = character.backgrounds.map(bg => bg.skills[0].id)
    skills.forEach((skill) => {
        s = $.parseHTML(skill_proficiency(skill))[0]
        s.firstElementChild.onclick = function () { track_skill_xp(skill.id) }
        console.log(s.firstElementChild.onclick)
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
    console.log(item_cost)
    if (current + item_cost > budget) {
        alert("XP budget exceeded. Go on adventures to earn some more!")
        if (itf.type == "checkbox") {
            itf.checked = false;
        }
    }
    else {
        character.xp_spent += item_cost
        log_to_character(item_id, item_table, 0)
        console.log(character[item_table])
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
        character[ability_table] = character[ability_table].filter(item => item.id != ab)
    }
    sessionStorage.setItem("character", JSON.stringify(character))
    parse_for_server()
}

function parse_for_server() {
    f = document.forms[0]
    storer = document.createElement("textarea")
    storer.name = "character"
    storer.style.display = "none"
    storer.textContent = sessionStorage.getItem("character")
    f.appendChild(storer)
    console.log(document.forms[0])
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
    request = await fetch(`static/requirements/${table_name}.json`)
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
function regularize_uuid(character_id) {
    if (character_id.includes("-") == false) {
        return `${character_id.slice(0, 8)}-${character_id.slice(8, 12)}-${character_id.slice(12, 16)}-${character_id.slice(16, 20)}-${character_id.slice(20)}`
    }
    else {
        return character_id
    }
}

const base_hit_die_cost = {
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

// TEMPLATES


function feature(feature) {
    const has_pwr=['effects','ranges','durations']
    const has_tag=['effects']
    const is_meta=['ranges','durations']
    const base= $.parseHTML(
    `<div class="opt">
    <input type="checkbox" id="${feature.id}" value=${feature.xp}>  
    <label>${feature.name}</label>
    <div class="info">
        <label>XP</label> <input type="number" class="cost" id="${feature.id}_xp" value="${feature.xp}">
    </div>
    <textarea disabled class="explainer sub scrolling-explainer">${feature.description}</textarea>
    `)[0]
    function power(feature) {
        return $.parseHTML(`<div>
        <label>Power</label>
        <input type='number' class='cost' id=${feature.id}_pwr' value='${feature.power}'>
        </div>`)[0]}
    function tags(feature) {
        t=feature.tags.map(tag=>tag.name).join(", ")
        return $.parseHTML(
        `<div>
        <label>Tags</label>
        <span>${t}</span>
        </div>`)[0]}
    if (has_pwr.includes(feature.table)) {
        const pw=power(feature)
        base.getElementsByClassName('info')[0].append(pw)
    }
    else if (has_tag.includes(feature.table)) {
        const t=tags(feature)
        base.getElementsByClassName('info')[0].append(t)
    }
    if (feature.table=='effects') {
        base.children[2].append(tags(feature))
        base.firstElementChild.onclick=function() {effect_toggle(feature.id,'effects')}
    }
    else {
        base.firstElementChild.onclick=function() {log_xp(feature.id,feature.table)}
    }
    return base
}

function skill_proficiency(skill) {
    return `<span class="skill_entry"><input type="checkbox" class="skillprof" id=${skill.id}><label>${skill.name}</label></span>`
}