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

class abilityScores {
    constructor(boost1, boost2) {
        this.strRaw = -2;
        this.strMod = 0;
        this.dexRaw = -2;
        this.dexMod = 0;
        this.conRaw = -2;
        this.conMod = 0;
        this.intRaw = -2;
        this.intMod = 0;
        this.wisRaw = -2;
        this.wisMod = 0;
        this.chaRaw = -2;
        this.chaMod = 0;
        this.maxBeforeMod = 4;
        this.minBeforeMod = -2;
        this[boost1 + "Mod"] += 1;
        this[boost2 + "Mod"] += 1;
    }
}

async function set_character() {
    character_id = document.getElementsByTagName("body")[0].id
    const request = await fetch(`static/characters/${character_id}.json`)
    const val = await request.json()
    $('body').data("character", val)
    return character = $('body').data('character')
}

function update_ability_score_values(scores) {
    scores.str = scores.strRaw + scores.strMod;
    scores.dex = scores.dexRaw + scores.dexMod;
    scores.con = scores.conRaw + scores.conMod;
    scores.int = scores.intRaw + scores.intMod;
    scores.wis = scores.wisRaw + scores.wisMod;
    scores.cha = scores.chaRaw + scores.chaMod;
    return scores
}

function add_by_one(scores, target) {
    count = 0
    let stats = Array("str", "dex", "con", "int", "wis", "cha")
    for (var prop in stats) {
        if (target == stats[prop]) {
            score_value = score_values[String(Number(scores[stats[prop] + "Raw"]) + 1)]
            count += score_value
        }
        else {
            score_value = score_values[String(Number(scores[stats[prop] + "Raw"]))]
            count += score_value
        }
    }
    if (count <= 28) {
        scores[target + "Raw"] += 1
    }
    return update_ability_score_values(scores)
}

function subtract_by_one(scores, target) {
    count = 0
    let stats = Array("str", "dex", "con", "int", "wis", "cha")
    for (var prop in stats) {
        if (target == stats[prop]) {
            score_value = score_values[String(Number(scores[stats[prop] + "Raw"]) - 1)]
            count += score_value
        }
        else {
            score_value = score_values[String(Number(scores[stats[prop] + "Raw"]))]
            count += score_value
        }
    }
    if (count >= 0) {
        scores[target + "Raw"] -= 1
    }
    return update_ability_score_values(scores)
}

function points_remaining(scores) {
    let stats = Array("str", "dex", "con", "int", "wis", "cha")
    var val = 0
    for (var prop in stats) {
        var score_value = score_values[String(scores[stats[prop] + "Raw"])]
        val += score_value
    }
    return 28 - val

}

function setup(boost1, boost2) {
    let scores = update_ability_score_values(new abilityScores(boost1, boost2))
    let stats = Array("str", "dex", "con", "int", "wis", "cha")
    for (s in stats) {
        document.getElementById(stats[s]).min = scores[scores.minBeforeMod + scores[stats[s] + "Mod"]]
        document.getElementById(stats[s]).max = scores[scores.maxBeforeMod + scores[stats[s] + "Mod"]]
        document.getElementById(stats[s]).value = scores[stats[s]]
    }
    localStorage.setItem("scores", JSON.stringify(scores))
}

function update(attr) {
    let scores = JSON.parse(localStorage.getItem("scores"))
    if (document.getElementById(attr).value > scores[attr]) {
        new_scores = add_by_one(scores, attr)
        document.getElementById(attr).value = new_scores[attr]
    }
    if (document.getElementById(attr).value < scores[attr]) {
        new_scores = subtract_by_one(scores, attr)
        document.getElementById(attr).value = new_scores[attr]
    }
    remaining = points_remaining(new_scores)
    document.getElementById("pts_remaining").setAttribute("value", remaining)
    localStorage.setItem("scores", JSON.stringify(new_scores))
    document.cookie = localStorage.getItem("scores")
}

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
}

