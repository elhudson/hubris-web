import { Ruleset } from '../../rules/ruleset.js'
import { Item, LabeledItem } from 'hubris-components/containers'
import { Icon } from 'hubris-components/images.js';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client'
import { Tier } from '../models/character/sections/progression.js';
import { User, useUser } from '../models/user.js';
import { useAsync } from 'react-async-hook';
import { Character } from '../models/character/character.js';
import {style, styles, reusable} from 'hubris-components/styles.js'

import { Button } from 'hubris-components/interactive.js';
window.ruleset = await Ruleset.load()

import { BarLoader } from 'react-spinners';
var page = createRoot(document.getElementById('page'))
var data = document.querySelector('body').getAttribute('data-ids')
var ids = JSON.parse('{"ids":' + data.replaceAll(`'`, `"`) + '}').ids

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
        (<a href={`/sheet/${asyncHero.result.id}`}>{asyncHero.result.bio.name}</a>) : 
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
                        <div style={{margin:5}}>
                        <Item label={'Class'}>{asyncHero.result.classes.base.name}</Item>
                        </div>
                        <div style={{margin:5}}>
                        <Item label={'Backgrounds'}>{[asyncHero.result.backgrounds.primary.name, asyncHero.result.backgrounds.secondary.name].join(' & ')} </Item>
                        </div>
                        <div style={{borderTop:styles.border, position:'absolute', bottom:0, width:'100%'}}>
                            <Tier tier={asyncHero.result.progression.tier()} />
                        </div>
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