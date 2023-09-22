import { Button, Label, Buttons } from "@elements/interactive"
import { Item, LabeledItem } from "@elements/containers"
import { Metadata as Meta, SmallMod } from "@elements/text"
import { Icon } from "./images"
import { Box } from "@mui/material"
import { Popper } from "@mui/base"
import React from "react"
import _ from 'lodash'
import { css } from "@emotion/css"
import { useTheme } from "@emotion/react"
import UsePower from '@elements/caster'

import * as tag_icons from '@assets/icons/tags'
import * as tree_icons from '@assets/icons/trees'
import * as class_icons from '@assets/icons/classes'
import stopwatch from '@assets/icons/stopwatch.svg'

export default function Feature({ feature, meta = null, check = null }) {
    const theme = useTheme()
    if (feature.description == undefined && feature.feature != undefined) {
        feature.description = feature.feature.split(':')[1]
        feature.name = feature.feature.split(':')[0]
    }
    return (
        <div className={css`
            width:${check != null && '200px'};
            border:${theme.border};
            margin:5px;
            >div {
                margin:5px;
            }
        `}>
            <FeatureTopbar feature={feature}>
                {check}
            </FeatureTopbar>
            <FeatureInfo feature={feature}/>
            <Description de={feature.description}/>
        </div>
    )
}

export function FeatureTags({ tags }) {
    tags = tags.map(t => ruleset.tags[t.id])
    return (
        <div className={css`
            margin-right:5px;
            display:flex;
            >div {
                margin:0px;
            }
            svg {
                display:inline;
                margin:0px 5px 0px 0px;
                width:15px !important;
                height:15px !important;
            }
        `}>
            {tags.map(t =>
                <Label content={t.name}>
                    <Icon path={tag_icons[t.name.toLowerCase()]} />
                </Label>)}
        </div>
    )
}

export function FeatureHeader({ name, children }) {
    const theme = useTheme();
    return (
        <div className={css`
            text-transform:uppercase;
            font-weight:bold;
            font-size:${theme.size - 3}px;
            span {
                display:inline;
                vertical-align:middle;
                margin:auto 0px;
            }
            position:relative;
            border-bottom:${theme.border};
            padding-bottom:5px;
            display:flex;
            flex-direction:row-reverse;
            justify-content:left;
        `}>
            <span>
                {name}
            </span>
            {children}
        </div>
    )
}

export function FeatureTopbar({ feature, children }) {
    var [icon, text]=
        feature.table=='effects' ? [tree_icons[feature.tree.toLowerCase()], feature.tree]  :
        feature.table=='class_features' ? [class_icons[feature.classes.name.toLowerCase()], feature.classes.name] :
        feature.table=='tag_features' ? [tag_icons[feature.tags.name.toLowerCase()], feature.tags.name] :
        feature.table=='ranges' || feature.table=='durations' ? [[tree_icons[feature.tree.toLowerCase().split('/')[0]], tree_icons[feature.tree.toLowerCase().split('/')[1]]], feature.tree] : null
    Array.isArray(icon)==false && (icon=[icon])
    return (
        <FeatureHeader name={feature.name}>
            {icon!=null && icon.map(i=>
                <Label content={text}>
                    <Icon
                        path={i}
                        size={16}
                        sx={css`
                            svg {
                                margin-right:5px;
                            }
                        `}
                    />
                </Label>)
            }
            {children}
        </FeatureHeader>
    )
}

export function FeatureTicks({ticks}) {
    const theme=useTheme()
    return(
        <div className={css`
            font-size:${theme.size}px;
            font-family:${theme.mono};
            display:flex;
            >div {
                margin-right:3px;
            }
            border-bottom:${theme.border};
        `}>
            <Icon 
                path={stopwatch}
                size={16}/>
            {ticks}
        </div>
    )
}

export function Checkbox({ feature, handler }) {
    const theme = useTheme()
    return (
        <input
            className={css`
                ${theme.styles.checkbox}
                position:absolute;
                right:0;
                top:0;
            `}
            type='checkbox'
            cost={feature.xp}
            checked={feature.bought}
            disabled={!feature.buyable}
            table={feature.table}
            path={feature.path}
            onChange={handler}
            value={feature.id} />
        )
    }

export function FeatureMeta({ meta_list }) {
    return (
        <Buttons>{meta_list.map(r =>
            <MetaOption meta={r} />)}
        </Buttons>
    )
}

export function FeaturePower({ power }) {
    const theme = useTheme()
    return (
        <div className={css`
            border:${theme.border};
            border-radius:100%;
            font-size:${theme.size}px;
            font-family:${theme.mono};
            height:${theme.size + 3}px;
            width:${theme.size + 3}px;
            text-align:center;
        `}>
            {power}
        </div>
    )
}

export function FeatureInfo({ feature }) {
    return (
        <div className={css`
            display:flex;
            justify-content:space-between;
        `}>
            {feature.tags != undefined && Array.isArray(feature.tags) &&
                <FeatureTags tags={feature.tags} />
            }
            {feature.ticks != undefined && feature.ticks!=0 &&
                <FeatureTicks ticks={feature.ticks}/>
            }
            {feature.power != undefined && <FeaturePower power={feature.power} />}        
        </div>
    )
}

