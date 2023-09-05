import React, { useRef } from "react"
import { Character, useCharacter, generatePatch } from "../models/character/character"
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs'
import { css } from "@emotion/css"
import { Button, Menu } from "../components/components/interactive"
import { Icon } from "../components/components/images"
import { Tabbed } from "../components/components/containers"

export default function LevelUp({ ch }) {
    const [char, dispatchChanges] = useCharacter(ch)
    const handleSave=async ()=> {
        await char.write()
        sessionStorage.removeItem('character')
        window.location.assign(char.routes.characters)
    }
    const patch = generatePatch(dispatchChanges)
    var binner = patch('options', 'regroup')
    var filterer=patch('options', 'filter')
    var sorter=patch('options', 'sort')
    var handler = patch('options', 'addDrop', true)
    var data={
        'Class Features':{
            content:char.options.features.class_features.display({handler:handler}),
            menu:char.options.features.class_features.displayMenu({binner:binner, filterer:filterer, sorter:sorter})
        },
        'Tag Features':{
            content:char.options.features.tag_features.display({handler:handler}),
            menu:char.options.features.tag_features.displayMenu({binner:binner, filterer:filterer, sorter:sorter}),

        },
        'Effects':{
            content:char.options.powers.effects.display({handler:handler}),
            menu:char.options.powers.effects.displayMenu({binner:binner, filterer:filterer, sorter:sorter}),
        },
        'Ranges':{
            content:char.options.powers.metadata.ranges.display({handler:handler}),
            menu:char.options.powers.metadata.ranges.displayMenu({binner:binner, filterer:filterer, sorter:sorter}),

        },
        'Durations':{
            content:char.options.powers.metadata.durations.display({handler:handler}),
            menu:char.options.powers.metadata.durations.displayMenu({binner:binner, filterer:filterer, sorter:sorter}),

        },
        'Skills': {
            content:char.skills.display({ handler: patch('skills', 'addDrop', true) }),
        },
        'Health':{
            content:char.health.hd.displayOption({ update: [patch('health', 'increment', true), patch('health', 'decrement', true)] })}
        }
    return (
        <>
        {char.progression.trackXp({patch:patch})}
        <Tabbed menus={Object.values(data).map(m=>m.menu)} names={Object.keys(data)}>
            {Object.values(data).map(d=>d.content)}
        </Tabbed>
        <Button onClick={handleSave}>Save</Button>
        </>
       

    )
}


