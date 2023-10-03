import { useState, useEffect } from "react"
import { Icon } from './images'
import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { Menu as MenuBox } from '@mui/base/Menu';
import { MenuButton } from '@mui/base/MenuButton';
import { Dropdown as Drop } from '@mui/base/Dropdown';
import { Box } from '@mui/material';
import { nanoid } from 'nanoid';

import { Modal } from '@mui/base/Modal';
import { Tooltip } from "@nextui-org/react";


export function Buttons({ children }) {
    const theme = useTheme()
    return (
        <div className={theme.styles.buttons}>
            {children}
        </div>
    )
}

export function Label({ content, children }) {
    const theme = useTheme()
    return (
        <Tooltip
            content={content}
            className={css`
                    font-family:${theme.mono};
                    font-size:${theme.small}px;
                    background-color:${theme.background};
                    border:${theme.border};
                    font-style:italic;
                    border-radius:3px;
                    box-shadow:${theme.shadow};
                    width:fit-content;
                   

            `}>
            <div>
                {children}
            </div>
        </Tooltip>
    )
}

export function Alert({ msg }) {
    const theme = useTheme()
    const [visible, setVisible] = useState(true)
    useEffect(() => {
        setInterval(() => {
            setVisible(false)
        }, 3000)
    })
    return (
        <div className={css`
            ${theme.styles.box}
            display:${visible ? 'block' : 'none'};
        `}>
            {msg}
        </div>
    )
}

export function Popup({ preview, children }) {
    const theme = useTheme()
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
        document.querySelectorAll('input, button, textarea').forEach((item) => {
            item.disabled = !open
        })
    };
    return (
        <>
            <Button onClick={handleOpen}>{preview}</Button>
            <Modal
                open={open}>
                <Box className={css`
                    width:200px;
                    margin:auto;
                    top:50%;
                    left:50%;
                    position:absolute;
                    border-radius:5px;
                    transform:translate(-50%, 50%);
                    ${theme.styles.box}
                    h1 {
                        position:absolute;
                        left:0;
                        top:0;
                        margin:0;
                        font-size:${theme.size}px;
                        text-transform:uppercase;
                        font-family:${theme.mono};
                        border-bottom:${theme.border};
                        margin:5px;

                    }
                `}>
                    <button onClick={handleOpen} className={css`
                        background-color:${theme.transparent};
                        border: none;
                        float:right;
                        margin:5px;
                        padding:0px;
                        &:hover {
                            cursor: pointer;
                        }
                    `}>
                        <Icon name={'ui/cancel'} size={12} color={theme.red} />
                    </button>
                    {children}
                </Box>
            </Modal>

        </>
    )
}

export function Overlay({ open }) {
    return (
        <div className={open ? css`
            background-color:#000;
            position:absolute;
            width:100%;
            height:100%;
        ` : css`
            display:none;
        `} />
    )
}


export function Radio({ label, data, icons = false, onChange = null, vertical = false, readonly = false }) {
    const theme = useTheme()
    const uniqLabel = label + '_' + nanoid()
    const horizontalCss = css`
        display:flex;
        justify-content: space-between;
    `
    const verticalCss = css`
        display:list-item;
        list-style:none;
        border-bottom:none;
    `

    return (
        <div className={css`
            ${theme.styles.text}
            ${vertical ? verticalCss : horizontalCss}
            margin:3px 0px;
        `}>
            {data.map(item =>
                <RadioItem
                    readOnly={readonly}
                    icon={icons}
                    item={item}
                    isRadio={true}
                    group={uniqLabel}
                    onChange={onChange}
                />
            )}
        </div>)
}

export function RadioItem({ item, icon = false, readOnly, isRadio, group, onChange }) {
    const theme = useTheme()
    icon != false && (icon = icon + '/' + item.value.toLowerCase())
    return (
        <div>
            <input
                className={theme.styles.checkbox}
                disabled={readOnly}
                onChange={onChange}
                name={group}
                path={item.path}
                defaultValue={item.value}
                type={isRadio ? 'radio' : 'checkbox'}
                checked={item.selected}
            />
            {icon ? <Icon name={icon} /> : item.label}
        </div>

    )
}

