xp(expend) {
    this.xp_spent += expend
    this.xp_remaining = this.xp_earned - this.xp_spent
    document.getElementById('xp_spent').value = this.xp_spent
}
sufficient_xp(xp) {
    if (xp + this.xp_spent <= this.xp_earned && xp + this.xp_spent >= 0) {
        return true
    }
    return false
}
async status() {
    this.level()
    this.power = await this.power_mod();
    this.armor_class = this.set_ac()
}
async power_mod() {
    document.getElementById('power_bonus').setAttribute('value', this.power_mod)
}
level() {
    this.tier = this.calculate_tier()
    this.proficiency = this.tier + 1
    this.max_hp = 3 * (this.tier) + this.ability_scores.con
    if (!Object.hasOwn(this, 'current_hp')) {
        this.current_hp = this.max_hp
    }
    if (!Object.hasOwn(this, 'powers')) {
        this.powers = 0
    }
    document.getElementById('powers_used').value = this.powers
    document.getElementById('proficiency_bonus').value = this.proficiency
    document.getElementById('hp_max').value = this.max_hp
    document.getElementById('hp_left').value = this.current_hp
    document.querySelector(`#tier #tier_${this.tier}`).checked = true
}
fetch_options() {
    const o = {}
    has_ancestry.forEach((table) => {
        const options = new Featureset(Object.values(ruleset[table])).qualifies_for(this)
        o[table] = options
    })
    this.options = o
    document.getElementById('hd').value = 1;
}
async add_feature(option) {
    if (option.table == 'skills') {
        var search = this.skills.find(s => s.id == option.id)
        search.proficiency(this)
    }
    else {
        this[option.table].push(option);
        if (option.table == 'effects') {
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
    if (option.table == 'skills') {
        var search = this.skills.find(s => s.id == option.id)
        search.proficiency(this)
    }
    else {
        this[option.table] = this[option.table].filter(item => item.id != option.id)
        option.delete_children(this)
    }
}
toggle(event, feature, character = null) {
    if (character != null && feature.table == 'skills') {
        feature.cost(character, event)
        // if (event.target.checked==false) {
        //     feature.cost+=1
        // }
    }
    if (event.target.checked) {
        if (this.sufficient_xp(feature.xp) == true) {
            this.add_feature(feature)
            this.xp(feature.xp)
        }
        else {
            alert('XP budget exceeded. Go on adventures to earn some more!')
            event.target.checked = false
        }
    }
    else {
        this.remove_feature(feature)
        this.xp(-1 * feature.xp)
    }
    this.form()
}
define_skills() {
    const s = new SkillArray(Object.values(ruleset.skills))
    s.forEach((skill) => {
        if (this.skills.map(sk => sk.id).includes(skill.id)) {
            skill.proficient = true
            skill.bonus = this.tier + 1 + Number(this.ability_scores[skill.code])
        }
        else {
            skill.proficient = false
            skill.bonus = Number(this.ability_scores[skill.code])
        }
    })
    this.skills = s
}
async render_skills() {
    this.define_skills();
    const t = await this.skills.render();
    document.getElementById('skills').append(t)
}
async render_sheet() {
    await this.render_stats();
    this.tags.forEach((tag) => {
        const d = $.parseHTML(`<div class='tag'> ${tag.name} </div>`)[0]
        document.getElementById('tags').append(d)
    })
    var s = this.has_set();
    if (s.length >> 0) {
        s.forEach(async (table) => {
            const rend = await this[table].render();
            document.getElementById(table).append(rend)
        })
    }
}
async render_stats() {
    var stats = await this.ability_scores.render()
    Object.keys(stats).forEach((stat) => {
        var assoc_skills = this.skills.filter(skill => skill.code == stat)
        var p = document.createElement('div')
        assoc_skills.forEach(async (s) => {
            var r = await s.render();
            p.append(r)
        })
        stats[stat].append(p)
        document.getElementById('stats').append(stats[stat])
    })
}