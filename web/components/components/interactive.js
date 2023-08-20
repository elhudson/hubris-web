import {style, styles, reusable} from './styles'
import React from "react"
import { createUseStyles } from 'react-jss'
import { Icon } from './images'
import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
export function Buttons({ children, vertical=true }) {
    const theme=useTheme()
    return (
        <div className={css`
        display:flex;
        border:${theme.border};
            button {
                margin:unset;
                padding:unset;
                border:none;
                border-right: ${theme.border};
                &:last-child {
                    border-right:none;
                }
            }
        `
        }>
            {children}
        </div>
    )
}


export function Radio({ label, data, onChange=null, readonly=false }) {
    const theme=useTheme()
    return (
        <div className={css`
            ${theme.styles.text}
            display:flex;
            justify-content: space-between;
        `}>
            {data.map(item =>
                <RadioItem readOnly={readonly} item={item} isRadio={true} group={label} onChange={onChange} />
            )}
        </div>)
}

export function RadioItem({item, readOnly, isRadio, group, onChange}) {
    const theme=useTheme()
    return (
        <div>
        <input
            className={theme.styles.checkbox}
            disabled={readOnly}
            onChange={onChange}
            name={group}
            path={item.path}
            defaultValue={item.value}
            type={isRadio ? 'radio':'checkbox'}
            defaultChecked={item.selected}
            checked={readOnly && item.selected ? true:false}
             />
        <label>
            {item.label}
        </label>
        </div>

    )
}


export function Button({ onClick, max=null, table=null, min=null, children, value, path }) {
    const theme=useTheme()
    return (
        <button className={css`
            appearance:none;
            width: 100%;
            border: ${theme.border};
            background-color: ${theme.background};
            text-transform: uppercase;
            font-weight: bold;
            svg {
                height:${theme.size}px;
                width: ${theme.size}px;
                vertical-align: middle;
            }
            :hover {
                cursor: pointer;
                background-color: ${theme.hover};
            }
        `}
         type='button' value={value} table={table} max={max} min={min} path={path} onClick={onClick}>
            {children}
        </button>
    )
}

export function Controls({icon, children}) {
    var content=children.length>1 ? <Buttons vertical={false}>{children}</Buttons> : {children}
    var display=style('controls', {
        display:'flex',
        zIndex:2,
        margin:'auto',
        fontFamily:styles.mono,
        ...sx,
        backgroundColor:styles.background,
        width:'fit-content',
        '& > div:first-child': {
            padding: '0px 3px'
        },
        '& > div:last-child': {
            border:'unset'
        },
        '& button': {
            width:'fit-content',
            padding:'0px 3px !important'
        },
       border:styles.border
    })
        return(
            <div className={display}>
                <Icon name={icon} size={15} />
                {content}
            </div>
        )
    
}

export function Dropdown({ name, path, data, handler, selected = null }) {
    const theme=useTheme()
    var entries=Object.keys(data).map(k=>new Object({value:k, label:data[k]}))
    return (
        <div className={css`
            border-bottom:${theme.border};
        `}>
            <select className={css`
                appearance:none;
                background-color: ${theme.background};
                border: none;
                padding: 0px;
                width: 100%;
                font-size:${theme.size-2}px;
                font-family: ${theme.mono};
            `} path={path} name={name} onChange={handler}>
                {entries.map(entry=><option value={entry.value} selected={entry.value==selected}>{entry.label}</option>)}
            </select>
        </div>
    )
}