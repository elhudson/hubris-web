import { immerable, current } from "immer"
import Info from "../section"

import React from 'react'
import {Region, Block, Item, Row} from '../../../components/components/containers'
import { Field, Textbox } from "../../../components/components/text"
import { Dropdown } from "../../../components/components/interactive"

export default class Bio extends Info {
    [immerable] = true
    constructor() {
        var skeleton={
            name:"",
            gender:"",
            appearance:"",
            backstory:"",
            alignment:'lg'
        }
        super(skeleton)
    }
    static parse(raw) {
        var self=super.parse(raw)
        self.name=="" && (self.name="Unnamed Character")
        return self
    }
    FullBio({obj, handler}) {
        return(
        <div>
            <Row>
            <Alignment update={handler} selected={obj.alignment} below={true}/>
            <Item label='name' below={true}>
                <Field data={{text: obj.name, path:'name'}} handler={handler} toggleable={true}/>
            </Item>
            <Item label='gender' below={true}>
                <Field data={{text:obj.gender, path:'gender'}} handler={handler} toggleable={true}/>
            </Item>
            </Row>
            <Item label='appearance' below={true}>
                <Field data={{text:obj.appearance, path:'appearance'}} handler={handler} toggleable={true} size='big'/>
            </Item>
            <Item label='backstory' below={true}>
                <Field data={{text:obj.backstory, path:'backstory'}} handler={handler} toggleable={true} size='big'/>
            </Item>
        </div>
        )
    }
    Bio({ ch, patch=null }) {
        var update=patch('bio', 'update')
        return (
                <Block header={'Bio'}>
                    <Item label={'name'}>
                        {ch.name}
                    </Item>
                    <Item label={'class'}>
                        {ch.classes.base.name}
                    </Item>
                    <Item label={'backgrounds'} >
                        {ch.backgrounds.primary.name + ' & ' + ch.backgrounds.secondary.name}
                    </Item>
                    <Alignment update={update} selected={ch.bio.alignment} />
                </Block>
        )
    }
}
export function Alignment({update, selected, below=false}) {
    return (<Item below={below} label={'alignment'}>
        <Dropdown name={'alignment'} path={'alignment'} data={ruleset.reference.alignments} handler={update} selected={selected} />
    </Item>)

}


