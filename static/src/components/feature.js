import React from "react"

export function Feature({ feature, check=null }) {
    var data = <FeatureData feature={feature} />
    return (
        <div class='feature'>
            <div class='feature-name'>
                <div>   
                    {check}
                </div>
                <h2>{feature.name}</h2>
            </div>
            {data}
        </div>
    )
}

function Ticks({ ticks }) {
    ticks == null && (ticks = 0)
    return (
        <div class='feature-info'>
            <label>Ticks</label>
            <input type='number' readOnly value={ticks} />
        </div>
    )
}

function Xp({ xp }) {
    return (
        <div class='feature-info'>
            <label>XP</label>
            <input type='number' readOnly value={xp} />
        </div>
    )

}

function Power({ power }) {
    return (
        <div class='feature-info'>
            <label>Power</label>
            <input type='number' readOnly value={power} />
        </div>
    )

}

function Tags({ tags }) {
    var inside;
    if (tags.length==undefined) {
        inside=<span class='tag'>{tags.name}</span>
    }
    else {
        inside=tags.map(t => <span class='tag'>{t.name}</span>)
    }
    return (
        <div class='feature-info'>
            <label>Tags</label>
            <span>{inside}</span>
        </div>
    )
}

function Tree({ tree }) {
    return (
        <div class='feature-info'>
            <label>Tree</label>
            <span>
            <span class='tree'>{tree}</span>
            </span>
        </div>
    )

}

function Description({ de }) {
    return (
        <div class='feature-info desc'>
            {de}
        </div>
    )
}

function Attribute({ attr }) {
    return (
        <div class='feature-info'>
            <label>Ability</label>
            <span>{attr.name}</span>
        </div>
    )
}

function HitDice({ hd }) {
    return (
        <div class='feature-info'>
            <label>Hit Die</label>
            <span>{hd}</span>
        </div>
    )
}

function WeaponProf({ wpn }) {
    return (
        <div class='feature-info'>
            <label>Weaponry</label>
            <span>{wpn}</span>
        </div>
    )
}

function ArmorProf({ arm }) {
    return (
        <div class='feature-info'>
            <label>Armor</label>
            <span>{arm}</span>
        </div>)
}

function Paths({ pths }) {
    var inside;
    if (pths.length==undefined) {
        inside=<span class='path'>{pths.name}</span>
    }
    else {
        inside=pths.map(t => <span class='path'>{t.name}</span>)
    }
    return (<div class='feature-info'>
        <label>Paths</label>
       <span>{inside}</span>
    </div>)
}

function Skills({ skills }) {
    return (<div class='feature-info'>
        <label>Skills</label>
        <span>
            {skills.map(t => <span class='skill'>{t.name}</span>)}
        </span>
    </div>)
}

function FeatureData({ feature }) {
    feature.description == null && (feature.description = feature.feature)
    var haveable = Object.keys(feature)
    var data = new Array();
    haveable.forEach((prop) => {
        prop == 'tags' && data.push(<Tags tags={feature.tags} />)
        prop == 'power' && data.push(<Power power={feature.power} />)
        prop == 'xp' && data.push(<Xp xp={feature.xp} />)
        prop == 'tree' && data.push(<Tree tree={feature.tree} />)
        prop == 'ticks' && data.push(<Ticks ticks={feature.ticks} />)
        prop == 'weapon_proficiencies' && data.push(<WeaponProf wpn={feature.weapon_proficiencies} />)
        prop == 'armor_proficiencies' && data.push(<ArmorProf arm={feature.armor_proficiencies} />)
        prop == 'class_paths' && data.push(<Paths pths={feature.class_paths} />)
        prop == 'skills' && data.push(<Skills skills={feature.skills} />)
        prop == 'hit_die' && data.push(<HitDice hd={feature.hit_die} />)
        prop == 'attributes' && data.push(<Attribute attr={feature.attributes} />)
    })
    return <div class='feature-content'>
        <div class='feature-data'>
            {data}
        </div>
        <Description de={feature.description} />
    </div>
}