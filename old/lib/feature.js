class Feature {
  constructor(data) {
    Object.assign(this, data);
  }
  static parse(data) {
    if (data.table == 'effects') {
      return new Effect(data);
    }
    if (['range', 'duration'].includes(data.table)) {
      return new Metadata(data);
    }
    if (data.table == 'skills') {
      return new Skill(data);
    } else {
      return new Feature(data);
    }
  }
  async get_template() {
    const t = new Template('feature');
    await t.get_template();
    this.template = t;
  }
  clone() {
    const clone = Feature.parse(this);
    return clone;
  }
  define_ancestry() {
    this.requirements = {};
    this.requirements[this.table] = new Featureset(ruleset[this.table][this.id].requires);
  }
  async define_children() {
    this.required_for = {};
    this.required_for[this.table] = new Featureset(ruleset[this.table][this.id].required_for);
  }
  define_crossclass() {
    if (this.table == 'tags') {
      this.required_for['tag_features'] = new Featureset(Object.values(ruleset.tag_features).filter(f => f.tags.id == this.id));
    }
    if (this.table == 'tag_features') {
      this.requirements['tags'] = new Featureset([ruleset.tags[this.fetch_relational_ids('tags')]]);
    }
    if (this.table == 'class_features') {
      this.requirements['classes'] = new Featureset([ruleset.classes[this.fetch_relational_ids('classes')]]);
    }
    if (this.table == 'effects') {
      this.requirements['tags'] = new Featureset(ruleset.effects[this.id].tags.map(t => ruleset.tags[t.id]));
    }
    if (this.table == 'ranges' || this.table == 'durations') {
      this.requirements['effects'] = new Featureset(Object.values(ruleset.effects).filter(item => this.tree.includes(item.tree)));
    }
  }
  fetch_relational_ids(attr) {
    if (Object.hasOwn(this, attr)) {
      return this[attr].id;
    } else {
      return this.relate[attr];
    }
  }
  of_tier(char) {
    return Number(this.tier.split('T')[1]) <= char.tier;
  }
  meets_requirements(req, char) {
    const char_ids = char[req].get_ids();
    const option_ids = this.get_requirement_ids(req);
    if (option_ids.length < 1) {
      return true;
    } else {
      const overlap = option_ids.filter(id => char_ids.includes(id));
      if (overlap.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  }
  available(char) {
    if (this.of_tier(char)) {
      var is_avail = true;
      if (has_ancestry.includes(this.table)) {
        this.define_ancestry();
        this.define_crossclass();
        Object.keys(this.requirements).forEach(key => {
          if (this.meets_requirements(key, char) == false) {
            is_avail = false;
          }
        });
      }
      return is_avail;
    } else {
      return false;
    }
  }
  get_requirement_ids(table) {
    return this.requirements[table].map(item => item.id);
  }
  async load_children() {
    const children = [];
    this.required_for[this.table].forEach(feature => {
      feature = Feature.parse(feature);
      children.push(feature);
    });
    this.children = children;
  }
  async display_children(char) {
    this.define_children();
    await this.load_children();
    var sibling = document.getElementById(this.id).parentElement.parentElement;
    console.log(sibling);
    this.children.forEach(async child => {
      if (child.available(char)) {
        const ch = await child.render();
        sibling.after(ch);
      }
    });
  }
  async delete_children(char) {
    this.children.forEach(async child => {
      if (!child.available(char)) {
        try {
          document.getElementById(child.id).parentElement.parentElement.remove();
        } catch {
          TypeError;
        }
      }
    });
  }
  // async render() {
  //     var r;
  //     if (this.table == 'tag_features') {
  //         const copy = this.clone();
  //         delete copy.tags
  //         r = await feature_template.render({ feature: copy })
  //     } else {
  //         r = await feature_template.render({ feature: this })
  //     }
  //     if (this.__proto__.constructor == Feature) {
  //         r.querySelector('input[type="checkbox"]').style.display == 'none'
  //     }
  //     const f = this.clone()
  //     r.querySelector('input[type="checkbox"]').onclick = function () { character.toggle(event, f) }
  //     return r
  // }
}

class Metadata extends Feature {
  constructor(data) {
    super(data);
  }
  async render(is_default = false) {
    if (document.getElementById(this.id) == null) {
      document.getElementById(`${this.table}_tab`).style.visibility = 'visible';
      var base = await super.render();
      if (is_default == true) {
        base.querySelector('input[type="checkbox"]').checked = true;
        base.querySelector('input[type="checkbox"]').disabled = true;
      }
      return base;
    }
  }
}
class Effect extends Feature {
  constructor(data) {
    super(data);
    this.range = Feature.parse(this.range);
    this.duration = Feature.parse(this.duration);
  }
  async display_children(char) {
    await super.display_children(char);
    await this.range.render(true).then(result => document.getElementById('ranges').append(result));
    await this.range.display_children(char);
    await this.duration.render(true).then(result => document.getElementById('durations').append(result));
    await this.duration.display_children(char);
  }
  async delete_children(char) {
    await super.delete_children(char);
    if (!String(char.effects.map(e => e.tree)).includes(this.tree)) {
      document.getElementById(this.range.id).parentElement.parentElement.remove();
      document.getElementById(this.duration.id).parentElement.parentElement.remove();
      if (document.getElementById('ranges').firstElementChild.firstElementChild.children.length == 0) {
        document.getElementById(`ranges_tab`).style.visibility = 'hidden';
        document.getElementById(`durations_tab`).style.visibility = 'hidden';
      }
    }
  }
}
class Skill extends Feature {
  constructor(data) {
    super(data);
    if (Object.hasOwn(this, 'attributes')) {
      this.code = this.attributes.name.toLowerCase().slice(0, 3);
    }
  }
  cost(character, event) {
    var owned = character.skills.filter(s => s.proficient).length;
    character.free_skills = 4 + Number(character.ability_scores.int) - owned;
    if (event.target.checked) {
      character.free_skills -= 1;
    }
    if (character.free_skills < 0) {
      this.xp = Math.abs(character.free_skills) + 1;
    } else {
      this.xp = 0;
    }
  }
  proficiency(character) {
    if (this.proficient == false) {
      this.proficient = true;
      this.bonus = Number(character.ability_scores[this.code]) + character.tier + 1;
    } else {
      this.proficient = false;
      this.bonus = Number(character.ability_scores[this.code]);
    }
    document.getElementById(this.id).nextElementSibling.value = this.bonus;
  }
}
export { Feature, Effect, Skill, Metadata };