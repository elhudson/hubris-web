import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button, Buttons } from './interactive.js';
import { style, styles} from './styles.js';

export function NextPage({ current, character }) {
    var progression=['class','backgrounds','stats', 'skills', 'bio', 'save']
    var next=progression[progression.indexOf(current)+1]
    const posted={}
    async function proceed() {
        if (ruleset.condition(current, character) == true) {
            sessionStorage.setItem('character', JSON.stringify(character))
            if (next=='save') {
                character.save()
                await character.write()
                window.location.assign(character.routes.characters)
            }
            else {window.location.assign('/create?'+new URLSearchParams({character:character.id, stage:next}))}
        }
        else { alert('Please choose all required options before proceeding.') }
    }
    return (
            <Buttons>
                <Button onClick={proceed}> next </Button>
            </Buttons>
    )
}

export function PageWithNext({url, character, children}) {
    var sty=style('page', {
        border:styles.border
    })
    return(
        <div className={sty}>
            <PageHeader title={url}/>
            <PageContent>{children}</PageContent>
            <NextPage current={url} character={character}/>
        </div>
    )
}

function PageContent({children}) {
    return(
        <div>{children}</div>
    )
}

function PageHeader({title}) {
    return(
        <h1 style={{
            textTransform:'uppercase',
            fontFamily:styles.mono,
            width:'fit-content',
            margin:'auto'
        }}>{title}</h1>
    )
}
