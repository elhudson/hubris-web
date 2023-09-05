import React from 'react'
import { useCharacter, generatePatch } from '../models/character/character.js'
import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import {Buttons, Button} from '../components/components/interactive.js'

export default function CharacterSheet({ ch }) {
    const theme=useTheme()
    const [char, dispatch]=useCharacter(ch)
    const patch=generatePatch(dispatch)
    console.log(char)
    return (
        <div className={css`
            width:400px;
            margin:auto;
            border:${theme.border};
            padding:5px;
        `}>
            <CharControls char={char} />
                {char.header({patch:patch})}
                {char.progression.display({patch:patch})}
                {char.stats.display({skills:char.skills})}
                {char.health.display({patch:patch})}
                {char.combat.display({patch:patch})}
                {char.features.display(char.backgrounds)}
                {char.powers.display({patch:patch})}
        </div>
    )}


export function CharControls({char}) {
    return(
        <Buttons>
            <Button onClick={char.controls('levelup')}>Level Up</Button>
            <Button onClick={char.controls('save')}>Save</Button>
            <Button onClick={char.controls('delete')}>Delete</Button>
        </Buttons>)}






