import React from "react"
import { ToggleableField, Textbox} from "hubris-components/text"
import { Alignment } from "../models/character/sections/bio"


export function Name({current, editCharacter}) {
    return(
        <Field data={current} id={'name'} label={'name'} handler={editCharacter} />
    )
}

export function Gender({current, editCharacter}) {
    return(
        <Field data={current} id={'gender'} label={'gender'} handler={editCharacter} />
    )
}

export function Backstory({current, editCharacter}) {
    return(
        <BigField data={current} id={'backstory'} label={'backstory'} handler={editCharacter} />
    )
}

export function Appearance({current, editCharacter}) {
    return(
        <BigField data={current} id={'appearance'} label={'appearance'} handler={editCharacter} />
    )
}

