import React, { useContext } from "react";
import Ruleset from "./models/ruleset";
import { createRoot } from 'react-dom/client'
import { css } from '@emotion/css'
import { Global, ThemeProvider, useTheme } from "@emotion/react";
import Color from "color";
import { User, UserMenu } from "./models/user";
import CreationPage from "./pages/create"
import Login from "./pages/login"
import LevelUp from "./pages/levelup";
import { Characters } from "./models/user"
import { Character } from "./models/character/character"
import Uri from "jsuri"
import CharacterSheet from "./pages/sheet";

await Ruleset.load()

async function create() {
    const url=new Uri(window.location.href)
    const stage=url.getQueryParamValue('stage')
    const id=url.getQueryParamValue('character')
    const ch=await Character.load(id)
    return(<CreationPage ch={ch} stage={stage}/>)
}

async function login() {
    const error = new Uri(window.location.href).getQueryParamValue('error')
    const user=new User()
    return (<Login usr={user} error={error} />)
}

async function characters(user) {
    const ids=await user.get_characters()
    return(<Characters ids={ids} />)
}


async function levelup() {
    const id=new Uri(window.location.href).getQueryParamValue('character')
    const ch=await Character.load(id)
    return(<LevelUp ch={ch} />)
}

async function sheet() {
    const id=new Uri(window.location.href).getQueryParamValue('character')
    var char=await Character.load(id)
    return(<CharacterSheet ch={char}/>)
}

export const userContext = React.createContext(null)
const user = User.in_memory() ? User.parse(JSON.parse(sessionStorage.getItem('user'))) : null
const root = createRoot(document.getElementById('page'))
const page=window.location.pathname

var content;
page=='/' && (content=await login())
page=='/characters' && (content=await characters(user))
page=='/create' && (content=await create())
page=='/levelup' && (content=await levelup())
page=='/sheet' && (content=await sheet())

root.render(
<Page user={user}>
    {content}
</Page>)

const themes = {
    plain: {
        background: Color('#ffffff'),
        text: Color('#000000'),
        muted: Color('#a9a9a9'),
        light: Color('#eeeeee'),
        size: 14,
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
        disabled:css`
            opacity:0.5;
        `,
        hidden:css`
            display:none;
        `,
        checkbox: css`
            height: ${theme.size}px;
            width: ${theme.size}px;
            appearance: none;
            border:${theme.border};
            border-radius: 100%;
            :checked {
                display:unset;
                border:${theme.border};
                content: url('/static/assets/icons/check.svg');
                svg {
                    filter:opacity(50%);
                }
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
        `,
        buttons: css`
            display:flex;
            border:${theme.border};
            height:100%;
            button {
                margin:unset;
                padding:unset;
                height:100%;
                border:none;
                border-right: ${theme.border};
                &:last-child {
                    border-right:none;
                }
            }`
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
    Object.entries(theme).filter(f => isColor(f)).forEach((item) => {
        theme[item[0]] = item[1].hex()
    })
    theme.styles = styles
    theme.layouts = layouts
    return theme
}

const global = css`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Serif&display=swap');
    margin:0px;
    font-family:'IBM Plex Serif';
    input {
        font-family: 'IBM Plex Serif';
    }
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
        height: window.visualViewport.height,
        width: window.visualViewport.width
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
                height: window.visualViewport.height,
                width: window.visualViewport.width
            })
        })
        window.addEventListener('resize', dbResize)
        return _ => {
            window.removeEventListener('resize', dbResize)
        }
    })
    return dimensions
}

function Page({ user, children }) {
    const style = theme(themes.plain)
    const dimensions = makeResizable()
    return (
        <userContext.Provider value={user}>
            <div className={css`
                background-color: ${style.background};
                height:${dimensions.height}px;
                width: ${dimensions.width}px;
                `}>
                <ThemeProvider theme={style}>
                    <UserMenu />
                    <div className={css`
                        padding:10px;
                        padding-top:100px;
                        `}>
                            {children}
                    </div>
                </ThemeProvider>
            </div>
        </userContext.Provider>
    )
}




