import { Ruleset } from '../models/ruleset'
import { Item, LabeledItem } from '../components/components/containers'
import { Icon } from '../components/components/images.js';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client'
import { Tier } from '../models/character/sections/progression.js';
import { useAsync } from 'react-async-hook';
import { Character } from '../models/character/character.js';
import {style, styles, reusable} from '../components/components/styles.js'
import { Button } from '../components/components/interactive.js';
import { Alignment } from '../models/character/sections/bio';
import { User } from '../models/user';

window.ruleset = await Ruleset.load()

import { BarLoader } from 'react-spinners';
var page = createRoot(document.getElementById('page'))
var user=User.from_url()

await user.get_characters()

page.render(
    <>
    <h1>Characters</h1>
    <div style={{display:'flex'}}>
        {ids.map(id => <CharacterThumbnail id={id} />)}
        <NewCharacter />
    </div>
    </>
)


function CharacterThumbnail({ id }) {
    const fetchCharacter = async id => (await Character.request(id))
    const asyncHero = useAsync(fetchCharacter, [id])
    return (
    <LabeledItem 
    childStyles={style('thumbnail', {
        display:'flex'
    })}
    label={
    asyncHero.result ? 
        (<>
        <a href={`/sheet/${asyncHero.result.id}`}>{asyncHero.result.bio.name}</a>
        
        </>) : 
        'Loading...'}>
            {asyncHero.loading && 
                <div style={{
                    width:'80%',
                    height:'100px',
                    position:'relative'
                }}>
                    <BarLoader cssOverride={{top:'50%'}} color={styles.text} />
                </div>}
            {asyncHero.error && <div>Error: {asyncHero.error.message}</div>}
            {asyncHero.result && (
                <>
                    <div style={{width: 'fit-content'}}>
                        <Icon size={100} name={`classes__${asyncHero.result.classes.base.name.toLowerCase()}`} />
                    </div>
                    <div style={{width:'fit-content', position:'relative', borderLeft:styles.border}}>
                        <div style={{margin:2}}>
                        <Item label={'Class'}>{asyncHero.result.classes.base.name}</Item>
                        </div>
                        <div style={{margin:2}}>
                        <Item label={'Backgrounds'}>{[asyncHero.result.backgrounds.primary.name, asyncHero.result.backgrounds.secondary.name].join(' & ')} </Item>
                        </div>
                        <Alignment selected={asyncHero.result.bio.alignment} />
                        <div style={{borderTop:styles.border, position:'absolute', bottom:0, width:'100%'}}>
                            <Tier tier={asyncHero.result.progression.tier()} />
                        </div>
                    </div>
                    {asyncHero.result.controls('short')}

                    <div>
        </div>
                </>
            )}
    </LabeledItem>
    )
}

function NewCharacter({ }) {
    function handleClick(e) {
        window.location.assign('/class')
    }
    return (
        <div style={{margin:5}}>
        <Button onClick={handleClick}>
            <Icon name='plus' size={100} />
        </Button>
        </div>
    )
}