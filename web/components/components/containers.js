import React, {useState} from 'react'
import {style, styles, get_font, reusable} from './styles'
import { Button } from './interactive'
import { Icon } from './images'
import { TabList, Tab, Tabs, TabPanel } from 'react-tabs'
import { useTheme } from '@emotion/react'
import { css } from '@emotion/css'
export function OptionList({children}) {
    var display=style('options', {
        display:'list-item',
        listStyleType: 'none',
        border: styles.border,
        padding:5,
        margin: 5,
        width:'auto'
        
    })
    return(
        <div className={display}>
            {children}
        </div>
    )
}

export function Region({ params, children }) {
    const display = style('thumb', {
        gridArea: params,
        '& > *': {
            height: 'inherit',
        }
    })
    return (
        <div className={display}>
            {children}
        </div>
    )
}


export function Snippet({snip, children}) {
    const [open, setOpen]=useState(false)
    function togl() {
        setOpen(!open)
    }
    const snippet=style('snippet', {
        display:'flex',
        justifyContent:'space-between',
        width:'100%',
        '& button': {
            width: 30
        },
        '&[open] svg': {
            transform:'rotate(90deg)'
        }
        
    })
    const content=style('content', {
        zIndex:1,
        backgroundColor:styles.background,
        "& div": {
            justifyContent:'unset',
            whiteSpace:'unset',
        },
        '& > div': {
            marginLeft:0
        }
    })
    return (
        <div>
            <div className={snippet} open={open}>
                {snip}
                <Button onClick={togl}>
                    <Icon name={'right-arrow'} size={20} />
                </Button>
            </div>
            <div className={content} style={{display:(open ? 'block' : 'none')}}>
                {children}
            </div>
        </div>
    )
}

export function Row({children}) {
    const width=100/children.length
    const display=style('row', {
        display:'flex',
        '& > div': {
            width:width+'%'
        }
    })
    return (
        <div className={display}>
            {children}
        </div>
    )
}

export function Page({children, title}) {
    return(
        <>
        <h1>{title}</h1>
        <div>{children}</div>
        </>
    )
}

export function Border({children}) {
    const styled=style('bordered',{
        border:styles.border,
        margin:5
    })
    return (
        <div className={styled}>
            {children}
        </div>
    )
}

export function Grid({children}) {
    const display=style('grid', {
        display:'grid',
        gridTemplateColumns:'repeat(12, auto)',
        gridTemplateRows: 'repeat(12, auto)'
    })
    return(
        <div className={display}>
            {children}
        </div>
    )
}

export function Flex({children}) {
    const display=style('flex', {
        display:'flex'
    })
    return(
        <div className={display}>
            {children}
        </div>
    )
}

export function Default({children}) {
    return (
        <>
            {children}
        </>
    )
}


export function Block({ header, children, key, layout='block', className=null }) {
    function getLayout(desc) {
        const layouts={
            'grid':Grid,
            'flex': Flex,
            'block': Default
        }
        return layouts[desc]
    }
    const display=style('block', {
        border: styles.border,
        margin: 5,
        minHeight:'100%',
        height:'fit-content',
        overflow:'scroll'
    })
    const content = style('content', {
        borderTop: styles.border,
        padding: 5

    })
    var title=style('header', {
        margin:5,
        textTransform: 'uppercase'
    })
    var layout=getLayout(layout)
    return (
        <div key={key} className={display}>
            <h1 className={title}>{header}</h1>
            <div className={[content, className].join(" ")}>
                {children}
            </div>
        </div>
    )
}

export function LabeledItem({ childStyles=null, className=null, label, children }) {
    var box = style('box', {
        border: styles.border,
        margin: '5px',
        position: 'relative',
        width:'auto',
        height:'auto'

    })
    var header = style('header', {
        width: '100%',
        textTransform: 'uppercase',
        padding: '3px',
        textAlign: 'center',
        margin: 'unset',
        borderBottom: styles.border,
        boxSizing: 'border-box',
        display: 'block'
    })
    var content=style('content', {
        width:'auto',
        position: 'relative'
        
    })
    return (
        <div className={[box, className].join(" ")}>
            <label className={header}>{label}</label>
            <div className={[content, childStyles].join(" ")}>
                {children}
            </div>
        </div>)
}



export function Item({ label, children }) {
    const theme=useTheme()
    const labelBelow=css`
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

export function Tabbed({names, children}) {
    return(
        <Tabs>
            <TabList className={style('tab-links', {...reusable.buttons})}>
            {names.map(n=><Tab className={style('tabs', {...reusable.button})}>{n}</Tab>)}
            </TabList>
            {children.map(c=><TabPanel selectedClassName={style('content', {
                border:styles.border
            })}>{c}</TabPanel>)}
        </Tabs>
    )
}