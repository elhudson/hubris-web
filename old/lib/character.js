import { Ruleset } from './ruleset.js';
import { StatArray } from './stats.js';
import { SkillArray, Featureset } from './structures.js';
import { useImmerReducer } from 'use-immer';
class Character {
  constructor(data) {
    Object.assign(this, data);
    this.ability_scores = StatArray.from(data);
    this.skills = SkillArray.parse(data.skills, ruleset.skills);
  }
  static async load(id) {
    const from_file = await fetch('/static/characters/' + id + '.json');
    const data = await from_file.json();
    return new Character(data);
  }
  xp(expend) {
    this.xp_spent += expend;
    this.xp_remaining = this.xp_earned - this.xp_spent;
    document.getElementById('xp_spent').value = this.xp_spent;
  }
  sufficient_xp(xp) {
    if (xp + this.xp_spent <= this.xp_earned && xp + this.xp_spent >= 0) {
      return true;
    }
    return false;
  }
  async status() {
    this.level();
    this.power = await this.power_mod();
    this.armor_class = this.set_ac();
  }
  async power_mod() {
    const power_attr = ruleset.attributes[this.classes[0].relate['attributes']].name;
    const pb = Number(this.tier) + 1;
    this.power_mod = Number(this[power_attr.toLowerCase().slice(0, 3)]) + pb;
    document.getElementById('power_bonus').setAttribute('value', this.power_mod);
  }
  level() {
    this.tier = this.calculate_tier();
    this.proficiency = this.tier + 1;
    this.max_hp = 3 * this.tier + this.ability_scores.con;
    if (!Object.hasOwn(this, 'current_hp')) {
      this.current_hp = this.max_hp;
    }
    if (!Object.hasOwn(this, 'powers')) {
      this.powers = 0;
    }
    document.getElementById('powers_used').value = this.powers;
    document.getElementById('proficiency_bonus').value = this.proficiency;
    document.getElementById('hp_max').value = this.max_hp;
    document.getElementById('hp_left').value = this.current_hp;
    document.querySelector(`#tier #tier_${this.tier}`).checked = true;
  }
  fetch_options() {
    const o = {};
    has_ancestry.forEach(table => {
      const options = new Featureset(Object.values(ruleset[table])).qualifies_for(this);
      o[table] = options;
    });
    this.options = o;
    document.getElementById('hd').value = 1;
  }
  async render_options() {
    var _this = this;
    this.fetch_options();
    Object.keys(this.options).forEach(async function (table) {
      var r = await _this.options[table].render();
      document.getElementById(table).append(r);
    });
  }
  init_stats() {
    this.stats = new StatArray();
    this.stats.background_boosts(this);
    ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(item => {
      this.stats.display(item);
    });
  }
  form() {
    const form = document.getElementById('data');
    const me = JSON.stringify(this);
    form.setAttribute('value', me);
  }
  set_ac() {
    const armor = this.classes[0].armor_proficiencies;
    var ac = Number(10 + this.ability_scores.dex);
    if (armor == "Light") {
      ac += this.proficiency;
    }
    if (armor == 'Medium') {
      ac = 14 + this.proficiency;
    }
    if (armor == 'Heavy') {
      ac = 18 + this.proficiency;
    }
    document.getElementById("ac").setAttribute("value", ac);
    return ac;
  }
  use_power(dir) {
    if (dir == '+') {
      this.powers += 1;
    } else if (this.powers > 0) {
      this.powers -= 1;
    }
    document.getElementById('powers_used').value = this.powers;
    document.getElementById('power_dc').value = 10 + this.powers;
  }
  // hd(direction) {
  //     if (direction == 'add') {
  //         var cost = base_hit_die_cost[character.classes[0].name] + (this.hit_dice - 1)
  //         if (this.sufficient_xp(cost)) {
  //             this.hit_dice += 1
  //             this.xp(cost)
  //         }
  //         else {
  //             alert('XP budget exceeded. Go on adventures to earn some more!')
  //         }
  //     }
  //     else {
  //         var net = base_hit_die_cost[character.classes[0].name] + (this.hit_dice - 2)
  //         if (this.sufficient_xp(net * -1) && this.hit_dice > 1) {
  //             this.hit_dice -= 1
  //             this.xp(net * -1)
  //         }
  //     }
  //     document.getElementById('hd').value = this.hit_dice
  //     this.form();
  // }
  async add_feature(option) {
    if (option.table == 'skills') {
      var search = this.skills.find(s => s.id == option.id);
      search.proficiency(this);
    } else {
      this[option.table].push(option);
      if (option.table == 'effects') {
        this.add_feature(option.range);
        this.add_feature(option.duration);
      }
      await option.display_children(this);
    }
  }
  already_owned(feature) {
    const owned = character[feature.table].map(item => item.id);
    if (owned.includes(feature.id)) {
      return true;
    } else {
      return false;
    }
  }
  remove_feature(option) {
    if (option.table == 'skills') {
      var search = this.skills.find(s => s.id == option.id);
      search.proficiency(this);
    } else {
      this[option.table] = this[option.table].filter(item => item.id != option.id);
      option.delete_children(this);
    }
  }
  toggle(event, feature, character = null) {
    if (character != null && feature.table == 'skills') {
      feature.cost(character, event);
      // if (event.target.checked==false) {
      //     feature.cost+=1
      // }
    }

    if (event.target.checked) {
      if (this.sufficient_xp(feature.xp) == true) {
        this.add_feature(feature);
        this.xp(feature.xp);
      } else {
        alert('XP budget exceeded. Go on adventures to earn some more!');
        event.target.checked = false;
      }
    } else {
      this.remove_feature(feature);
      this.xp(-1 * feature.xp);
    }
    this.form();
  }
  define_skills() {
    const s = new SkillArray(Object.values(ruleset.skills));
    s.forEach(skill => {
      if (this.skills.map(sk => sk.id).includes(skill.id)) {
        skill.proficient = true;
        skill.bonus = this.tier + 1 + Number(this.ability_scores[skill.code]);
      } else {
        skill.proficient = false;
        skill.bonus = Number(this.ability_scores[skill.code]);
      }
    });
    this.skills = s;
  }
  async render_skills() {
    this.define_skills();
    const t = await this.skills.render();
    document.getElementById('skills').append(t);
  }
  async render_sheet() {
    var _this2 = this;
    await this.render_stats();
    this.tags.forEach(tag => {
      const d = $.parseHTML(`<div class='tag'> ${tag.name} </div>`)[0];
      document.getElementById('tags').append(d);
    });
    var s = this.has_set();
    if (s.length >> 0) {
      s.forEach(async function (table) {
        const rend = await _this2[table].render();
        document.getElementById(table).append(rend);
      });
    }
  }
  async render_stats() {
    var stats = await this.ability_scores.render();
    Object.keys(stats).forEach(stat => {
      var assoc_skills = this.skills.filter(skill => skill.code == stat);
      var p = document.createElement('div');
      assoc_skills.forEach(async function (s) {
        var r = await s.render();
        p.append(r);
      });
      stats[stat].append(p);
      document.getElementById('stats').append(stats[stat]);
    });
  }
  get_tags() {
    var base_tags = ruleset.classes[this.classes[0].id].tags;
    base_tags.forEach(t => {
      this.tags.push(ruleset.tags[t.id]);
    });
  }
  has_set() {
    const haveable = ['class_features', 'tag_features', 'effects', 'ranges', 'durations'];
    return haveable.filter(obj => Object.keys(this).includes(obj) && this[obj].length > 0);
  }
}
window.ruleset = await Ruleset.load();
const root = ReactDOM.createRoot(document.getElementById('sheet'));
const char = await Character.load(document.getElementById('sheet').getAttribute('data-id'));
root.render(Page(char));
function Item({
  label,
  content
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "item"
  }, /*#__PURE__*/React.createElement("label", null, label), "\xA0", /*#__PURE__*/React.createElement("span", null, content));
}
function Dropdown({
  label,
  data,
  handler,
  selected = null
}) {
  return /*#__PURE__*/React.createElement("div", {
    class: "item"
  }, /*#__PURE__*/React.createElement("label", null, label), " \xA0", /*#__PURE__*/React.createElement("select", {
    id: label,
    defaultValue: selected,
    onChange: handler
  }, Object.keys(data).map(opt => /*#__PURE__*/React.createElement("option", {
    value: opt
  }, data[opt]))));
}
function Radio({
  label,
  data,
  readonly = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "item box"
  }, /*#__PURE__*/React.createElement("label", null, label), /*#__PURE__*/React.createElement("div", {
    className: "bubbles"
  }, data.map(item => /*#__PURE__*/React.createElement("div", {
    class: "bubble"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    disabled: readonly,
    checked: item.selected
  }), /*#__PURE__*/React.createElement("label", null, item.label)))));
}
function Tracker({
  left,
  right,
  editCharacter
}) {
  console.log(left);
  return /*#__PURE__*/React.createElement("div", {
    className: "tracker item"
  }, /*#__PURE__*/React.createElement(Counter, {
    item: left,
    editCharacter: editCharacter
  }), /*#__PURE__*/React.createElement(Counter, {
    item: right,
    editCharacter: editCharacter
  }));
}
function Page(char) {
  return /*#__PURE__*/React.createElement(CharacterSheet, {
    ch: char
  });
}
function edit(draft, action) {
  switch (action.type) {
    case 'toggle-proficiency':
      {
        action.target = draft.skills.findIndex(item => item.id == action.id);
        draft.push({});
      }
    case 'update-score':
      {
        return {
          ...state,
          [action.target]: action.value
        };
      }
  }
}
function CharacterSheet({
  ch
}) {
  const [char, setChar] = React.useState(ch);
  const editCharacter = (e, target, value) => {
    var update = e.target.value;
    value && (update = value);
    !target && (target = e.target.id);
    setChar({
      ...char,
      [target]: update
    });
  };
  const [state, dispatch] = useImmer.useImmerReducer(edit, ch);
  function handleToggle(evt) {
    dispatch({
      type: 'toggle-proficiency',
      id: evt.target.id,
      value: evt.target.value
    });
  }
  const data = {
    character: char,
    edit: setChar,
    handleChange: editCharacter,
    toggle: handleToggle,
    aux: {
      tier: function (spent) {
        var spent = Number(spent);
        if (_.range(0, 30).includes(spent)) {
          return 1;
        } else if (_.range(30, 75).includes(spent)) {
          return 2;
        } else if (_.range(75, 125).includes(spent)) {
          return 3;
        } else {
          return 4;
        }
      },
      hp: function (xp_spent, con = char.con) {
        var tier = this.tier(xp_spent);
        return 3 * tier + Number(con);
      },
      bonus: function (xp_spent, attr = char[attr], proficient) {
        proficient == 'on' && (proficient = true);
        var pb = this.tier(xp_spent) + 1;
        var bonus;
        proficient ? bonus = Number(attr) + pb : bonus = attr;
        return bonus;
      }
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Bio, {
    data: data
  }), /*#__PURE__*/React.createElement(Progression, {
    data: data
  }), /*#__PURE__*/React.createElement(Health, {
    data: data
  }), /*#__PURE__*/React.createElement(AbilityScores, {
    data: data
  }));
}
function Counter({
  item,
  editCharacter
}) {
  !Object.hasOwn(item, 'min') && (item.min = 0);
  !Object.hasOwn(item, 'max') && (item.max = 999999);
  const [count, setCount] = React.useState(item.value);
  function increase(e) {
    console.log('here');
    console.log(item.max);
    if (count < item.max) {
      editCharacter(e, item.id, Number(count) + 1);
      setCount(c => Number(c) + 1);
    }
  }
  function decrease(e) {
    if (count > item.min) {
      editCharacter(e, item.id, Number(count) - 1);
      setCount(c => Number(c) - 1);
    }
  }
  var buttons = null;
  if (item.readonly == false) {
    buttons = /*#__PURE__*/React.createElement("div", {
      class: "toggles"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: increase,
      class: "hd_btn"
    }, /*#__PURE__*/React.createElement("img", {
      src: "https://www.svgrepo.com/show/510136/plus.svg"
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: decrease,
      class: "hd_btn"
    }, /*#__PURE__*/React.createElement("img", {
      src: "https://www.svgrepo.com/show/510074/minus.svg"
    })));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "item counter"
  }, /*#__PURE__*/React.createElement("label", null, item.label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    id: item.id,
    readonly: item.readonly,
    value: count
  }), buttons);
}
function Bonus({
  item
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "item bonus"
  }, /*#__PURE__*/React.createElement("label", null, item.label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    readonly: item.readonly,
    id: item.id,
    value: item.value
  }));
}
function Bio({
  data
}) {
  var d = {
    'name': data.character.name,
    'class': data.character.classes[0].name,
    'backgrounds': data.character.backgrounds[0].name + ' & ' + data.character.backgrounds[1].name
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "subsection bio"
  }, /*#__PURE__*/React.createElement("h1", null, "Bio"), Object.entries(d).map(ent => /*#__PURE__*/React.createElement(Item, {
    label: ent[0],
    content: ent[1]
  })), /*#__PURE__*/React.createElement(Alignment, {
    selected: data.character.alignment,
    editCharacter: data.handleChange
  }));
}
function Alignment({
  selected,
  editCharacter
}) {
  return /*#__PURE__*/React.createElement(Dropdown, {
    data: ruleset.reference.alignments,
    selected: selected,
    label: 'alignment',
    handler: editCharacter
  });
}
function Progression({
  data
}) {
  return /*#__PURE__*/React.createElement("details", {
    className: "subsection sectioned progression"
  }, /*#__PURE__*/React.createElement("summary", null, "Progression"), /*#__PURE__*/React.createElement(XP, {
    spent: data.character.xp_spent,
    earned: data.character.xp_earned,
    editCharacter: data.handleChange
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Tier, {
    data: data
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Proficiency, {
    data: data
  }), /*#__PURE__*/React.createElement(HeroPoints, {
    ct: 0,
    editCharacter: data.handleChange
  }))));
}
function Tier({
  data
}) {
  var tier = data.aux.tier(data.character.xp_spent);
  var d = [1, 2, 3, 4].map(item => new Object({
    label: item,
    value: item,
    selected: true && tier == item
  }));
  return /*#__PURE__*/React.createElement(Radio, {
    label: "tier",
    data: d,
    onChange: data.handleChange
  });
}
function Proficiency({
  data
}) {
  var tier = data.aux.tier(data.character.xp_spent);
  var item = {
    label: 'proficiency',
    readonly: true,
    id: 'proficiency',
    value: Number(tier) + 1
  };
  return /*#__PURE__*/React.createElement(Bonus, {
    item: item
  });
}
function XP({
  earned,
  spent,
  editCharacter
}) {
  const max = React.useMemo(() => {
    return earned;
  }, [earned]);
  var left = {
    label: 'XP Spent',
    id: 'xp_spent',
    value: spent,
    max: max,
    readonly: false
  };
  var right = {
    label: 'XP Earned',
    id: 'xp_earned',
    value: earned,
    readonly: false
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "tracker"
  }, /*#__PURE__*/React.createElement(Counter, {
    className: "current",
    item: left,
    editCharacter: editCharacter
  }), /*#__PURE__*/React.createElement(Counter, {
    className: "remaining",
    item: right,
    editCharacter: editCharacter
  }));
}
function HeroPoints({
  ct,
  editCharacter
}) {
  var item = {
    label: 'Hero Points',
    value: ct,
    id: 'hero_points',
    readonly: false
  };
  return /*#__PURE__*/React.createElement(Counter, {
    item: item,
    editCharacter: editCharacter
  });
}
function Health({
  data
}) {
  var hd_count = data.character.hd;
  var hd_type = data.character.classes[0].hit_die;
  var hd = ruleset.reference.hd.map(item => new Object({
    label: item,
    selected: item == hd_type
  }));
  hd_count == undefined && (hd_count = 1);
  var spent = {
    label: 'HD Used',
    id: 'hd',
    value: 0,
    max: hd_count,
    readonly: false
  };
  var max = {
    label: 'HD Max',
    id: 'hd',
    value: hd_count,
    readonly: true
  };
  return /*#__PURE__*/React.createElement("details", {
    class: "subsection sectioned health"
  }, /*#__PURE__*/React.createElement("summary", null, "Health"), /*#__PURE__*/React.createElement(HP, {
    aux: data.aux,
    spent: data.character.xp_spent,
    handler: data.handleChange,
    con: data.character.con
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Injuries, {
    selected: data.character.injury,
    editCharacter: data.handleChange
  }), /*#__PURE__*/React.createElement(Radio, {
    data: hd,
    label: 'hit die',
    readonly: true
  })), /*#__PURE__*/React.createElement(Tracker, {
    left: spent,
    right: max,
    editCharacter: data.handleChange
  }));
}
function HP({
  aux,
  spent,
  handler,
  con
}) {
  var hp = aux.hp(spent, con);
  var current = {
    label: 'Current HP',
    id: 'current_hp',
    value: hp,
    max: hp,
    readonly: false
  };
  var max = {
    label: 'Max HP',
    id: 'max_hp',
    value: hp,
    readonly: true
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "tracker"
  }, /*#__PURE__*/React.createElement(Counter, {
    item: current,
    editCharacter: handler
  }), /*#__PURE__*/React.createElement(Bonus, {
    item: max,
    editCharacter: handler
  }));
}
function Injuries({
  selected,
  editCharacter
}) {
  if (selected == null) {
    selected = 'uninjured';
  }
  return /*#__PURE__*/React.createElement("div", {
    class: "box"
  }, /*#__PURE__*/React.createElement(Dropdown, {
    label: 'injuries',
    selected: selected,
    handler: editCharacter,
    data: ruleset.reference.injuries
  }));
}
function AbilityScores({
  data
}) {
  var grouped = data.character.skills.by_attribute();
  var assemblage = {};
  Object.keys(grouped).forEach(score => {
    assemblage[data.character.ability_scores[score]] = grouped[score];
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, Object.keys(assemblage).map(s => /*#__PURE__*/React.createElement(Stat, {
    score: s,
    skills: assemblage[s],
    handler: data.toggle,
    aux: data.aux,
    xp: data.character.xp_spent
  })));
}
function Stat({
  score,
  skills,
  handler,
  aux,
  xp
}) {
  var item = {
    label: skills[0].code,
    value: score,
    id: null,
    readonly: true
  };
  return /*#__PURE__*/React.createElement("div", {
    class: "stat"
  }, /*#__PURE__*/React.createElement(Bonus, {
    item: item
  }), skills.map(skill => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Skill, {
    skill: skill,
    val: score,
    xp: xp,
    aux: aux,
    handler: handler
  }))));
}
function Skill({
  skill,
  val,
  aux,
  xp,
  handler
}) {
  skill.bonus = aux.bonus(xp, val, skill.proficient);
  return /*#__PURE__*/React.createElement("div", {
    class: "skill_entry"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    class: "skillprof",
    onClick: handler,
    checked: skill.proficient,
    id: skill.id
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    readonly: true,
    value: skill.bonus
  }), /*#__PURE__*/React.createElement("label", null, skill.name));
}