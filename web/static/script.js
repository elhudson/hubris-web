const ability_scores = document.getElementsByClassName("ability_score");
const skill_bonuses = document.getElementsByClassName("skill_bonus");
const skill_profs = document.getElementsByClassName("is_proficient");
const tiers = document.getElementsByName("tier");


async function start(path) {
  const f=await fetch(path);
  const character=await f.json();
  setArmorClass(character.dex, character.classes[0].armor, character.tier)
  populateProficiencies(character.skills)
  populateModifiers(character.tier)
  w = editWeapon(1, character.classes[0].weapon, character.str, character.dex)
  character.armory = {
    1: w,
  }
    generateNewWeaponSlots(character.armory)
    arm(character.armory)
  }

function arm(armory) {
  properties = ["name", "heavy", "melee", "dmg_fast", "dmg_slow", "time_fast", "time_slow"]
  for (var i = 1; i < Object.keys(armory).length + 1; i++) {
    queries = Array()
    for (var j = 0; j < properties.length; j++) {
      query = generateWeaponPropertyId(i, properties[j])
      queries.push(query)
    }
    document.getElementById(queries[0]).value = armory[i].name
    if (armory[i].heft=="heavy") {
      document.getElementById(queries[1]).checked = true
    }
    if (armory[i].range="melee") {
      document.getElementById(queries[2]).checked = true
    }
    document.getElementById(queries[3]).value = armory[i].fast.mod
    document.getElementById(queries[4]).value = armory[i].slow.mod
    document.getElementById(queries[5]).value = armory[i].fast.ticks
    document.getElementById(queries[6]).value = armory[i].slow.ticks


  }



}

function editWeapon(slot, weaponry, str, dex) {
  wpn_name = document.getElementById(generateWeaponPropertyId(slot, "name")).value
  heft = "heavy"
  range = "distance"
  if (document.getElementById(generateWeaponPropertyId(slot, "light")).checked) {
    heft = "light"
  }
  if (document.getElementById(generateWeaponPropertyId(slot, "melee")).checked) {
    range = "melee"
  }
  return new Weapon(wpn_name, weaponry, heft, range, str, dex)
}

generateWeaponPropertyId = function (slot, prop) {
  return "wpn_" + String(slot) + "_" + prop
}


class Weapon {
  constructor(name, weaponry, heft, range, str, dex) {
    let base = "1d6";
    if (String(weaponry).includes("martial")) {
      let base = "2d6";
    }
    let fast_mod = Number(dex / 2);
    let slow_mod = Number(dex);
    let fast_speed = 7;
    let slow_speed = 10;
    if (this.heft == "heavy") {
      let fast_mod = Number(str);
      let slow_mod = Number(str * 1.5);
      let fast_speed = 10;
      let slow_speed = 13;
    }
    this.fast = {
      mod: base + "+" + String(fast_mod),
      ticks: fast_speed
    };
    this.slow = {
      mod: base + "+" + String(slow_mod),
      ticks: slow_speed
    };
    this.name = name;
    this.heft = heft;
    this.range = range;
  }
}

function generateNewWeaponSlots(armory) {
  html='<div class="weapon" data-slot="1"> <div class="wpn_name"> <label for="wpn_1_name">Name</label> <input type="text" id="wpn_1_name" value="dagger"><br> </div> <div class="wpn_info"> <span class="heft"> <label>Heft</label> <input type="radio" checked name="heft_1" class="wpn_heft" id="wpn_1_light" /> <label for="wpn_light" style="font-weight: normal">Light</label> <input type="radio" name="heft_1" class="wpn_heft" id="wpn_1_heavy" /> <label for="wpn_heavy" style="font-weight: normal">Heavy</label> </span> <span class="range"> <label>Range</label> <span> <input type="radio" checked id="wpn_1_melee" name="wpn_range_1"> <label for="range_melee" style="font-weight: normal">Melee</label> <input type="radio" id="wpn_1_distance" name="wpn_range_1"> <label for="range_distance" style="font-weight: normal">Distance</label> </span> </span> <div class="wpn_atk"> <label>Damage</label> <span><input type="text" id="wpn_1_dmg_fast"></span>/ <span><input type="text" id="wpn_1_dmg_slow"></span> <label>Ticks</label> <span><input type="text" id="wpn_1_time_fast"></span>/ <span><input type="text" id="wpn_1_time_slow"></span> </div> </div> </div> </div>'
  for (var i = 2; i < Object.keys(armory).length + 1; i++) {
    res=html.replaceAll("1",String(i))
    document.getElementsByClassName("attacks")[0].innerHTML+=res
  }
}


