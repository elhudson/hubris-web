import { User, UserMenu, userContext } from '@models/user'

import Characters from '@pages/characters'
import Login from '@pages/login'
import CharacterSheet from '@pages/sheet'
import CreationPage from '@pages/create'
import LevelUp from '@pages/levelup'

import { ThemeProvider } from "@emotion/react"
import Uri from 'jsuri'
import { css } from "@emotion/css"
import global from '@styles/global'
import makeResizable from '@styles/resizer'
import theme from '@styles/styling'
import themes from '@styles/themes'
import { useState } from 'react'
import Ruleset from '@models/ruleset'

import { Icon } from './components/elements/images'

await Ruleset.load()
const user = User.in_memory() ? User.parse(JSON.parse(sessionStorage.getItem('user'))) : new User()

function App() {
  const currentPage = new Uri(window.location.href).path()
  const [base, setBase] = useState(themes.plain)
  const currentTheme = theme(base)
  const dimensions = makeResizable()
  return (
    <div
      className={css`
        ${global};
        background-color:${currentTheme.background};
        width:${dimensions.width}px;
        min-height:${dimensions.height}px;
      `}>
      <Icon/>
      <userContext.Provider value={user}>
        <ThemeProvider theme={currentTheme}>
        <div className={css`
            background-color:${theme.background};
            border-bottom:${theme.border};
            button.MuiMenuButton-root {
                height:fit-content;
                position:absolute;
                top:10px;
                left:10px;
            }
            h1 {
                text-align:center;
                width:100%;
            }
            display:inline-flex;
            position:sticky;
            width:100%;
            `}>
            <UserMenu />
            <h1>HUBRIS</h1>
          </div>
          {currentPage == '/' && <Login />}
          {currentPage == '/characters' && <Characters />}
          {currentPage == '/sheet' && <CharacterSheet />}
          {currentPage=='/levelup' && <LevelUp />}
          {currentPage=='/create' && <CreationPage />}
        </ThemeProvider>
      </userContext.Provider>
    </div>
  )
}

export default App

