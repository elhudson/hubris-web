import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button } from './interactive.js';

export function NextPage({ current, character }) {
    var progression=['class','backgrounds','stats','xp','fluff']
    var next=progression[progression.indexOf(current)+1]
    console.log(next)
    function save() {
        if (ruleset.condition(current, character) == true) {
            sessionStorage.setItem(character.id, JSON.stringify(character))
            window.location.assign(`/${next}`)
        }
        else { alert('Please choose all required options before proceeding.') }
    }
    return (
        <Button onClick={save}> next </Button>
    )
}

export function PageWithNext({url, character, children}) {
    return(
        <div>
            <PageHeader>{url}</PageHeader>
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
        <h1>{title}</h1>
    )
}

// export function TabbedPage({ data, handler, bin = null }) {
//     return (<Tabs>
//         <TabList>
//             {Object.keys(data).map(k => <Tab disabled={data[k].pool().length == 0}>{k.replace('_', ' ')}</Tab>)}
//         </TabList>
//         {Object.values(data).map(v => <TabPanel>
//             <Category bins={v} binner={bin} handler={handler} />
//         </TabPanel>)}
//     </Tabs>)
// }

// export function Page({ ch, binner, handler }) {
//     if (Object.keys(ch.options).length > 1) {
//         return (<TabbedPage data={ch.options} bin={binner} handler={handler} />)
//     }
//     else {
//         return (<SinglePage bins={ch.options} binner={binner} handler={handler} />)
//     }
// }

// export function BlankPage({content}) {
//     return (
//         <div className='page'>
//         {content}
//         </div>
//         )}