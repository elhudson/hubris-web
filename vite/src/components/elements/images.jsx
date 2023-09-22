import { ReactSVG } from "react-svg"
import { useTheme } from "@emotion/react"
import { css } from "@emotion/css"

export function Icon({ path, sx = null, size = null, color=null }) {
    const theme = useTheme()
    try {
        if (Object.hasOwn(path, 'default')) {
            path = path.default
        }
    }
    catch { Error }
    color==null && (color=theme.text)
    return (
        <ReactSVG
            className={css`
                height:fit-content;
                width: fit-content;
                margin: auto; 
                pointer-events:none;
                * {
                    pointer-events:none;
                }
                svg {
                    height:${size}px !important;
                    width:${size}px !important;
                    path, line {
                        fill: ${color};
                        stroke: ${color};
                    }
                }
                ${sx}
            `}
            src={path} />
    )
}

