import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button, Buttons } from './interactive.js';
import { style, styles} from './styles.js';

export function NextPage({ current, character }) {
    var progression=['class','backgrounds','stats', 'fluff', 'characters']
    var next=progression[progression.indexOf(current)+1]
    var display=style('bottom-btn', {
        '& button': {
            margin:0
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