export function InnerButton({ onClick, max = null, table = null, min = null, children, value, path }) {
    const theme = useTheme()
    return (
        <button className={css`
            appearance:none;
            width: 100%;
            border: ${theme.border};
            background-color: ${theme.transparent};
            text-transform: uppercase;
            font-family:${theme.mono};
            font-size: ${theme.small}px;
            :has(svg) {
                font-size:${theme.size}px;
            }
            svg {
                height:${theme.size}px;
                width: ${theme.size}px;
                vertical-align: middle;
            }
            * {
                pointer-events:none;

            }
            :hover {
                cursor: pointer;
                background-color: ${theme.hover};
            }
        `}
            type='button'
            value={value}
            table={table}
            max={max}
            min={min}
            path={path}
            onClick={onClick}>
            {children}
        </button>
    )
}

export function Button({ hover = null, ...props }) {
    return (
        <>
            {hover ?
                <Label content={hover}>
                    <InnerButton {...props}>
                        {props.children}
                    </InnerButton>
                </Label> :
                <InnerButton {...props}>
                    {props.children}
                </InnerButton>
            }
        </>
    )
}



export function Toggles({ item, increaser, decreaser }) {
    const theme = useTheme()
    return (
        <div className={css`
            ${theme.styles.buttons};
            display:flex;
            border:none;
            border-left: ${theme.border};
            flex-direction:column;
            width:${theme.big}px;
            position: absolute;
            right:0;
            button {
                border:unset;
                width:100%;
                :first-child {
                    border-bottom:${theme.border};
                } 
            }`
        }>
            <Button name={item.name} min={item.min} path={item.path} max={item.max} type="button" onClick={increaser}>
                <Icon name={'ui/up'} />
            </Button>
            <Button name={item.name} min={item.min} path={item.path} max={item.max} type="button" onClick={decreaser}>
                <Icon name={'ui/down'} />
            </Button>
        </div>)
}

export function Controls({ icon, children }) {
    const theme = useTheme()
    var content = children.length > 1 ? <Buttons vertical={false}>{children}</Buttons> : { children }
    return (
        <div className={css`
            display:flex;
            border:${theme.border};
            margin:5px;
            button {
                height:100%;
            }
            >div:first-child {
                margin:0px 3px;
            }
            >div:last-child {
                width:100%;
                height:unset;
                border:none;
                border-left:${theme.border};
            }
            svg {
                height:${theme.size}px;
                width: ${theme.size}px;
            }
        `}>
            <Icon name={icon} />
            {content}
        </div>
    )
}

export function Dropdown({ name, path, data, handler, selected = null }) {
    const theme = useTheme()
    var entries = Object.keys(data).map(k => new Object({ value: k, label: data[k] }))
    return (
        <div className={css`
            border-bottom:${theme.border};
        `}>
            <select className={css`
                appearance:none;
                background-color: ${theme.background};
                color:${theme.text};
                border: none;
                padding: 0px;
                width: 100%;
                font-size:${theme.size - 2}px;
                font-family: ${theme.mono};
            `} path={path} name={name} onChange={handler} disabled={handler == null}>
                {entries.map(entry => <option value={entry.value} selected={entry.value == selected}>{entry.label}</option>)}
            </select>
        </div>
    )
}

export function Menu({ icon, children }) {
    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        setOpen(!open)
    }
    const theme = useTheme()
    return (
        <Drop open={open}>
            <MenuButton
                onClick={handleOpen}
                className={css`
                    ${theme.styles.button}
                    width:fit-content;
                `}>
                {icon}
            </MenuButton>
            <MenuBox className={css`
                    background-color:${theme.background};
                    border:${theme.border};
                    border-radius:5px;
                    margin:10px !important;
                    .MuiMenu-listbox {
                        padding:0px;
                        margin:0px;
                        box-shadow:${theme.shadow};
                    }
                    .MuiMenuItem-root {
                        list-style-type: none;
                        ${theme.styles.button};
                        font-size:${theme.small + 2}px;
                        padding:3px;
                        margin:2px;
                        :hover {
                            cursor: pointer;
                            background-color:${theme.hover};
                        }
                    }
                `}>
                {children}
            </MenuBox>
        </Drop>

    )
}