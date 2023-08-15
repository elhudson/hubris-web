import { Ruleset } from '../models/ruleset'
import React from 'react';
import { PageWithNext } from '../components/components/pages.js';
import { createRoot } from 'react-dom/client'
import { Character, useCharacter, generatePatch, SaveButton} from '../models/character/character'
import 'react-tabs/style/react-tabs.css';
import _ from 'lodash';

await Ruleset.load();
const root = createRoot(document.getElementById('page'))

var url = window.location.pathname.split('/')[1]
root.render(
    <>
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
            <SaveButton ch={char} />
        </PageWithNext>
    )
}

