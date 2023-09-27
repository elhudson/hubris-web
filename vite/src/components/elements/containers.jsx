import React, { useState } from 'react'
import { Button } from '@elements/interactive'
import { Icon } from '@elements/images'
import { TabList, Tab, Tabs, TabPanel } from 'react-tabs'
import { useTheme } from '@emotion/react'
import { css } from '@emotion/css'

export function OptionList({ children }) {
    return (
        <div className={css`
            padding-bottom:5px;
        `}>
            {children}
        </div>
    )
}

export function Region({ children }) {
    return (
        <div className={display}>
            {children}
        </div>
    )
}

export function Snippet({ snip, sx = null, children }) {
    const theme = useTheme()
    const [open, setOpen] = useState(false)
    function togl() {
        setOpen(!open)
    }
    return (
        <div>
            <div open={open} className={css`
                border:${theme.border};
                margin:5px;
                display:flex;
                >text {
                    text-transform:uppercase;
                    width:100%;
                    font-weight:bold;
                    padding:5px;
                    
                }
                input[type='text'] {
                        width:100%;
                        text-align:left !important;
                    }
                button {
                    border:none;
                    width:fit-content;
                    svg {
                        transform:scaleX(-1);
                        ${open == true && (css`{
                            transform:scale(-1, -1)
                        }`)}
                    }
                }
            `}>
                {snip}
                <Button onClick={togl}>
                    <Icon name={'ui/manicule'} size={20} />
                </Button>
            </div>
            <div className={css`
                ${sx}
                border:${theme.border};
                margin:5px;
            `} style={{ display: (open ? 'block' : 'none') }}>
                {children}
            </div>
        </div>
    )
}

export function Row({ children }) {

    return (
        <div >
            {children}
        </div>
    )
}

export function Block({ header, children, layout = 'block' }) {
    const theme = useTheme()
    return (
        <div className={css`
            h2:empty {
                display:none;
            }
        `}>
            <h2 className={css`
                border:${theme.border};
                text-align:center;
            `}>{header}</h2>
            <div className={css`
                ${theme.layouts[layout]}
                border:${theme.border};
                padding:5px;
            `}>
                {children}
            </div>
        </div>
    )
}

export function LabeledItem({ label, children, sx = null }) {
    const theme = useTheme()
    return (
        <div className={css`
            border:${theme.border};
            height:fit-content;
            margin:5px;
            input {
                text-align:center;
                vertical-align:bottom;
            }
            ${sx}

        `}>
            <label className={css`
                ${theme.styles.label}
                width: 100%;
                border-bottom:${theme.border};
                font-size: ${theme.small + 3}px;
                text-align: center;
            `}>{label}</label>
            <div className={css`
            >div {
                border:none !important;
                
            }
            `}>
                {children}
            </div>
        </div>)
}

export function Item({ label, children }) {
    const theme = useTheme()
    const labelBelow = css`
        margin:5px;
        button {
            display: block;
        }
        input[type='text'], text {
            ${theme.styles.text};
        }`
    return (
        <div className={labelBelow}>
            {children}
            <label className={theme.styles.label}>{label}</label>
        </div>
    )
}

export function Tabbed({ names, menus = null, children }) {
    const [selected, setSelected] = React.useState(0)
    return (
        <Tabs onSelect={(index) => setSelected(index)} className={css`
            display:flex;
            .react-tabs__tab-panel--selected {
                width:100%;
            }
            .react-tabs__tab-list {
                width:fit-content;
                padding:0px;
                list-style-type:none;
                white-space:nowrap;
                margin-left:0px;
                margin-right:10px;
                margin-top:0px;
                >button {
                    position:relative;
                    float:right;
                }
                li[role='tab'] {
                    height:unset;
                    text-align:right;
                    text-transform:uppercase;
                    font-weight:bold;
                    &[aria-selected=true] {
                        text-decoration:underline;
                        text-underline-offset:3px;
                        font-style:italic;
                    }
                }
            }
        `}>
            <TabList>
                {names.map(n => <Tab>{n}</Tab>)}
                {menus != null && menus[selected]}
            </TabList>
            {children.map(c => <TabPanel>{c}</TabPanel>)}
        </Tabs>
    )
}

