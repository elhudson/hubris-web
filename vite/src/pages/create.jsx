import { generatePatch, useCharacter, Character } from '@models/character';
import { useAsync } from 'react-async-hook'
import Uri from 'jsuri';
import { Bins } from '@models/featureset';
import { Button, Buttons } from '@elements/interactive';
import { Page } from '@elements/pages';
import {userContext} from '@models/user'
import { useContext } from 'react';

export default function CreationPage() {
    const getCharacter = async () => await Character.from_url()
    const myCharacter = useAsync(getCharacter)
    const stage = new Uri(window.location.href).getQueryParamValue('stage')
    return (
        <Page title={stage}>
            {myCharacter.result && <Creation ch={myCharacter.result} stage={stage} />}
        </Page>
    )
}

function Creation({ ch, stage }) {
    const user=useContext(userContext)
    const [char, dispatchChanges] = useCharacter(ch)
    const patch = generatePatch(dispatchChanges)
    var handler = patch('options', 'addDrop', true)
    var progression = ['class', 'backgrounds', 'stats', 'skills', 'bio', 'save']
    var next = progression[progression.indexOf(stage) + 1]
    async function proceed() {
        if (ruleset.condition(stage, char) == true) {
            sessionStorage.setItem('character', JSON.stringify(char))
            if (next == 'save') {
                user.characters.push(char.id)
                sessionStorage.setItem('user', JSON.stringify(user))
                char.save()
                await char.write()
                window.location.assign(char.routes.characters)
            }
            else { window.location.assign('/create?' + new URLSearchParams({ character: char.id, stage: next })) }
        }
        else { alert('Please choose all required options before proceeding.') }
    }
    return (
        <>
            {stage == 'class' && char.options.classes.display({ handler: handler })}
            {stage == 'backgrounds' && char.options.backgrounds.display({ handler: handler })}
            {stage == 'stats' && char.stats.displayAllocate([patch('stats', 'increment'), patch('stats', 'decrement')])}
            {stage == 'skills' && char.skills.display({ free: 2 + char.stats.scores.int.value, inCreation: true, handler: patch('skills', 'addDrop', true) })}
            {stage == 'bio' && char.bio.displayLong({ patch: patch })}
            <Buttons>
                <Button onClick={proceed}> next </Button>
            </Buttons>
        </>
    )
}