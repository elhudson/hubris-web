import React, { useMemo, useRef, useState } from 'react'

import { Button } from './interactive'
import { Icon } from './images'
import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'

export function Textbox({ data, handler }) {
    return (
        <div>
            <textarea onChange={handler}></textarea>
        </div>
    )
}

export function SmallHeader({children}) {
    
    return (
        <div className={styled}>
            {children}
        </div>
    )
}

export function CheckboxItem({ item, checked = false, handler = null, disabled=false, children }) {
    const theme=useTheme()
    return (
        <div className={css`
            width:100%;
            display:flex;
            align-items:flex-end;
            >div {
                width:100%;
            }
            >input:first-child {
                ${theme.styles.checkbox};
                vertical-align:middle;
            }
            >label:last-child {
                display:inline;
                font-size:${theme.size-2}px;
                vertical-align:bottom;
            }   
        `}>
            <input type='checkbox' path={item.path} disabled={disabled} checked={checked} value={item.value} onClick={handler} />
            {children}
            <label>{item.label}</label>
        </div>
    )
}

export function SmallMod({value }) {
    const theme=useTheme()
    return (<input type={typeof (value) == Number ? 'number' : 'text'} value={value} className={css`
        background-color:${theme.transparent};
        color:${theme.text};
        min-width:${theme.size*3}px;
        width: ${theme.size*3}px;
        border:unset;
        border-bottom:${theme.border};
        appearance:textfield;
    `} />)
}

export function Field({data, handler, size='small', hidden=false, toggleable=false}) {
    const theme=useTheme()
    const [editable, setEditable]=useState(true)
    const handleToggle = () => {
        setEditable(!editable)
    }
    return(
        <div className={css`
            position:relative;
            textarea, input {
                border:none;
                width:100%;
                box-sizing:border-box;
                background-color:${theme.background};
            }
            button {
                position:absolute;
                width:fit-content;
                right:0;
                border:none;
            }
            ${editable == true && (css`
                svg {
                    filter:opacity(25%);
                }
            `)}
        `}>
            {size=='small' && <textarea className={css`
                height:20px;
                border-bottom:${theme.border} !important;
            `}disabled={!editable} path={data.path} onBlur={handler}>{data.text}</textarea>}
            {size=='big' && <textarea disabled={!editable} path={data.path} onBlur={handler}>{data.text}</textarea>}
            {toggleable &&
            (<Button onClick={handleToggle}>
                <Icon name='quill' size={14} />
            </Button>)}
        </div>
    )
}

function ShadowInput({data, handler, hidden, editable}) {
    return(
        <>
        <input type={hidden ? 'password' : 'text'} disabled={!editable} path={data.path} onBlur={handler} />
        <input type={hidden ? 'password' : 'text'} disabled={true} value={data.text} />
        </>
    )
}

export function Metadata({ text }) {
    const theme=useTheme()
    return(
        <div className={css`
            vertical-align:baseline;
            color:${theme.highlight};
            border:${theme.border};
            width:fit-content;
            background-color: fade(${theme.selected}, .25);
            font-size:${theme.small}px;
            font-family:${theme.mono};
            padding:0px 2px;
            margin:3px 3px;
            margin-bottom:2px;
            border-radius:7px;
            display:flex;
        `}>
            {text}
        </div>
    )
}