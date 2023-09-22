import { User, UserMenu, userContext } from '@models/user'

import Characters from '@pages/characters'
import Login from '@pages/login'
import CharacterSheet from '@pages/sheet'


import { ThemeProvider } from "@emotion/react"
import Uri from 'jsuri'
import { css } from "@emotion/css"
import global from '@styles/global'
import makeResizable from '@styles/resizer'
import theme from '@styles/styling'
import themes from '@styles/themes'
import { useState } from 'react'
import Ruleset from '@models/ruleset'

// import CreationPage from '@pages/create'
import LevelUp from '@pages/levelup'

await Ruleset.load()
const user = User.in_memory() ? User.parse(JSON.parse(sessionStorage.getItem('user'))) : new User()

function App() {
  const currentPage = new Uri(window.location.href).path()
  const [base, setBase] = useState(themes.gruvbox.light)
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
      <userContext.Provider value={user}>
        <ThemeProvider theme={currentTheme}>
          <UserMenu />
          {currentPage == '/' && <Login />}
          {currentPage == '/characters' && <Characters />}
          {currentPage == '/sheet' && <CharacterSheet />}
          {currentPage=='/levelup' && <LevelUp />}
        </ThemeProvider>
      </userContext.Provider>
    </div>
  )
}

export default App

