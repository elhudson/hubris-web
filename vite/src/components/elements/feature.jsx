import { Button, Label, Buttons } from "@elements/interactive"
import { Item, LabeledItem } from "@elements/containers"
import { Icon } from "./images"
import { Box } from "@mui/material"
import { Popper } from "@mui/base"
import React from "react"
import _ from 'lodash'
import { css } from "@emotion/css"
import { useTheme } from "@emotion/react"
import UsePower from '@elements/caster'

export default function Feature({ feature, meta = null, check = null }) {
    const theme = useTheme()
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
                {check!=null ? check : meta!=null && <UsePower feature={feature} meta={meta} />}
            </FeatureTopbar>
            <FeatureInfo feature={feature} />
            <Description de={feature.description} />
            <ApplicableMeta meta={meta} feature={feature} />
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
                    <Icon name={`tags/${t.name.toLowerCase()}`} />
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
            button {
                position:absolute;
                right:0;
                width:fit-content;
            }
        `}>
            <span>
                {name}
            </span>
            {children}
        </div>
    )
}

export function FeatureTopbar({ feature, children }) {
    var [icon, text] =
        feature.table == 'backgrounds' ? [`backgrounds/${feature.name.toLowerCase()}`, feature.name] :
            feature.table == 'effects' ? [`trees/${feature.tree.toLowerCase()}`, feature.tree] :
                feature.table == 'class_features' ? [`classes/${feature.classes.name.toLowerCase()}`, feature.classes.name] :
                    feature.table == 'tag_features' ? [`tags/${feature.tags.name.toLowerCase()}`, feature.tags.name] :
                        feature.table == 'ranges' || feature.table == 'durations' ? [[`trees/${feature.tree.toLowerCase().split('/')[0]}`, `trees/${feature.tree.toLowerCase().split('/')[1]}`], feature.tree] :
                            [undefined, undefined]
    Object.hasOwn(feature, 'background') && ([icon, text]=[`backgrounds/${feature.background.toLowerCase()}`, feature.background])
    Array.isArray(icon) == false && icon!=undefined && (icon = [icon])
    return (
        <FeatureHeader name={feature.name}>
            {icon != undefined && icon.map(i =>
                <Label content={text}>
                    <Icon
                        name={i}
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

export function FeatureTicks({ ticks }) {
    const theme = useTheme()
    return (
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
                name={'ui/stopwatch'}
                size={16} />
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
        <div className={css`
            button {
                width:fit-content;
            }
        `}>
            {meta_list.map(m => <MetaOption meta={m} />)}
        </div>
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
            {feature.ticks != undefined && feature.ticks != 0 &&
                <FeatureTicks ticks={feature.ticks} />
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

function Description({ de }) {
    const theme = useTheme()
    de != null && de.includes('•') && (de = de.split('•'))
    return (
        <div className={css`
            font-size:${theme.small + 2}px;
            height:${theme.small * 6}px;
            padding:3px;
            overflow:scroll;
            border:${theme.border};
            scrollbar-color: ${theme.muted} ${theme.background};
            scrollbar-width:thin;
            &::-webkit-scrollbar {

            }
        `}>
            {Array.isArray(de) ?
                <div className={css`
                    >div:not(*:first-child) {
                        border:${theme.border};
                        margin:5px;
                        padding:3px;
                        font-style:italic;
                    }
                `}>
                    {de.map(d => <div>{d}</div>)}
                </div> :
                de}
        </div>
    )
}


function ApplicableMeta({ meta, feature }) {
    return (
        <>
         {meta!=null &&
            <div className={css`
                display:flex;
                >div {
                    display:flex;
                    >div {
                        margin:unset;
                        margin-right:5px;
                    }
                }
                
            `}>
                <div>
                    <Label content={'Ranges'}>
                        <Icon name={'ui/distance'} size={20}/>
                    </Label>
                    <FeatureMeta meta_list={meta.ranges.pool().filter(f => f.tree == feature.tree || f.tree.includes(feature.tree))} feature={feature} />
                </div>
                <div>
                    <Label content={'Durations'}>
                        <Icon name={'ui/stopwatch'} size={20}/>
                    </Label>
                    <FeatureMeta meta_list={meta.durations.pool().filter(f => f.tree == feature.tree || f.tree.includes(feature.tree))} feature={feature} />
                </div>
            </div>
        }
        </>
       

    )
}