import {style, styles, reusable} from './styles'
import React from "react"
import { createUseStyles } from 'react-jss'
import { Icon } from './images'
export function Buttons({ children, vertical=true, className }) {
    var vert=style('vertical-buttons', {
        display:'block',
        width:'fit-content'
    })
    const display=style('buttons', {
        ...reusable.buttons,
    })
    return (
        <div className={[display, (vert==true && (vert)), className].join(" ")}>
            {children}
        </div>
    )
}


export function Radio({ label, data, onChange=null, readonly=false, vertical=false }) {
    const display = style('radio', {
        display: (vertical ? 'list-item' : 'inline-flex'),
        listStyleType: 'none',
        justifyContent: 'space-evenly',
        width: '100%',
        maxWidth: (vertical ? 'fit-content' : '100%' ),
        whiteSpace:'nowrap',
        margin:'0px 5px'
    })
    return (
        <div className={display}>
            {data.map(item =><RadioItem readOnly={readonly} item={item} isRadio={true} group={label} onChange={onChange} />)}
        </div>)
}

export function RadioItem({item, readOnly, isRadio, group, onChange}) {
    console.log(item.selected)
    var display=style('radio-item', reusable.checkbox)
    return (
        <div>
        <input
            className={display}
            disabled={readOnly}
            onChange={onChange}
            name={group}
            path={item.path}
            defaultValue={item.value}
            type={isRadio ? 'radio':'checkbox'}
            defaultChecked={item.selected}
             />
            <label>{item.label}</label>
        </div>

    )
}


export function Button({ onClick, max=null, table=null, min=null, children, value, path }) {
    var useStyles = createUseStyles({
        button: {
            ...reusable.button
        }
    })
    const b = useStyles()
    return (
        <button type='button' value={value} table={table} max={max} min={min} path={path} className={b.button} onClick={onClick}>
            {children}
        </button>
    )
}

export function Controls({icon, sx=null, children}) {
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
    var entries=Object.keys(data).map(k=>new Object({value:k, label:data[k]}))
    var display = style('dropdown', {
        appearance: 'unset',
        backgroundColor: styles.background,
        color: styles.text,
        border: 'unset',
        height: '100%',
        width: '100%'
    })
    var cont = style('container', {
        border: styles.border,
        display: 'flex',
        height:'auto',
        marginBottom:5
    })
    return (
        <div className={cont}>
            <select className={display} path={path} name={name} onChange={handler}>
                {entries.map(entry=><option value={entry.value} selected={entry.value==selected}>{entry.label}</option>)}
            </select>
        </div>
    )
}