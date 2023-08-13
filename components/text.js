import { Icon } from './images'
import { Button } from './interactive'
import { style, styles, reusable } from './styles'
import React, { useState } from 'react'

export function Textbox({ data, handler }) {
    var display = style('textbox', {
        appearance: 'unset',
        backgroundColor: styles.background,
        border: 'unset',
        height: '100%',
        width: '100%',
        color: styles.text,
        textDecoration: 'italic'
    })
    var cont = style('container', {
        display: 'flex'
    }
    )
    return (
        <div className={cont}>
            <textarea className={display} onChange={handler}></textarea>
        </div>
    )
}

export function SmallHeader({children}) {
    const styled=style('smallheader', {
        fontSize:styles.size+5,
        fontWeight:'bold',
        fontFamily:styles.sans,
        textAlign:'center',
        border:styles.border,
        width:'100%'
    })
    return (
        <div className={styled}>
            {children}
        </div>
    )
}

export function CheckboxItem({ item, hideValue=false, styles=null, name=null, checked = false, handler = null, children }) {
    const styled = style('checkbox', {
        display:'flex',
        width:'100%',
        '& input[type="checkbox"]': {
            verticalAlign:'bottom',
            ...reusable.checkbox,
            ...styles
        }
    })
    return (
        <div className={styled}>
            <input type='checkbox' path={item.path} checked={checked} name={name} value={item.value} onClick={handler} />
            {children}
            <label>{item.label}</label>
        </div>
    )
}

export function SmallMod({ override=null, value }) {
    const styled = style('smallmod', {
        backgroundColor: styles.transparent,
        color: styles.text,
        width: '5ch',
        border: 'unset',
        borderBottom: styles.border,
        appearance: 'textfield',
        textAlign: 'center',
        ...override
    })
    return (<input type={typeof (value) == Number ? 'number' : 'text'} value={value} className={styled} />)
}


export function BigField({ label, data, id, handler }) {
    return (
        <div className='item big'>
            <label>{label}</label>
            <textarea id={id} onChange={handler}>{data}</textarea>
        </div>
    )
}

export function Field({data, handler, size='small', hidden=false, toggleable=false}) {
    const [editable, setEditable]=useState(true)
    const handleToggle = () => {
        setEditable(!editable)
    }
    const display=style('togglefield', {
        display:'flex',
        marginBottom:3,
        position:'relative',
        width:'auto',
        '& input, & textarea': {
            width:'100%',
            height:20,
            border:styles.border,
            backgroundColor:styles.background,
            color:styles.text,
            fontFamily:styles.mono
        },
        '& textarea': {
            height:'6ch'
        },
        '& button': {
            height:'fit-content',
            width:'fit-content',
            position:'absolute',
            right:0,
            top:0,
            margin:0
        }
    })
    return(
        <div className={display}>
            {size=='small' && <input type={hidden ? 'password' : 'text'} disabled={!editable} value={data.text} path={data.path} onChange={handler} />}
            {size=='big' && <textarea disabled={!editable} path={data.path} onChange={handler}>{data.text}</textarea>}
            {toggleable &&
            (<Button onClick={handleToggle}>
                <Icon name='pencil' size={15} />
            </Button>)}
        </div>
    )
}

export function HiddenField({ label, data, handler }) {
    return (
        <div className='item'>
            <label>{label}</label>
            <input type='password' value={data} onChange={handler} />
        </div>
    )
}

export function Metadata({ text }) {
    const styled = style('meta', {
        verticalAlign: 'baseline',
        color: styles.highlight,
        border: styles.border,
        width:'fit-content',
        backgroundColor: styles.selected,
        fontSize: styles.small,
        fontFamily: styles.mono,
        padding: '0px 2px',
        margin: '3px 3px',
        borderRadius: 7})
    return(
        <div className={styled}>{text}</div>
    )
}