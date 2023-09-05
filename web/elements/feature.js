import React from "react"
import { Metadata as Meta, SmallMod } from "../components/components/text"
import { LabeledItem } from "../components/components/containers"
import { Popper } from "@mui/base"
import { Box } from "@mui/material"
import { Button, Buttons } from "../components/components/interactive"
import _ from 'lodash'
import { css } from "@emotion/css"
import { useTheme } from "@emotion/react"


export default function Feature({ feature, meta=null, check=null }) {
    const theme=useTheme()
    if (feature.description==undefined && feature.feature!=undefined) {
        feature.description=feature.feature.split(':')[1]
        feature.name=feature.feature.split(':')[0]
    }
    var header=(
        <>
        {feature.name}
        {check}
        </>
    )
    return (
        <LabeledItem sx={css`
            ${(feature.buyable==false && check!=null) && (theme.styles.disabled)}
            width:200px;
            >div>div {
                margin:5px;
                border:${theme.border} !important;
            }
            
        `}
        label={header}>
            <FeatureData feature={feature} />
            <Description de={feature.description} />
        </LabeledItem>

    )
}

export function Checkbox({ feature, handler }) {
    const theme=useTheme()
    return (<input 
        className={theme.styles.checkbox}
        type='checkbox' 
        cost={feature.xp} 
        checked={feature.bought} 
        disabled={!feature.buyable} 
        table={feature.table} 
        path={feature.path} 
        onChange={handler} 
        value={feature.id} />)
}

export function FeatureMeta({feature, meta_list}) {
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
      setOpen((previousOpen) => !previousOpen);
    };
    const meta=meta_list
        .filter(r=>r.tree=feature.tree)
        .filter(f=>f.tier==feature.tier)
        .map(r=> 
        <div>
            <Button onClick={handleClick}>{r.name}</Button>
            <Popper 
                id={r.id}
                anchorEl={anchorEl}
                open={open}>
                <Box sx={{
                    backgroundColor:styles.background,
                    border:styles.border,
                    minWidth:'min-content',
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                }}>
                    <Feature feature={r} />
                </Box>
            </Popper>
        </div>)
    return (
        <Meta text={
            <Buttons className={style('buttons', {
                border:'none !important'
            })}>
                {meta}
            </Buttons>}/>
    )

    
}

function Ticks({ ticks }) {
    ticks == null && (ticks = 0)
    return (
        <FeatureProperty label={'ticks'}>
            <SmallMod value={ticks}/>
        </FeatureProperty>
    )
}

function Xp({ xp }) {
    return (
        <FeatureProperty label={'xp'}>
            <SmallMod value={xp}/>
        </FeatureProperty>
    )
}

function Power({ power }) {
    return (
        <FeatureProperty label={'power'}>
            <SmallMod value={power}/>
        </FeatureProperty>
    )

}

function Tags({ tags }) {
    return (
        <FeatureProperty label={'Tags'}>
            <div>
                {tags.length==undefined ?
                    <Meta text={tags.name}/> :
                    tags.map(t=><Meta text={t.name} />)
                }
            </div>
        </FeatureProperty>
    )
}

function Tree({ tree }) {
    return (
        <FeatureProperty label={'tree'}>
            <Meta text={tree}/>
        </FeatureProperty>
    )
}

function Description({ de }) {
    const theme=useTheme()
    return (
        <div className={css`
            font-size:${theme.small+2}px;
            padding:3px;
            overflow:scroll;
        `}>
            {de}
        </div>
    )
}

function Attribute({ attr }) {
    return (
        <FeatureProperty label='attribute'>
            <Meta text={attr.name} />
        </FeatureProperty>
    )
}

function HitDice({ hd }) {
    return (
        <FeatureProperty label={'hit die'}>
            <Meta text={hd} />
        </FeatureProperty>
    )
}

function WeaponProf({ wpn }) {
    return (
        <FeatureProperty label={'weaponry'}>
            <Meta text={wpn} />
        </FeatureProperty>
    )
}

function ArmorProf({ arm }) {
    arm==null && (arm='None')
    return (
        <FeatureProperty label={'armor'}>
            <Meta text={arm} />
        </FeatureProperty>)
}

function Paths({ pths }) {
    return (<FeatureProperty label={'Paths'}>
            {pths.length==undefined ?
                <Meta text={pths.name}/> :
                pths.map(t=><Meta text={t.name} />)
            }
        </FeatureProperty>)
}

function Skills({ skills }) {
    return (
    <FeatureProperty label={'Skills'}>
    {skills.length==undefined ?
        <Meta text={skills.name}/> :
        skills.map(t=><Meta text={t.name} />)
    }
    </FeatureProperty>)
}

function FeatureProperty({label, children}) {
    const theme=useTheme()
    return(
       <>
        <label className={css`
            ${theme.styles.label}
            border-right:${theme.border};
            :not(label:last-of-type) {
                border-bottom:${theme.border};
            }
            padding:0px 5px;
            
        `}>{label}</label>
        <div className={css`
            width:100%;
            >div:only-child {
                display:flex;
                flex-wrap:wrap;
            }
            :not(div:last-child) {
                border-bottom:${theme.border};
            }
            input {
                border:none;
            }
        `}>
            {children}
        </div>
       </>
    )
}

function FeatureData({ feature }) {
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
    return(
        <div className={css`
            display:grid;
            grid-template-columns: min-content auto;
        `}>
            {data}
        </div>
    )}


function ApplicableMeta({meta, feature}) {
return (
    <>
        <FeatureProperty label={'Ranges'}>
            <FeatureMeta meta_list={meta.ranges.pool()} feature={feature}/>
        </FeatureProperty>
        <FeatureProperty label={'Durations'}>
            <FeatureMeta meta_list={meta.durations.pool()} feature={feature}/>
        </FeatureProperty>
    </>
)
}