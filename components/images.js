import React from "react"
import { ReactSVG } from "react-svg"
import {styles, style } from './styles'

export function Icon({ name, size = styles['size-img'] }) {
    var path = `/static/assets/icons/${name}.svg`
    var styled = style('icon', {
        height: size,
        maxHeight: size,
        margin:'auto',
        '& div, & svg': {
            height: 'inherit',
            maxHeight: 'inherit',
            width: 'inherit',
            maxWidth: 'inherit'
        },
        '& svg': {
            '& path, & line': {
                fill: styles.text,
                stroke: styles.text
            }
        }
    })
    return (
        <ReactSVG className={styled} src={path} />
    )
}

