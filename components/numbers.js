import {style, styles, get_font, reusable} from './styles'
import React, {useState} from 'react'
import { Icon } from './images'
import {LabeledItem} from './containers'
import {Buttons, Button} from './interactive'

export function Bonus({ item, override }) {
    var layout = style('layout', {
        display: 'flex',
        width:'100% !important',
        alignItems: 'baseline',
        justifyContent: 'center',
        "& input[type='number']": {
            maxWidth:'3ch',
            height:'auto'
        }
       
    })
    var cls=style('over', override)
    return (
        <LabeledItem className={cls} childStyles={layout} label={item.label}>
                {item.value < 0 ?
                    <Icon name='minus' sx={{margin:'unset'}} /> :
                    <Icon name='plus' sx={{margin:'unset'}} />}
                <Modifier editable={false} id={item.id} value={Math.abs(item.value)} />
        </LabeledItem>
    )

}

function Modifier({ editable, value, handler = null }) {
    const s = style('modifier', {
        border: 'unset',
        fontSize: styles.big,
        textAlign: 'center',
        position: 'relative',
        appearance: 'textfield',
        width:'100%',
        boxSizing: 'border-box',
        backgroundColor: styles.transparent,
        color: styles.text
    })
    return (<input className={s} type='number' readonly={editable} value={value} />)
}

export function DC({ item }) {
    return (
        <LabeledItem label={item.label}>
            <Modifier editable={item.readonly} id={item.id} value={item.value} />
        </LabeledItem>
    )
}

export function Points({ item }) {
    return (
        <div className='item points'>
            <label>{item.label}</label>
            <Modifier editable={false} id={item.id} value={item.value} />
        </div>
    )
}

export function Tracker({ header, left, right, children, update }) {
    const display = style('tracker', {
        display: 'flex',
        flexDirection:'row',
        height:'auto',
        '& > div': {
            // flex: '1 1 auto',
            width:'50%',
            border:'unset',
            margin:0,
            '& label': {
                ...reusable.boxLabel
            },
            '&:first-child': {
                borderRight:styles.border
            }
        }
    })
   
    return (
        <LabeledItem label={header} childStyles={display}>            
            {left.readOnly ? <DC item={left} /> :  <Counter item={left} update={update} /> }
            {right.readOnly ? <DC item={right} /> :  <Counter item={right} update={update} />}
        </LabeledItem>
    )
}

export function Counter({ item, update }) {
    const increase=update[0]
    const decrease=update[1]
    const display=style('style', {
        height: 'unset !important'
    })
    const layout=style('cols', {
        display:'flex',
        flexDirection:'row-reverse'
    })
    !Object.hasOwn(item, 'min') && (item.min = 0)
    !Object.hasOwn(item, 'max') && (item.max = 999999)
    return (
        <LabeledItem childStyles={layout} label={item.label}>
            <Modifier editable={item.readonly} value={item.value} />
                <Buttons className={display}>
                    <Button name={item.name} min={item.min} path={item.path} max={item.max} type="button" onClick={increase}>
                        <Icon name={'plus'} />
                    </Button>
                    <Button name={item.name} min={item.min} path={item.path} max={item.max} type="button" onClick={decrease}>
                        <Icon name={'minus'} />
                    </Button>
                </Buttons>
        </LabeledItem>)
}