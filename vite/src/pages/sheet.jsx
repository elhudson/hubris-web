import { Button, Buttons } from '@elements/interactive'
import { generatePatch, useCharacter, Character } from '@models/character'

import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { useAsync } from 'react-async-hook'

export default function CharacterSheet() {
    const theme = useTheme()
    const getCharacter = async data => await Character.from_url() 
    const asyncCharacter = useAsync(getCharacter)
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
    return (
        <Buttons>
            <Button onClick={char.controls('levelup')}>Level Up</Button>
            <Button onClick={char.controls('save')}>Save</Button>
            <Button onClick={char.controls('delete')}>Delete</Button>
        </Buttons>)
}






