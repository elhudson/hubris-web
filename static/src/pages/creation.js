import { Ruleset } from '../rules/ruleset.js'
import React from 'react';
import { createRoot } from 'react-dom/client'
import { Character } from '../rules/character.js'
import { useCharacter } from '../useCharacter.js';
import { Points } from '../utils.js';
import 'react-tabs/style/react-tabs.css';
import '../styles/pages/creation.scss';
import _ from 'lodash';
import { Choices } from '../rules/sorts.js';
import { Page, NextPage } from "../components/pages.js";
import { AbilityScores } from "../components/scores";
import { Alignment, Backstory, Appearance, Gender, Name } from '../components/bio.js';

await Ruleset.load();

const root = createRoot(document.getElementById('page'))

var id = document.querySelector('body').getAttribute('data-id')
var ch = Character.load(id)
console.log(ch)
var url = window.location.pathname.split('/')[1]
root.render(
    <>
    <h1>{url}</h1>
    <CreationPage url={url} ch={ch} />
    </>
)

function CreationPage({ url, ch }) {
    ch.options = new Choices(ch, url)
    ch.xp_spent = 0
    const [char, dispatchChanges] = useCharacter(ch)
    function handleAddDrop(e) {
        var which;
        if (e.target.checked == true) {
            which = 'add'
        }
        if (e.target.checked == false) {
            which = 'drop'
        }
        dispatchChanges({
            type: which,
            target: e.target.getAttribute('location').replace(' ', '_'),
            id: e.target.id,
            cost: e.target.getAttribute('cost')
        })
    }
    function handleBio(e) {
        dispatchChanges({
            type:'bio',
            target:e.target.id,
            content:e.target.value,
            inner:e.target.innerHTML
        })
    }
    function handleBin(e) {
        dispatchChanges({
            type: 'bin',
            target: e.target.getAttribute('location'),
            value: e.target.value
        })
    }
    switch (url) {
        case 'class': {
            return <Classes ch={char} binner={handleBin} handler={handleAddDrop} />
        }
        case 'backgrounds': {
            return <Backgrounds ch={char} binner={handleBin} handler={handleAddDrop} />
        }
        case 'stats': {
            return <Stats dispatcher={dispatchChanges} ch={char} />
        }
        case 'xp': {
            return <XP handler={handleAddDrop} binner={handleBin} ch={char} />
        }
        case 'fluff': {
            return <Fluff handler={handleBio} ch={char} />
        }
    }
}

function Backgrounds({ handler, binner, ch }) {
    return (
        <>
            <Page handler={handler} binner={binner} ch={ch} />
            <NextPage current={'backgrounds'} character={ch} />
        </>
    )
}

function Classes({ handler, binner, ch }) {
    return (
        <>
            <Page handler={handler} binner={binner} ch={ch} />
            <NextPage current={'class'} character={ch} />
        </>)
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