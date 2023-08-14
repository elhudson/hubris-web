import { Feature } from "./feature.js";
export class SkillArray extends Array {
  static parse(skills, rules) {
    var n = rules.list();
    var profs = skills.map(e => e.id);
    n.forEach(skill => {
      profs.includes(skill.id) && (skill.proficient = true);
    });
    return SkillArray.from(n);
  }
  by_attribute() {
    let v = {};
    var codes = [...new Set(this.map(item => item.code))];
    codes.forEach(code => {
      v[code] = this.filter(item => item.code == code);
    });
    return v;
  }
}
export class Featureset extends Array {
  constructor(data, section = null, subsection = null) {
    super();
    Object.assign(this, _.uniqWith(data, _.isEqual));
    this.forEach(feature => {
      this[this.indexOf(feature)] = Feature.parse(feature);
    });
    this.section = section;
    this.subsection = subsection;
    if (!this.is_empty()) {
      if (section == null) {
        this.section = 'ruleset';
      }
      if (subsection == null) {
        this.subsection = this[0].table;
      }
    }
  }
  sort(attr) {
    if (this.is_simple(attr)) {
      if (typeof this[0][attr] == String) {
        return super.sort((a, b) => a[attr].localeCompare(b[attr]));
      } else {
        return super.sort((a, b) => a[attr] - b[attr]);
      }
    } else {
      return super.sort((a, b) => a[attr].name.localeCompare(b[attr].name));
    }
  }
  default_attrs() {
    const mappings = {
      'class_features': 'class_paths',
      'tag_features': 'tags',
      'effects': 'tree',
      'ranges': 'tree',
      'durations': 'tree'
    };
    return mappings[this.subsection];
  }
  group(attr = null) {
    if (attr == null) {
      attr = this.default_attrs();
    }
    if (this.is_empty()) {
      throw new Error('Empty featureset');
    }
    if (this.is_simple(attr)) {
      return this.group_simple(attr);
    } else {
      return this.group_complex(attr);
    }
  }
  group_simple(simple) {
    const paths = {};
    this.forEach(feature => {
      if (!Object.keys(paths).includes(String(feature[simple]))) {
        paths[String(feature[simple])] = new Array();
      }
      paths[String(feature[simple])].push(feature);
      feature.get_sorter = function () {
        return feature[simple];
      };
    });
    return new Group(paths, simple);
  }
  group_complex(complex) {
    const paths = {};
    this.forEach(feature => {
      if (!Object.keys(paths).includes(feature[complex].name)) {
        paths[feature[complex].name] = new Array();
      }
      paths[feature[complex].name].push(feature);
      feature.get_sorter = function () {
        return feature[complex].name;
      };
    });
    return new Group(paths, complex);
  }
  is_simple(attr) {
    if (['tree', 'xp', 'tier'].includes(attr)) {
      return true;
    } else {
      return false;
    }
  }
  is_empty() {
    if (this.length == 0) {
      return true;
    } else {
      return false;
    }
  }
  qualifies_for(character) {
    if (this.length > 0) {
      return this.filter(item => item.available(character));
    }
  }
  get_ids() {
    return this.map(item => item.id);
  }
  async render() {
    const t = await set_template.render({
      set: this
    });
    this.forEach(async f => {
      const r = await f.render();
      t.children[1].append(r);
    });
    return t;
  }
}
export class Group {
  constructor(data, section) {
    this.grouper = section;
    Object.keys(data).forEach(header => {
      this[header] = o;
    });
  }
  keys() {
    return Object.keys(this);
  }
  async render(parent) {
    Object.keys(this).forEach(async heading => {
      try {
        const sub = await this[heading].render();
        parent.append(sub);
      } catch {
        TypeError;
      }
    });
  }
}