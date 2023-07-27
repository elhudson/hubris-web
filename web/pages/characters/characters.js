import { Character } from '../../models/character.js'
import { Ruleset } from '../../rules/ruleset.js'
import { Item, Icon } from '../../components/utils.js'
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client'
import { User, useUser } from '../../models/user.js';

window.ruleset=await Ruleset.load()

var page = createRoot(document.getElementById('page'))
var data = document.querySelector('body').getAttribute('data-ids')
var ids=JSON.parse('{"ids":'+data.replaceAll(`'`,`"`)+'}').ids


page.render(<CharacterGrid ids={ids}/>)


function CharacterGrid({ids}) {
    return(
    <div className='character-grid'>
        {ids.map(c=><CharacterThumbnail id={c} />)}
        <NewCharacter />
    </div>)}

async function CharacterThumbnail({id}) {
    return fetch(`/get/${id}`)
        .then((result)=>result.json())
        .then((json)=>Character.parse(JSON.parse(json)))
        .then((character)=> 
        <div class='character-thumbnail'>
            <Icon name={'person'} />
            <div class='thumb-text'>
                <div>
                    <a href={`/sheet/${character.id}`}><h2 class='thumb-title'>{character.name}</h2></a>
                    <div class='thumb-summary'>
                        <Item label={'Class'} content={classname}/>
                        <Item label={'Backgrounds'} content={backgrounds} />
                    </div>
                </div>
                <Tier character={character}/>
            </div>
        </div>
        )}

function NewCharacter({}) {
    return(
        <div class='add-character'>
                <button type='button'>
                    <a href='/class'>
                   <Icon name={'plus'} />
                    </a>
                </button>
        </div>
    )
}