export function MetaOption({ meta }) {
    const theme = useTheme()
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
    };
    return (<>
        <Button onClick={handleClick}>{meta.name}</Button>
        <Popper
            id={meta.id}
            anchorEl={anchorEl}
            open={open}>
            <Box className={css`
                padding:0px;
                margin:0px;
                z-index: 3;
                ${theme.styles.box}
            `}>
                <Feature feature={meta} />
            </Box>
        </Popper>
    </>)
}

function Ticks({ ticks }) {
    ticks == null && (ticks = 0)
    return (
        <FeatureProperty label={'ticks'}>
            <SmallMod value={ticks} />
        </FeatureProperty>
    )
}

function Xp({ xp }) {
    return (
        <FeatureProperty label={'xp'}>
            <SmallMod value={xp} />
        </FeatureProperty>
    )
}

function Power({ power }) {
    return (
        <FeatureProperty label={'power'}>
            <SmallMod value={power} />
        </FeatureProperty>
    )

}

function Tags({ tags }) {
    return (
        <FeatureProperty label={'Tags'}>
            <div>
                {tags.length == undefined ?
                    <Meta text={tags.name} /> :
                    tags.map(t => <Meta text={t.name} />)
                }
            </div>
        </FeatureProperty>
    )
}

function Tree({ tree }) {
    return (
        <FeatureProperty label={'tree'}>
            <Meta text={tree} />
        </FeatureProperty>
    )
}

function Description({ de }) {
    const theme = useTheme()
    return (
        <div className={css`
            font-size:${theme.small + 2}px;
            height:${theme.small*6}px;
            padding:3px;
            overflow:scroll;
            border:${theme.border};
            scrollbar-color: ${theme.muted} ${theme.background};
            scrollbar-width:thin;
            &::-webkit-scrollbar {

            }
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
    arm == null && (arm = 'None')
    return (
        <FeatureProperty label={'armor'}>
            <Meta text={arm} />
        </FeatureProperty>)
}

function Paths({ pths }) {
    return (<FeatureProperty label={'Paths'}>
        {pths.length == undefined ?
            <Meta text={pths.name} /> :
            pths.map(t => <Meta text={t.name} />)
        }
    </FeatureProperty>)
}

function Skills({ skills }) {
    return (
        <FeatureProperty label={'Skills'}>
            {skills.length == undefined ?
                <Meta text={skills.name} /> :
                skills.map(t => <Meta text={t.name} />)
            }
        </FeatureProperty>)
}

function FeatureProperty({ label, children }) {
    const theme = useTheme()
    return (
        <>
            <div className={css`
                border-right:${theme.border};
                padding-left:5px;
                padding-right:5px;
                &:not(:nth-last-child(2)) {
                    border-bottom:${theme.border};
                }
            `
            }>
                <label className={css`
                ${theme.styles.label}
                height:fit-content;
                display:inline;
                margin:auto;
                `}>
                    {label}
                </label>
            </div>
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

function FeatureData({ feature, showXp = true }) {
    const theme = useTheme()
    var haveable = Object.keys(feature)
    var data = new Array();
    haveable.forEach((prop) => {
        prop == 'tags' && data.push(<Tags tags={feature.tags} />)
        prop == 'power' && data.push(<Power power={feature.power} />)
        // (prop == 'xp' && showXp==true) && data.push(<Xp xp={feature.xp} />)
        prop == 'tree' && data.push(<Tree tree={feature.tree} />)
        prop == 'ticks' && data.push(<Ticks ticks={feature.ticks} />)
        prop == 'weapon_proficiencies' && data.push(<WeaponProf wpn={feature.weapon_proficiencies} />)
        prop == 'armor_proficiencies' && data.push(<ArmorProf arm={feature.armor_proficiencies} />)
        prop == 'class_paths' && data.push(<Paths pths={feature.class_paths} />)
        prop == 'skills' && data.push(<Skills skills={feature.skills} />)
        prop == 'hit_die' && data.push(<HitDice hd={feature.hit_die} />)
        prop == 'attributes' && data.push(<Attribute attr={feature.attributes} />)
    })
    return (
        <div className={css`
            border:${theme.border};
            display:grid;
            grid-template-columns: min-content auto;
        `}>
            {data}
        </div>
    )
}


function ApplicableMeta({ meta, feature }) {
    return (
        <div>
            <Item label={'Ranges'}>
                <FeatureMeta meta_list={meta.ranges.pool().filter(f => f.tree == feature.tree || f.tree.includes(feature.tree))} feature={feature} />
            </Item>
            <Item label={'Durations'}>
                <FeatureMeta meta_list={meta.durations.pool().filter(f => f.tree == feature.tree || f.tree.includes(feature.tree))} feature={feature} />
            </Item>
        </div>
    )
}