async function render_tree(tree) {
    headings = Object.keys(tree)
    doc = document.createElement("div")
    is_meta = false
    headings.forEach((header) => {
        html = $.parseHTML(`<details class="feature_group"><summary>${header}</summary></details>`)[0]
        html.id = Math.floor(Math.random() * 89999 + 10000)
        html.setAttribute("data-tree",header)
        entries = tree[header]
        entries.forEach((item) => {
            if (["ranges", "durations"].includes(item.table)) {
                it = $.parseHTML(metadatum(item))[0]
                is_meta = true
                it.firstElementChild.setAttribute("checked",true)
                it.firstElementChild.setAttribute("disabled",true)
            }
            else { it = $.parseHTML(feature(item))[0] }
            if (item.table == "effects") { it.onclick = function () { effect_toggle(item.id) } }
            else { it.onclick = function () { log_xp(item.id) } }
            html.append(it)
        })
        if (is_meta) { html.style.display = "none" }
        doc.appendChild(html)
    })
    return doc
}

function effect_toggle(item_id) {
    log_xp(item_id)
    tree = document.getElementById(item_id).parentElement.parentElement
    tree_tag=tree.getAttribute("data-tree")
    selected_siblings = document.querySelectorAll(`[id='${tree.id}'] input[type="checkbox"]:checked`)
    selected_effects = document.querySelectorAll(`[id='effects'] input[type="checkbox"]:checked`)
    if (selected_siblings.length == 1) {
        toggle_metadata_tabs(1)
        toggle_tree(1,tree_tag)
        flag_defaults(tree)
    }
    if (selected_siblings.length==0) {
        toggle_tree(0,tree_tag)
    }
    if (selected_effects.length==0) {
        toggle_metadata_tabs(0)
    }
}

function toggle_tree(toggle,tree) {
    if (toggle==0) {disp="none"} else {disp="block"}
    ranges=document.querySelectorAll(`[id='ranges'] [data-tree='${tree}']`)
    ranges.forEach((item)=>{
        item.style.display=disp
    })
    durations=document.querySelectorAll(`[id='durations'] [data-tree='${tree}']`)
    durations.forEach((item)=>{
        item.style.display=disp
    })
}

function spend_xp(item_id) {
    budget = Number(character.xp_earned)
    current = Number(character.xp_spent)
    itf = document.getElementById(item_id)
    cost = Number(itf.value)
    if (current + cost > budget) {
        alert("XP budget exceeded. Go on adventures to earn some more!")
        if (itf.type == "checkbox") {
            itf.checked = false;
        }
    }
    else {
        character.xp_spent += cost
        document.getElementById("xp_spent").setAttribute("value", current + cost)
    }
}

function refund_xp(item_id) {
    budget = Number(character.xp_earned)
    current = Number(character.xp_spent)
    itf = document.getElementById(item_id)
    cost = Number(itf.value)
    character.xp_spent -= cost
    document.getElementById("xp_spent").setAttribute("value", current - cost)
}

function log_xp(item_id) {
    cb = document.getElementById(item_id)
    if (cb.checked) { spend_xp(item_id) }
    else { refund_xp(item_id) }
}

function toggle_metadata_tabs(toggle) {
    if (toggle==1) {
        document.getElementById("ranges_tab").style.display="block"
        document.getElementById("durations_tab").style.display="block"
        document.getElementById("ranges").classList.add(["tabcontent"])
        document.getElementById("durations").classList.add(["tabcontent"])
    }
    if (toggle==0) {
        document.getElementById("ranges_tab").style.display="none"
        document.getElementById("durations_tab").style.display="none"
        document.getElementById("ranges").classList.remove(["tabcontent"])
        document.getElementById("durations").classList.remove(["tabcontent"])
    }
}

