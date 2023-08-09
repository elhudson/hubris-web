import { Ruleset } from '../../rules/ruleset.js'
import React from 'react';
import { createRoot } from 'react-dom/client'
import { Character, useCharacter, generatePatch} from '../../models/character/character.js'
import 'react-tabs/style/react-tabs.css';
import _ from 'lodash';
import { Block, Tabbed } from 'hubris-components/containers.js';
await Ruleset.load();
const root = createRoot(document.getElementById('page'))
import { Choices } from '../../rules/sorts.js';
var id = document.querySelector('body').getAttribute('data-id')
import { PageWithNext } from 'hubris-components/pages.js';

var ch = Character.load(id)
if (ch=='Character not found!') {
    ch=Character.create(id)
}
var url = window.location.pathname.split('/')[1]
root.render(
    <>
    <h1>{url}</h1>
    <CreationPage url={url} ch={ch} />
    </>
)

function CreationPage({ url, ch }) {
    const [char, dispatchChanges] = useCharacter(ch, url)
    const patch=generatePatch(dispatchChanges)
    var binner=patch('options', 'regroup')
    var handler=patch('options', 'addDrop')
    switch (url) {
        case 'class': {
            return(
            <PageWithNext url={url} character={char}>
                {char.options.classes.display({binner:binner, handler:handler})}
            </PageWithNext>)
        }
        case 'backgrounds': {
            return(
            <PageWithNext url={url} character={char}>
                {char.options.backgrounds.display({binner:binner, handler:handler})}
            </PageWithNext>
            )
        }
        case 'stats': {
            var counter=[patch('stats', 'increment'), patch('stats','decrement')]
            return (
            <PageWithNext url={url} character={char}>
                {char.stats.display(counter)}
            </PageWithNext>)
        }
        case 'xp': {
            return (
            <PageWithNext url={url} character={char}>
                <Tabbed names={['Features', 'Powers']}>
                    <Tabbed names={['Class Features','Tag Features']}>
                            {char.options.features.class_features.display({binner:binner, handler:handler})}
                            {char.options.features.tag_features.display({binner:binner, handler:handler})}
                    </Tabbed>
                    <Tabbed names={['Effects', 'Ranges', 'Durations']}>
                        {char.options.powers.effects.display({binner:binner, handler:handler})}
                        {char.options.powers.metadata.display({binner:binner, handler:handler})}
                    </Tabbed>
                </Tabbed>
            </PageWithNext>)
        }
        case 'fluff': {
            return <Fluff handler={handleBio} ch={char} />
        }
    }
}

function Backgrounds({ handler, binner, ch }) {
    return (
        <>
            <Page handler={handler} binner={binner} ch={ch} />
            <NextPage current={'backgrounds'} character={ch} />
        </>
    )
}

function Stats({ dispatcher, ch }) {
    return (
        <>
            <AbilityScores dispatchChanges={dispatcher} char={ch} />
            <NextPage current={'stats'} character={ch} />
        </>)

}

function XP({ handler, binner, ch }) {
    return (
        <>
            <div class='doublesided'>
                <Points item={{ label: 'XP Earned', value: ch.xp_earned }} />
                <Points item={{ label: 'XP Spent', value: ch.xp_spent }} />
            </div>
            <Page handler={handler} binner={binner} ch={ch} />
            <NextPage current={'xp'} character={ch} />

        </>
    )
}

function Fluff({ handler, ch }) {
    return(
        <>
        <div class='bio'>
            <Name current={ch.bio.name} editCharacter={handler} />
            <Alignment selected={ch.bio.alignment} editCharacter={handler} />
            <Gender current={ch.bio.gender} editCharacter={handler} />
            <Appearance current={ch.bio.appearance} editCharacter={handler}/>
            <Backstory current={ch.bio.backstory} editCharacter={handler} />
        </div>
        <SubmitCharacter ch={ch} />
        </>
    )
    
}

function SubmitCharacter({ch}) {
    const handleSubmit=()=>{
        ch.save()
        ch.write('/fluff')
        window.location.assign(`/sheet/${ch.id}`)
    }
    return(
        <button type='button' className='next' onClick={handleSubmit}>Create Character</button>
    )
}