import React from 'react';
import { PageWithNext } from '../components/components/pages.js';
import { Character, useCharacter, generatePatch, SaveButton} from '../models/character/character'
import _ from 'lodash';
import Uri from 'jsuri';

export default async function creation() {
    const ch=await Character.load()
    const url=new Uri(window.location.href).getQueryParamValue('stage')
    return(<CreationPage ch={ch} stage={url}/>)
}

function CreationPage({ ch, stage }) {
    const [char, dispatchChanges] = useCharacter(ch)
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

