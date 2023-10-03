import { Button, Buttons, Menu } from '@elements/interactive'
import { MenuItem } from '@mui/base/MenuItem';
import { Icon } from '@elements/images'
import { generatePatch, useCharacter, Character } from '@models/character'

import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { useState } from 'react'
import Uri from 'jsuri'
import { useAsync } from 'react-async-hook'

export default function CharacterSheet() {
    const theme = useTheme()
    const getCharacter = async (id) => await Character.load(id)
    const asyncCharacter = useAsync(() => getCharacter(new Uri(window.location.href).getQueryParamValue('character')))
    return (
        <div className={css`
            width:400px;
            margin:auto;
            border:${theme.border};
            padding:5px;
        `}>
            {asyncCharacter.result && <Sheet ch={asyncCharacter.result} />}
        </div>

    )
}

export function Sheet({ ch }) {
    const [char, dispatch] = useCharacter(ch)
    const patch = generatePatch(dispatch)
    return (
        <>
            <CharControls char={char} />
            {char.header({ patch: patch })}
            {char.progression.display({ patch: patch })}
            {char.stats.display({ skills: char.skills })}
            {char.health.display({ patch: patch })}
            {char.combat.display({ patch: patch })}
            {char.features.display(char.backgrounds)}
            {char.powers.display({ patch: patch })}

        </>

    )

}

export function CharControls({ char }) {
    const [saved, setSaved] = useState(null)
    return (
        <Menu icon={<Icon name={'ui/dice'} />}>
            <MenuItem onClick={char.controls('levelup')}>Level Up</MenuItem>
            <MenuItem onClick={async () => {
                alert = await char.controls('save')()
                setSaved(alert)
            }}> Save </MenuItem>
            <MenuItem onClick={char.controls('delete')}>Delete</MenuItem>
            <MenuItem onClick={() => {
                char.long_rest()
            }}>Long Rest</MenuItem>
        </Menu>

    )
}





