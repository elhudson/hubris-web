import { Ruleset } from '../models/ruleset'
import React from 'react';
import { PageWithNext } from '../components/components/pages.js';
import { createRoot } from 'react-dom/client'
import { Character, useCharacter, generatePatch, SaveButton} from '../models/character/character'
import 'react-tabs/style/react-tabs.css';
import _ from 'lodash';
import Uri from 'jsuri';

await Ruleset.load();

const root = createRoot(document.getElementById('page'))

const ch=await Character.load()
const url=new Uri(window.location.href).getQueryParamValue('stage')

root.render(
    <>
    <CreationPage stage={url} ch={ch} />
    </>
)

function CreationPage({ ch, stage }) {
    const [char, dispatchChanges] = useCharacter(ch)
    window.c=char
    const patch=generatePatch(dispatchChanges)
    var binner=patch('options', 'regroup')
    var handler=patch('options', 'addDrop', true)
    return (
        <PageWithNext url={stage} character={char}>
            {stage=='class' && char.options.classes.display({binner:binner, handler:handler})}
            {stage=='backgrounds' && char.options.backgrounds.display({binner:binner, handler:handler})}
            {stage=='stats' && char.stats.displayAllocate([patch('stats', 'increment'), patch('stats', 'decrement')])}                   
            {stage=='bio' && <char.bio.FullBio obj={char.bio} handler={patch('bio', 'update')}/>}
            <SaveButton ch={char} />
        </PageWithNext>
    )
}