function setArmorClass(dex, armor, tier) {
  const proficiency_bonus = 1 + Number(tier)
  var ac = Number(10 + dex)
  if (armor = "light") {
    ac = 10 + Number(dex) + Number(proficiency_bonus)
  }
  else {
    const armors = armor.split(",")
    if (armors[2]) {
      ac = 18 + Number(proficiency_bonus)
    }
    else {
      ac = 14 + Number(proficiency_bonus)
    }
  }
  document.getElementById("ac").setAttribute("value", ac)
}

function populateProficiencies(proficiencies) {
  for (var i = 0; i < (Object.keys(proficiencies).length); i++) {
    const prof = proficiencies[i].title
    let on_sheet = document.getElementById(prof)
    on_sheet.setAttribute("checked", true)
  }
}

function populateModifiers(tier) {
  for (var i = 0; i < skill_bonuses.length; i++) {
    attr = skill_bonuses[i].getAttribute("data-stat")
    attr_value = statMatch(attr)
    is_prof = skill_profs[i].checked
    pb = Number(tier) + 1
    if (is_prof == true) {
      bonus = pb + attr_value
    }
    else {
      bonus = attr_value
    }
    skill_bonuses[i].setAttribute("value", bonus)
  }
}



function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function setProficiency() {
  for (var i = 0; i < tiers.length; i++) {
    if (tiers[i].checked == true) {
      let pb = Number(tiers[i].value) + 1;
      document.getElementById("proficiency_bonus").setAttribute("value", pb)
    }
  }
}



function checkboxLimit() {
  var total = 0;
  boxes = document.getElementsByClassName("wpntype");
  for (var i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) {
      total += 1;
      if (total > 2) {
        alert("HEY!");
        boxes[i].checked = false;
      }
    }
  }
}


function statMatch(ability_score) {
  let stat = document.getElementById(ability_score).getAttribute("value");
  return Number(stat);
}

function addEffects(effects, tags) {
  fx=Object.keys(effects)
  tx=Object.keys(tags)
  tag_names=Array()
  for (j=0;j<tx.length;j++) {
    tag_name=String(tags[tx[j]].title).toLowerCase()
    tag_names.push(tag_name)
  }

  for (let i=0;i<fx.length;i++) {
    let html=document.createElement("span")
    html.id=`effect_${i}`
    html.class="effect"
    html.class+="content"
    let title=document.createElement("h2")
    html.innerHTML=title.innerText
    let effect=effects[fx[i]]
    title.innerText=effect.title
    html.appendChild(title)
    let effect_tags=Array()
    for(let k=0;k<Object.keys(effect.tags).length;k++) {
      effect_tags.push(effect.tags[String(k)].title.toLowerCase())
    }
    let overlap=effect_tags.filter(x => tag_names.includes(x))[0]
    effect_tag=tagMenu()
    let known_from=effect_tag.querySelector(`[label=${overlap}]`)
    known_from.setAttribute("selected",true)
    html.appendChild(effect_tag)
    let trees=treeMenu()
    let t=effect.tree
    const quer=String(t).toLowerCase().replace("s","")
    let effect_tree=trees.querySelector(`[value=${quer}]`)
    effect_tree.setAttribute("selected",true)
    html.appendChild(trees)
    let cost=effect.power
    let effect_cost=document.createElement("input")
    effect_cost.type="number mod"
    effect_cost.value=cost
    html.appendChild(effect_cost)
    let effect_desc=document.createElement("p")
    effect_desc.innerText=effect.description
    html.appendChild(effect_desc)
    let efx=document.getElementsByClassName("effects")[0]
    console.log(efx)
    efx.appendChild(html)
    }
  }

function treeMenu() {
  let selector=document.createElement("select")
  let buff=document.createElement("option")
  buff.label="buff"
  buff.value="buff"
  buff.innerText="Buff"
  let debuff=document.createElement("option")
  debuff.label="debuff"
  debuff.value="debuff"
  debuff.innerText="Debuff"
  let dh=document.createElement("option")
  dh.label="damage/healing"
  dh.value="damage/healing"
  dh.innerText="Damage/Healing"
  selector.appendChild(buff)
  selector.appendChild(debuff)
  selector.appendChild(dh)
  return selector
}

function tagMenu() {
  let selector=document.createElement("select")
  const tagz = {
    magic:["evocation","abjuration","conjuration","transmutation"],
    domain:["mind","nature","religion"],
    elemental:["fire","earth","air","water"],
    damage:["bludgeoning","piercing","slashing"],
    attribute:["strength","agility","constitution","charisma","intelligence"]
  }  
  domains=Object.keys(tagz)
  for (let i=0;i<domains.length;i++) {
    let dom=domains[i]
    let domainTags=tagz[domains[i]]
    let group=document.createElement("optgroup")
    group.label=dom
    for (let j=0;j<domainTags.length;j++) {
      let t=document.createElement("option")
      t.innerText=domainTags[j]
      t.label=domainTags[j]
      group.appendChild(t)
    }
    selector.appendChild(group)
  }
  return selector
}

var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);