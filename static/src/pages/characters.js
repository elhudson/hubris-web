import { Tier } from './sheet.js'
import { Character } from '../rules/character.js'
import { Ruleset } from '../rules/ruleset.js'
import { Item, Icon } from '../utils.js'
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client'

window.ruleset=await Ruleset.load()

var page = createRoot(document.getElementById('page'))
var data = document.querySelector('body').getAttribute('data-ids')
var ids=JSON.parse('{"ids":'+data.replaceAll(`'`,`"`)+'}').ids
var characters=new Array();

for (var i=0; i<ids.length; i++) {
    await Character.load(ids[i]).then((char)=> characters.push(char))
}

page.render(<CharacterGrid chars={characters} />)


function CharacterGrid({chars}) {
    return(
    <div className='character-grid'>
        {chars.map(c=><CharacterThumbnail character={c} />)}
        <NewCharacter />
    </div>)}

function CharacterThumbnail({character}) {
    var classname=character.classes[0].name
    var backgrounds= character.backgrounds[0].name+' & '+character.backgrounds[1].name
    return(
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


    </div>)}

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