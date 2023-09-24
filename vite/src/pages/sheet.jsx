import { Button, Buttons } from '@elements/interactive'
import { Icon } from '@elements/images'
import { generatePatch, useCharacter, Character } from '@models/character'

import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { useAsync } from 'react-async-hook'
import { useEffect, useState } from 'react'

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
    const [saved, setSaved] = useState(null)
    const levelup = useAsync(async () => await import('@assets/icons/levelup.svg').then((d) => d.default)).result
    const save = useAsync(async () => await import('@assets/icons/save.svg').then((d) => d.default)).result
    const remove = useAsync(async () => await import('@assets/icons/delete.svg').then((d) => d.default)).result
    return (
        <>  
            {saved}
            <Buttons>
                <Button onClick={char.controls('levelup')}>
                    <Icon path={levelup} />
                </Button>
                <Button onClick={async () => {
                    var alert = await char.controls('save')()
                    setSaved(alert)
                }}>
                    <Icon path={save} />
                </Button>
                <Button onClick={char.controls('delete')}>
                    <Icon path={remove} />
                </Button>
            </Buttons>
        </>
    )
}





