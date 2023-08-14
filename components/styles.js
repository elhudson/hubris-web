import {default as styles} from './styles/_styles.module.scss';
import { createUseStyles } from 'react-jss'
import React from 'react'

function style(ref, data) {
    const useStyles = createUseStyles({
        [ref]: data
    })
    var res = useStyles()
    return res[ref]
}

function get_font(font) {
    return Number(font.split('p')[0])
}

const reusable={
    checkbox:{
        appearance: 'unset',
        height: styles.size,
        width: styles.size,
        border: styles.border,
        "&:checked, & [aria-selected='true']": {
            fill: styles.text,
            backgroundColor: styles.text
        }
    },
    button: {
            fontWeight: 'bold',
            listStyleType:'none',
            whiteSpace: 'nowrap',
            color: styles.highlight,
            height:'100%',
            cursor:'pointer',
            textTransform: 'uppercase',
            verticalAlign: 'baseline',
            textAlign: 'center',
            padding: '0px 3px',
            margin: '0px 5px',
            border: styles.border,
            backgroundColor: styles.transparent,
            width: '100%',
            zIndex:1,
            '&:hover': {
                backgroundColor: styles.hover
            },
            '& svg, & div': {
                pointerEvents:'none'
            }
    },
    buttons:{
        position:'relative',
        top:0,
        left:0,
        border: styles.border,
        width: '100%',
        display: 'flex',
        height:'100%',
        padding:0,
        '& button, & li': {
            border: 'none',
            borderLeft: styles.border,
            borderBottom: 'none',
            margin: 'unset',
            padding: 'unset',
            maxHeight: '100%',
            '&:last-child': {
                borderRight: styles.border
            }
        }
    },
    boxLabel: {
        position:'absolute',
        width:'fit-content',
        top:0,
        right:0,
        fontWeight:'bold',
        fontSize:styles.small,
        color:styles.muted,
        borderLeft:styles.border,
        borderBottom:styles.border,
        zIndex:1,
        backgroundColor:styles.background
    }
}

export {style, get_font, styles, reusable}