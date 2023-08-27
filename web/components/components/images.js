import React from "react"
import { ReactSVG } from "react-svg"
import { useTheme } from "@emotion/react"
import { css } from "@emotion/css"

export function Icon({ name, sx }) {
    const theme=useTheme()
    var path = `/static/assets/icons/${name}.svg`
    return (
        <ReactSVG className={css`
            ${sx}
            height:fit-content;
            width: fit-content;
            margin: auto;
            svg {
                path, line {
                    fill: ${theme.text};
                    stroke: ${theme.text};
                }
            }
        `} src={path} />
    )}

