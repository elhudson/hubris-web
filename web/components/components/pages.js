import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button, Buttons } from './interactive.js';
import { style, styles} from './styles.js';

export function NextPage({ current, character }) {
    var progression=['class','backgrounds','stats', 'fluff', 'characters']
    var next=progression[progression.indexOf(current)+1]
    var display=style('bottom-btn', {
        paddingTop:20,
        
        '& button': {
            margin:0,
            border:'unset',
            borderTop:styles.border,
            
        }
    })
    async function proceed() {
        if (ruleset.condition(current, character) == true) {
            sessionStorage.setItem(character.id, JSON.stringify(character))
            window.location.assign(`/${next}`)
        }
        else { alert('Please choose all required options before proceeding.') }
    }
    return (
        <div className={display}>
            <Buttons>
                <Button onClick={proceed}> next </Button>
            </Buttons>
        </div>
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
