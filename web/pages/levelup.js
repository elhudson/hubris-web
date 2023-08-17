import React from "react"
import { createRoot } from "react-dom/client"
import { Character, useCharacter, generatePatch } from "../models/character/character"  
import { Ruleset } from "../models/ruleset"
import { Tabbed } from "../components/components/containers"

await Ruleset.load()
var ch=await Character.load()

const root = createRoot(document.getElementById('page'))

root.render(<LevelUp ch={ch}/>)

function LevelUp({ch}) {
    const [char, dispatchChanges] = useCharacter(ch)
    const patch=generatePatch(dispatchChanges)
    var binner=patch('options', 'regroup')
    var handler=patch('options', 'addDrop', true)
    return(
    <>
    {char.controls()}
    <Tabbed names={['Features', 'Powers', 'Skills', 'Hit Dice']}>
        <Tabbed names={['Class Features','Tag Features']}>
                {char.options.features.class_features.display({binner:binner, handler:handler})}
                {char.options.features.tag_features.display({binner:binner, handler:handler})}
        </Tabbed>
        <Tabbed names={['Effects', 'Ranges', 'Durations']}>
            {char.options.powers.effects.display({binner:binner, handler:handler})}
            {char.options.powers.metadata.ranges.display({binner:binner, handler:handler})}
            {char.options.powers.metadata.durations.display({binner:binner, handler:handler})}
        </Tabbed>
        <div>
            { char.skills.display({handler:patch('skills', 'addDrop', true)}) }
        </div>
        <div>
            {char.health.hd.displayOption({update:[patch('health', 'increment', true), patch('health', 'decrement', true)]})}
        </div>
    </Tabbed>
    </>
    )}