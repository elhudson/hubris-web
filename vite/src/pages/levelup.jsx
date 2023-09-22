import { Button, Menu } from "@elements/interactive"
import { Character, generatePatch, useCharacter } from "@models/character"
import { useAsync } from 'react-async-hook'
import { Tabbed } from "@elements/containers"
import { Page } from '@elements/pages'

export default function LevelUp() {
    const getCharacter = async (data) => await Character.from_url()
    const myCharacter = useAsync(getCharacter)
    return (
        <Page title={'Level Up'}>
            {myCharacter.result && <Level ch={myCharacter.result} />}
        </Page>
    )
}

export function Level({ ch }) {
    const [char, dispatchChanges] = useCharacter(ch)
    const handleSave = async () => {
        await char.write()
        sessionStorage.removeItem('character')
        localStorage.removeItem(char.id)
        window.location.assign(char.routes.characters)
    }
    const patch = generatePatch(dispatchChanges)
    var binner = patch('options', 'regroup')
    var filterer = patch('options', 'filter')
    var sorter = patch('options', 'sort')
    var handler = patch('options', 'addDrop', true)
    var data = {
        'Class Features': {
            content: char.options.features.class_features.display({ handler: handler }),
            menu: char.options.features.class_features.displayMenu({ binner: binner, filterer: filterer, sorter: sorter })
        },
        'Tag Features': {
            content: char.options.features.tag_features.display({ handler: handler }),
            menu: char.options.features.tag_features.displayMenu({ binner: binner, filterer: filterer, sorter: sorter }),
        },
        'Effects': {
            content: char.options.powers.effects.display({ handler: handler }),
            menu: char.options.powers.effects.displayMenu({ binner: binner, filterer: filterer, sorter: sorter }),
        },
        'Ranges': {
            content: char.options.powers.metadata.ranges.display({ handler: handler }),
            menu: char.options.powers.metadata.ranges.displayMenu({ binner: binner, filterer: filterer, sorter: sorter }),

        },
        'Durations': {
            content: char.options.powers.metadata.durations.display({ handler: handler }),
            menu: char.options.powers.metadata.durations.displayMenu({ binner: binner, filterer: filterer, sorter: sorter }),

        },
        'Skills': {
            content: char.skills.display({ handler: patch('skills', 'addDrop', true) }),
        },
        'Health': {
            content: char.health.hd.displayOption({ update: [patch('health', 'increment', true), patch('health', 'decrement', true)] })
        }
    }
    return (
        <>
            {char.progression.trackXp({ patch: patch })}
            <Tabbed menus={Object.values(data).map(m => m.menu)} names={Object.keys(data)}>
                {Object.values(data).map(d => d.content)}
            </Tabbed>
            <Button onClick={handleSave}>Save</Button>
        </>


    )
}