async function fetch_metadata(effects) {
    durations = Array()
    ranges = Array()
    durations.push(effects.Buffs[0].duration)
    durations.push(effects.Debuffs[0].duration)
    ranges.push(effects.Buffs[0].range)
    ranges.push(effects.Debuffs[0].range)
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


function track_skill_xp(skill_id) {
    skills = document.querySelectorAll(".skill:checked")
    selection = document.getElementById(skill_id)
    skill_cost = skills.length + 1
    if (selection.checked) {
        if (Number(document.getElementById("xp_spent").value) + skill_cost > 6) {
            selection.checked = false
            alert("XP budget exceeded")
        }
        else {
            mark_selected(selection, skill_cost)
        }
    }
    else {
        mark_unselected(selection, Number(skill_cost + 1))
    }
}

function meta_on_click(data, data_tree) {
    add_meta_postreqs(data, data_tree)
    track_xp_spent(data.id)
}

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

function track_effect_xp(checkbox_id) {
    box = document.getElementById(checkbox_id)
    v = document.getElementById(checkbox_id + "_xp").value
    if (v == undefined) {
        v = document.getElementById(checkbox_id + "_xp").innerHTML
    }
    v = Number(v)
    if (box.checked == true) {
        if (Number(document.getElementById("xp_spent").value) + v > 6) {
            box.checked = false
            alert("XP budget exceeded")
        }
        else {
            mark_selected(box, v)
        }
    }
    if (box.checked == false) {
        mark_unselected(box, v)
        tree_options = document.getElementsByClassName(range.tree)
        range_item = document.getElementById(range.id).parentElement
        duration_item = document.getElementById(duration.id).parentElement
        range_bin = document.getElementById("ranges")
        durations_bin = document.getElementById("durations")
        range_tree = document.getElementById("ranges_" + range.tree.toLowerCase())
        durations_tree = document.getElementById("durations_" + duration.tree.toLowerCase())
        is_last_item = true
        for (i in tree_options) {
            if (tree_options[i].childElementCount > 0) {
                if (tree_options[i].firstElementChild.checked) {
                    is_last_item = false
                }
            }
        }
        if (is_last_item) {
            range_tree.replaceChildren()
            durations_tree.replaceChildren()
            durations_tree.style.display = "none"
            range_tree.style.display = "none"
        }
        binnable = true
        for (tree in durations_bin.children) {
            if (durations_bin.children[tree].childElementCount > 0) {
                binnable = false
            }
        }
        if (binnable) {
            document.getElementById("ranges_tab").style.display = "none"
            document.getElementById("durations_tab").style.display = "none"
        }
    }
}

function track_xp_spent(checkbox_id) {
    box = document.getElementById(checkbox_id)
    v = document.getElementById(checkbox_id + "_xp").value
    if (v == undefined) {
        v = document.getElementById(checkbox_id + "_xp").innerHTML
    }
    v = Number(v)
    if (box.checked == true) {
        if (Number(document.getElementById("xp_spent").value) + v > 6) {
            box.checked = false
            alert("XP budget exceeded")
        }
        mark_selected(box, v)
    }
    if (box.checked == false) {
        mark_unselected(box, v)
    }
}



function mark_selected(checkbox, value) {
    let current_xp = document.getElementById("xp_spent").value
    document.getElementById("xp_spent").setAttribute("value", Number(current_xp) + value)
    checkbox.setAttribute("checked", true)
    if (localStorage.getItem("selections") == undefined) {
        const r = new Array()
        r.push(checkbox.id)
        localStorage.setItem("selections", JSON.stringify(r))
    }
    else {
        const r = JSON.parse(localStorage.getItem("selections"))
        r.push(checkbox.id)
        localStorage.setItem("selections", JSON.stringify(r))
    }
    save_selections()
}

function mark_unselected(checkbox, value) {
    let current_xp = document.getElementById("xp_spent").value
    document.getElementById("xp_spent").setAttribute("value", Number(current_xp - value))
    checkbox.setAttribute("checked", false)
    var r = JSON.parse(localStorage.getItem("selections"))
    r = r.filter(v => v != checkbox.id)
    localStorage.setItem("selections", JSON.stringify(r))
    save_selections()

}

function clear_selections() {
    localStorage.clear()
}

function save_selections() {
    document.cookie = localStorage.getItem("selections")
    document.cookie["SameSite"] = "None"
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

function feature(feature) {
    return `<div class="opt">
    <input type="checkbox" id="${feature.id}" value=${feature.xp}>    
    <label>${feature.name}</label>
    <div class="info">
        <label>XP</label>
        <input type="number" class="cost" id="${feature.id}_xp" value="${feature.xp}">
    </div>
    <div class="explainer sub">${feature.description}</div>
</div>`
}

function metadatum(data) {
    return `<div class="opt">
<input type="checkbox" id="${data.id}" value=${data.xp}>
<label for="${data.id}">${data.name}</label>
<div class="info">
    <table>
        <tr>
            <td>
                Tree
            </td>
            <td>
                ${data.tree}
            </td>
        </tr>
        <tr>
            <td>
                XP
            </td>
            <td><span id="${data.id}_xp" value=${data.xp}>
                ${data.xp}</span>
            </td>
        </tr>
    </table>
</div>
<div class="explainer sub">
${data.description}
</div>
</div>`
}