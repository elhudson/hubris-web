import React from "react"
import { BigField, Dropdown, Field } from "../utils"

export function Alignment({ selected, editCharacter }) {
    return (
        <Dropdown data={ruleset.reference.alignments} selected={selected} label={'alignment'} handler={editCharacter} />
    )
}

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

