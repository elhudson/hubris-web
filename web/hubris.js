import React, { useContext } from "react";
import Ruleset from "./models/ruleset";
import { createRoot } from 'react-dom/client'
import { css } from '@emotion/css'
import { Global, ThemeProvider, useTheme } from "@emotion/react";
import Color from "color";

const root = createRoot(document.getElementById('page'))
var page = window.location.pathname
page == '/' && (page = '/login')
const content = await import(`./pages${page}`)
await Ruleset.load()

const themes = {
    plain: {
        background: Color('#ffffff'),
        text: Color('#000000'),
        muted: Color('#a9a9a9'),
        light: Color('#eeeeee'),
        size:14,
        mono: 'IBM Plex Mono',
        sans: 'IBM Plex Sans'
    },
    gruvbox: {
        light: {
            'background': Color('#F2E5BC'),
            'text': Color('#282828'),
            'muted': Color('#A89984'),
            'light': Color('#7C6F64'),
            'size': 14,
            'mono': 'IBM Plex Mono',
            'sans': 'IBM Plex Sans'
        }
    }
}

function theme(th) {
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
        icon: th.text
    }
    const styles = {
        checkbox: css`
            height: ${theme.size}px;
            width: ${theme.size}px;
            appearance: none;
            border: ${theme.border};
            border-radius: 100%;
            :checked {
                background-color:${theme.text.hex()};
            }
            `,
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
            font-size: ${theme.size-2}px;
            border-bottom:${theme.border};
        `
    }
    Object.entries(theme).filter(f => isColor(f)).forEach((item) => {
        theme[item[0]] = item[1].hex()
    })
    theme.styles = styles
    return theme
}

const global = css`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Serif&display=swap');
    margin:0px;
    font-family:'IBM Plex Serif';
    a {
        text-decoration: none;
    }
`


document.querySelector('body').setAttribute('class', global)

function isColor(obj) {
    return Object.keys(obj[1].__proto__).includes('hex')
}

export function makeResizable() {
    const [dimensions, setDimensions] = React.useState({
        height: window.innerHeight,
        width: window.innerWidth
    })
    function debounce(fn, ms) {
        let timer
        return _ => {
            clearTimeout(timer)
            timer = setTimeout(_ => {
                timer = null
                fn.apply(this, arguments)
            }, ms)
        };
    }
    React.useEffect(() => {
        const dbResize = debounce(function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })
        })
        window.addEventListener('resize', dbResize)
        return _ => {
            window.removeEventListener('resize', dbResize)
        }
    })
    return dimensions
}

function Page({ children }) {
    const style = theme(themes.plain)
    const dimensions = makeResizable()
    return (
        <div className={css`
            background-color: ${style.background};
            height:${dimensions.height}px;
            width: ${dimensions.width}px;
            padding: 10px;
        `}>
            <ThemeProvider theme={style}>
                {children}
            </ThemeProvider>
        </div>
    )
}

root.render(
    <Page>
        {await content.default()}
    </Page>)