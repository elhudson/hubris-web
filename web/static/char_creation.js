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

class char {
    constructor() {
        this.class;
        this.current_hd = 1;
        this.next_hd_cost;
    }
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



async function load_features(character) {
    tags=await load_requirements("__classes__tags")
    my_tags=tags[character.classes[0].id].tags.map(tag=>tag.name)
    console.log(my_tags)
    effects=await load_requirements("effects")
    effects=effects.filter(item=>item.)
    tag_features=await load_requirements("tag_features")
    class_features=await load_requirements("class_features")
    html=""
    Object.values(effects).forEach((item) => {
        html+=effect(item)
    })
    return html
}

async function loadPrerequisites(character_id) {
    request=await fetch(`static/characters/${character_id}.json`)
    character=await request.json()
    html=await load_features(character)
}

function load_metadata_tabs() {
    range_button = document.getElementById("ranges_tab")
    duration_button = document.getElementById("durations_tab")
    range_button.style.display = "block"
    duration_button.style.display = "block"
    document.getElementById("ranges").className = "tabcontent"
    document.getElementById("durations").className = "tabcontent"
}

async function load_all_metadata() {
    load_metadata_tabs()
    ranges = await load_requirements("ranges")
    durations = await load_requirements("durations")
    html = ""
    for (var i = 0; i < Object.keys(ranges).length; i++) {
        html += metadatum(ranges[Object.keys(ranges)[i]])
    }
    for (var j = 0; j < Object.keys(durations).length; j++) {
        html += metadatum(durations[Object.keys(durations)[j]])
    }
    return html
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


// function increment_hd_xp(char_class) {
//     hd_base_value=base_hit_die_cost[char_class];
//     current_hd=Number(document.getElementById("counting").innerHTML)-1;
//     next_hd_cost=hd_base_value+current_hd;
//     if (document.getElementById("xp_spent").value+next_hd_cost<=document.getElementById("xp_earned").value) {
//         document.getElementById("xp_spent").value=Number(document.getElementById("xp_spent").value)+Number(next_hd_cost);
//         document.get    }
//     else {
//         alert("Max XP exceeded.")
//     }
// }

// function decrement_hd_xp(char_class) {
//     hd_base_value=base_hit_die_cost[char_class];
//     current_hd=Number(document.getElementById("counting").innerHTML)-1;
//     current_hd_cost=hd_base_value+current_hd;
//     console.log(current_hp_cost)
//     if (document.getElementById("xp_spent").value-current_hd_cost>=1) {
//         document.getElementById("xp_spent").value-=current_hd_cost;
//         decrement()
//     }
// }

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

function effect(feature) {
    return `<div class="opt"
    <input type="checkbox" id="${feature.id}">    
    <label>${feature.name}</label>
    <div class="info">
        <table>
            <tr>
                <td>
                    Tree
                </td>
                <td>
                    <span>
                    </span>
                    <span id="${feature.id}_tree">${feature.tree}</span>
                </td>
            </tr>
            <tr>
                <td>XP</td>
                <td><input type="number" class="cost" id="${feature.id}_xp" value="${feature.xp}">
                </td>
            </tr>
        </table>
    </div>
    <div class="explainer sub">${feature.description}</div>
</div>`
}

function metadatum(data) {
    return `<div class="opt">
<input type="checkbox" id="${data.id}">
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