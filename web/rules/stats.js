export class StatArray {
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
        }
    }
    decrease_score(score) {
        var step = this.score_values[String(this[score]) - 1] - this.score_values[String(this[score])]
        console.log(step)
        if (this[score] > -2 && this.points - step <= 28) {
            this[score] -= 1
            this.points -= step
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
}

