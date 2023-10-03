import { css } from "@emotion/css"

function makeTheme(th) {
    const theme = {
        ...th,
        hover: th.muted.fade(0.05),
        behind: th.background.darken(0.5),
        selected: th.muted.fade(0.8),
        highlight: th.text.fade(0.2),
        line: th.size * 1.2,
        big: th.size * 2,
        small: th.size * .7,
        border: `1px solid ${th.muted}`,
        transparent: 'rgba(0, 0, 0, 0)',
        icon: th.text,
        shadow:  'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
    }
    Object.entries(theme).filter(f => isColor(f)).forEach((item) => {
        theme[item[0]] = item[1].hex()
    })
    return theme
}

function makeStyles(theme) {
    const styles = {
        disabled: css`
            opacity:0.5;
        `,
        hidden: css`
            display:none;
        `,
        box: css`
            background-color:${theme.background};
            border:${theme.border};
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        `,
        checkbox: css`
            height: ${theme.size}px;
            width: ${theme.size}px;
            appearance: none;
            border:${theme.border};
            border-radius: 100%;
            &:hover {
                background-color:${theme.text};
                opacity:60%;
            }
            &:disabled {
                pointer-events:none;
            }
            :checked {
                background-color:${theme.text};
                border:unset;
            }`,
        label: css`
            display: block;
            text-transform:uppercase;
            font-weight: bold;
            font-size: ${theme.small}px;
        `,
        text: css`
            border:none;
            width: 100%;
            display: inherit;
            font-size: ${theme.size - 2}px;
            border-bottom:${theme.border};
        `,
        button: css`
            background-color:${theme.transparent};
            border:${theme.border};
            border-radius:5px;
            font-family:${theme.mono};
            text-transform:uppercase;
            &:disabled:hover {
                cursor:not-allowed;
            }
        `,
        buttons: css`
            display:flex;
            border:${theme.border};
            height:100%;
            >* {
                margin:unset;
                padding:unset;
                height:100%;
                border:none;
                border-right: ${theme.border};
                &:last-child {
                    border-right:none;
                }
            }
        `
    }
    return styles

}

function isColor(obj) {
    return Object.keys(obj[1].__proto__).includes('hex')
}

const layouts = {
    flex: css`
        display:flex;
        width:100%;
    `,
    block: css`
        display:block;
    `
}

export default function theme(base) {
    const theme = makeTheme(base)
    const styles = makeStyles(theme)
    theme.styles = styles
    theme.layouts = layouts
    return theme
}

