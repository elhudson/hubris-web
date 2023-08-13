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
import { current } from 'immer';
import { HD } from '../../models/character/sections/health.js';

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
    var handler=patch('options', 'addDrop', true)
    return (
        <PageWithNext url={url} character={char}>
            {url=='class' && char.options.classes.display({binner:binner, handler:handler})}
            {url=='backgrounds' && char.options.backgrounds.display({binner:binner, handler:handler})}
            {url=='stats' && char.stats.displayAllocate([patch('stats', 'increment'), patch('stats', 'decrement')])}                   
            {url=='fluff' && <char.bio.FullBio obj={char.bio} handler={patch('bio', 'update')}/>}
        </PageWithNext>
    )
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