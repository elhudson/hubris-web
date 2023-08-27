import React from 'react';
import { PageWithNext } from '../components/components/pages.js';
import { Character, useCharacter, generatePatch, SaveButton} from '../models/character/character.js'
import _ from 'lodash';
import Uri from 'jsuri';

export default function CreationPage({ ch, stage }) {
    const [char, dispatchChanges] = useCharacter(ch)
    const patch=generatePatch(dispatchChanges)
    var binner=patch('options', 'regroup')
    var handler=patch('options', 'addDrop', true)
    window.c=char
    return (
        <PageWithNext url={stage} character={char}>
            {stage=='class' && char.options.classes.display({binner:binner, handler:handler})}
            {stage=='backgrounds' && char.options.backgrounds.display({binner:binner, handler:handler})}
            {stage=='stats' && char.stats.displayAllocate([patch('stats', 'increment'), patch('stats', 'decrement')])}    
            {stage=='skills' && char.skills.display({free:2+char.stats.scores.int.value, inCreation:true, handler:patch('skills', 'addDropFree', true)})}               
            {stage=='bio' && char.bio.displayLong({patch:patch})}
        </PageWithNext>
    )
}

