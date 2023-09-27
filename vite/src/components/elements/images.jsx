import { useTheme } from "@emotion/react"
import { css } from "@emotion/css"
import icons from '@assets/icons'

export function Icon({ name, sx = null, size = null, color = null }) {
    const theme = useTheme()
    color == null && (color = theme.text)
    const component = name == undefined ? null : icons[name.split('/')[0]][name.split('/')[1]]
    return (
        <>
            {component != null &&
                <div className={css`
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
    `}>
                    {component()}
                </div>
            }
        </>
    )

}

