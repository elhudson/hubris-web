


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
    // await load_templates();
    // c = new Character(await fetch(`/static/characters/${id}.json`)
    //     .then((result) => result.json()));
    // if (c.location.includes('stats')) {
    //     c.init_stats();
    // }
    // if (c.location.includes('xp')) {
    //     c.tier=1;
    //     c.render_options();
    //     c.render_skills();
    // }
    // if (c.location.includes('sheet')) {
    //     await c.status();
    //     c.define_skills();
    //     c.render_sheet();
    // }
    // window.character = c;
}

async function load_ruleset() {
    
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
