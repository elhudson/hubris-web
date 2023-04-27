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
    total() {
        let val=0;
        for (var prop in this) {
            let score=this[prop]
            let score_value=score_values[String(score)]
            val+=score_value
        }
        this.tot=val;
        this.remaining=28-val;
    }
}

function logRadioSelection() {
    let form=document.querySelector("form")
    for (var i=0;i<form.length;i++) {
        let isSelected=form[i].checked 
        if (isSelected==true) {
            console.log(form[i].id)
            form.setAttribute("value",form[i].id)
            console.log(form.value)
            return form[i].id
        }
    }

}