import { immerable } from "immer"
import Info from "../section"

import React from 'react'
import {Region, Block, Item} from 'hubris-components/containers'
import {Dropdown} from 'hubris-components/interactive'

export default class Bio extends Info {
    [immerable] = true
    constructor() {
        var skeleton={
            name:null,
            gender:null,
            appearance:null,
            backstory:null,
            alignment:'lg'
        }
        super(skeleton)
    }
    static parse(json) {
        super.parse('bio', json)
    }
    Bio({ ch, patch=null }) {
        var update=patch('bio', 'update')
        return (
                <Block header={'Bio'}>
                    <Item label={'name'}>
                        {ch.name}
                    </Item>
                    <Item label={'class'}>
                        {ch.classes[0].name}
                    </Item>
                    <Item label={'backgrounds'} >
                        {ch.backgrounds[0].name + ' & ' + ch.backgrounds[1].name}
                    </Item>
                    <Item label={'alignment'}>
                        <Alignment update={update} selected={ch.bio.alignment} />
                    </Item>
                </Block>
        )
    }
}
export function Alignment({update, selected}) {
    <Item label={'alignment'}>
        <Dropdown name={'alignment'} path={'alignment'} data={ruleset.reference.alignments} handler={update} selected={selected} />
    </Item>

}
