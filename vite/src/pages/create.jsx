import { generatePatch, useCharacter } from '@models/character.js';

import { PageWithNext } from '@elements/pages.js';

export default function CreationPage({ ch, stage }) {
    const [char, dispatchChanges] = useCharacter(ch)
    const patch=generatePatch(dispatchChanges)
    var handler=patch('options', 'addDrop', true)
    return (
        <PageWithNext url={stage} character={char}>
            {stage=='class' && char.options.classes.display({handler:handler})}
            {stage=='backgrounds' && char.options.backgrounds.display({handler:handler})}
            {stage=='stats' && char.stats.displayAllocate([patch('stats', 'increment'), patch('stats', 'decrement')])}    
            {stage=='skills' && char.skills.display({free:2+char.stats.scores.int.value, inCreation:true, handler:patch('skills', 'addDrop', true)})}               
            {stage=='bio' && char.bio.displayLong({patch:patch})}
        </PageWithNext>
    )
}

