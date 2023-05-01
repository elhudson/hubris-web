const score_values={
    "-2":0,
    "-1":1,
    "0":2,
    "1":3,
    "2":5,
    "3":8,
    "4":12
}

const sample_arrays=[
    [4,3,0,0,0,0],
    [4,4,0,0,-2,-2],
    [4,3,3,-2,-2,-2],
    [4,3,2,0,-1,-2],
    [3,3,3,0,-1,-1],
    [3,2,2,2,1,0],
    [2,2,2,2,2,1]
]

class abilityScores {
    constructor() {
        this.str=-2;
        this.dex=-2;
        this.con=-2;
        this.int=-2;
        this.wis=-2;
        this.cha=-2;
    }
}


function points_remaining(scores) {
        let val=0;
        let stats=Object.keys(scores)
        for (var prop in stats) {
            let score=scores[stats[prop]]
            console.log(score)
            let score_value=score_values[String(score)]
            val+=score_value
        }
        return 28-val
    }

function setup() {
    let scores=new abilityScores()
    localStorage.setItem("a",JSON.stringify(scores))
    let left=document.getElementById("pts_remaining")
    left.setAttribute("value",points_remaining(scores))
    let form=document.forms[0]
    for (var item in form) {
        form[item].value=scores[form[item].id]
    }
}

function update(attr) {
    let new_value=document.getElementById(attr).value
    let scores=JSON.parse(localStorage.getItem("a"))
    console.log(scores)
    let new_scores=Object.assign(new abilityScores,scores)
    if (scores[attr]!=new_value) {
        new_scores[attr]=new_value
    }
    let remaining=points_remaining(new_scores)
    document.getElementById("pts_remaining").setAttribute("value",remaining)
    if (remaining<0) {
        alert("You're all out of points, buddy.")
        document.getElementById(attr).value=scores[attr]
        let remaining=points_remaining(scores)
        document.getElementById("pts_remaining").setAttribute("value",remaining)
    }
    else {
        localStorage.setItem("a",JSON.stringify(new_scores))
    }
    
}

function write() {
    document.cookie=localStorage.getItem("a")
}

function limit_selections(elem_name,max_selections) {
    let all=document.getElementsByName(elem_name)
    var sum=0
    for (var i in all) {
        if (all[i].checked) {
            sum+=1
            if (sum>max_selections) {
                alert("Max number of selections exceeded.")
                all[i].checked=false
            }
        }
    }
}
