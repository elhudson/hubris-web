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

class abilityScores {
    constructor() {
        this.str = -2;
        this.dex = -2;
        this.con = -2;
        this.int = -2;
        this.wis = -2;
        this.cha = -2;
    }
}


function points_remaining(scores) {
    let val = 0;
    let stats = Object.keys(scores)
    for (var prop in stats) {
        let score = scores[stats[prop]]
        console.log(score)
        let score_value = score_values[String(score)]
        val += score_value
    }
    return 28 - val
}

function setup(boost1, boost2) {
    let scores = new abilityScores()
    let stats = Object.keys(scores)
    for (item in stats) {
        if (stats[item] == boost1 || stats[item] == boost2)
            scores[stats[item]] += 1
    }
    localStorage.setItem("a", JSON.stringify(scores))
    let left = document.getElementById("pts_remaining")
    left.setAttribute("value", 28)
    let form = document.forms[0]
    for (var item in form) {
        form[item].value = scores[form[item].id]
    }
}



function update(attr) {
    let new_value = document.getElementById(attr).value
    let scores = JSON.parse(localStorage.getItem("a"))
    console.log(scores)
    let new_scores = Object.assign(new abilityScores, scores)
    if (scores[attr] != new_value) {
        new_scores[attr] = new_value
    }
    let remaining = points_remaining(new_scores)
    document.getElementById("pts_remaining").setAttribute("value", remaining)
    if (remaining < 0) {
        alert("You're all out of points, buddy.")
        document.getElementById(attr).value = scores[attr]
        let remaining = points_remaining(scores)
        document.getElementById("pts_remaining").setAttribute("value", remaining)
    }
    else {
        localStorage.setItem("a", JSON.stringify(new_scores))
        document.cookie = localStorage.getItem("a")

    }

}
write()
function write() {
    document.cookie = localStorage.getItem("a")
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

function display_metadata(r,d) {
    let range=JSON.parse(he.unescape(r))
    let duration=JSON.parse(he.unescape(d))
    if (document.getElementById(range.tree)==undefined) {
        rng=load_default_metadata(range)
        dur=load_default_metadata(duration)
        tree=document.createElement("div")
        tree.appendChild(rng)
        tree.appendChild(dur)
        tree.id=range.tree
        rng=
    }
}


function load_default_metadata(data) {
        let category=data.table
        header=document.createElement("h2")
        body=document.createElement("div")
        header.innerHTML=category.charAt(0).toUpperCase()+category.slice(1)
        item=document.createElement("div")
        item.appendChild(header)
        const opt=`<div class="opt">
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
                    <td>
                        ${data.xp}
                    </td>
                </tr>
            </table>
        </div>
        <div class="explainer sub">
        ${data.description}
        </div>
        </div>`
        o=new DOMParser().parseFromString(opt,"text/html").body.firstElementChild
        item.append(o)
        return item
}

function track_xp_spent(checkbox_id,range=null,duration=null) {
    box = document.getElementById(checkbox_id)
    v = document.getElementById(checkbox_id + "_xp").value
    if (box.checked == true) {
        if (Number(document.getElementById("xp_spent").value) + Number(v) > 6) {
            box.checked = false
            alert("XP budget exceeded")
        }
        mark_selected(box, v)
        if (range!=null) {
            display_metadata(range,duration)
        }
    }
    if (box.checked == false) {
        mark_unselected(box, v)
        if (range!=null) {
            remove_metadata(range)
        }
    }
    
}

function remove_metadata(range) {
    let v=JSON.parse((he.unescape(range)))
    let doc=document.getElementById(v.tree)
    console.log(doc)

}

function mark_selected(checkbox, value) {
    let current_xp = document.getElementById("xp_spent").value
    document.getElementById("xp_spent").setAttribute("value", Number(current_xp) + Number(value))
    checkbox.setAttribute("checked", true)
    if (localStorage.getItem("selections")==undefined) {
        const r=new Array()
        r.push(checkbox.id)
        localStorage.setItem("selections",JSON.stringify(r))
    }
    else {
        const r=JSON.parse(localStorage.getItem("selections"))
        r.push(checkbox.id)
        localStorage.setItem("selections",JSON.stringify(r))
    }
    save_selections()
}

function mark_unselected(checkbox, value) {
    let current_xp = document.getElementById("xp_spent").value
    document.getElementById("xp_spent").setAttribute("value", Number(current_xp) - Number(value))
    checkbox.setAttribute("checked", false)
    var r=JSON.parse(localStorage.getItem("selections"))
    r=r.filter(v=>v!=checkbox.id)
    localStorage.setItem("selections",JSON.stringify(r))
    save_selections()

}

function reset_selections() {
    localStorage.removeItem("selections")
}

function save_selections() {
    document.cookie=localStorage.getItem("selections")
}