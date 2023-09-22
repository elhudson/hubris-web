import React, { useState } from 'react'
import { Icon } from './images'
import { LabeledItem } from './containers'
import { Toggles } from './interactive'
import { useTheme } from '@emotion/react'
import { css } from '@emotion/css'
import plus from '@assets/icons/plus.svg'
import minus from '@assets/icons/minus.svg'
export function Bonus({ item }) {
    const theme = useTheme()
    return (
        
            <div className={css`
                display:flex;
                justify-content:center;
                border-bottom: ${theme.border};
                input {
                    border-bottom:none;
                }
                *:first-child {
                    margin-right:unset;
                    margin-left:unset;
                }
                svg {
                    height:${theme.big * .7}px;
                    width:${theme.big * .7}px;
                    
                }
            `}>
                {item.value < 0 ?
                    <Icon path={minus} /> :
                    <Icon path={plus} />}
                <Modifier editable={false} id={item.id} value={Math.abs(item.value)} />
            </div>
    )

}

export function Modifier({ value }) {
    const theme = useTheme()
    return (<input className={css`
        font-size: ${theme.big}px !important;
        min-width: ${theme.big * 2}px;
        appearance: none;
        border:none;
        -moz-appearance:textfield;
        height: fit-content;
        justify-content:space-around;
        display:flex;
        border-bottom: ${theme.border};
        color: ${theme.text};
        background-color:${theme.transparent};
        text-align:center;
        max-width:${theme.big * 2}px;
    `} type={typeof(value)==Number ? 'number':'text'} disabled={true} readonly={true} value={value} />)
}

export function DC({ item }) {
    return (
        <LabeledItem sx={css`
            input {
                margin:auto;
                border-bottom:none;
            }
        `} label={item.label}>
            <Modifier value={item.value} />
        </LabeledItem>
    )
}

export function Points({ item }) {
    return (
        <div>
            <label>{item.label}</label>
            <Modifier value={item.value} />
        </div>
    )
}

export function Tracker({left, right, update }) {
    const theme = useTheme()
    return (
            <div className={
            css`
                display:flex;
                border:${theme.border};
                input { 
                        border-bottom:${theme.border};
                        max-width:unset;
                        width:100%;
                        margin:auto;
                    }
                &:first-child div:only-child {
                    label{
                        border-top:1px solid #000;
                    }
                }
                >div:not(div:only-child) {
                    width:50%;
                    input[type='number'] {
                            margin:auto;
                        }
                    &:first-child {
                        border-right:${theme.border};
                        
                        >*>div:last-child {
                            border-left:${theme.border} !important;
                        }
                    }
                    &:last-child {
                        input {
                            border-bottom: ${theme.border};
                            box-sizing:border-box;
                            max-width:unset;
                            width:100%;
                        }
                    }
                }
                label {
                    ${theme.styles.label};
                    text-align:center;
                }
                
            `}>
                <div>
                    {left.readOnly ? <Modifier value={left.value} /> : <Counter item={left} update={update} />}
                    <label>{left.label}</label>
                </div>
                <div>
                    {right.readOnly ? <Modifier value={right.value} /> : <Counter item={right} update={update} />}
                    <label>{right.label}</label>
                </div>

            </div>
    )
}

export function Counter({ item, update }) {
    const theme=useTheme()
    !Object.hasOwn(item, 'min') && (item.min = 0)
    !Object.hasOwn(item, 'max') && (item.max = 999999)
    return (
        <div className={css` 
               display:flex;
               position:relative;
               justify-content:center;
               border-bottom:${theme.border};
               input {
                    border-bottom:none;
               }
            `}>
            <Modifier value={item.value} />
            <Toggles item={item} increaser={update[0]} decreaser={update[1]} />
        </div>
    )
}

