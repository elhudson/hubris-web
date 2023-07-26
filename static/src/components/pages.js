import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Category } from './categories';

export function NextPage({ current, character }) {
    var progression=['class','backgrounds','stats','xp','fluff']
    var next=progression[progression.indexOf(current)+1]
    function save() {
        if (ruleset.condition(current, character) == true) {
            sessionStorage.setItem(character.id, JSON.stringify(character))
            window.location.assign(`/${next}`)
        }
        else { alert('Please choose all required options before proceeding.') }
    }
    return (
        <button className='next' type='button' onClick={save}> Next </button>
    )
}

function SinglePage({ bins, binner, handler }) {
    var tabl = Object.values(bins)[0]
    return (
        <Category binner={binner} bins={tabl} handler={handler} />
    )
}

function TabbedPage({ data, handler, bin = null }) {
    return (<Tabs>
        <TabList>
            {Object.keys(data).map(k => <Tab disabled={data[k].pool().length == 0}>{k.replace('_', ' ')}</Tab>)}
        </TabList>
        {Object.values(data).map(v => <TabPanel>
            <Category bins={v} binner={bin} handler={handler} />
        </TabPanel>)}
    </Tabs>)
}

export function Page({ ch, binner, handler }) {
    if (Object.keys(ch.options).length > 1) {
        return (<TabbedPage data={ch.options} bin={binner} handler={handler} />)
    }
    else {
        return (<SinglePage bins={ch.options} binner={binner} handler={handler} />)
    }
}

