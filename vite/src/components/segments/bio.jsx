import { Block, Item, Region, Row } from '@elements/containers'
import { current, immerable } from "immer"

import { Dropdown } from "@elements/interactive"
import { Field } from "@elements/text"
import Info from "@models/section"

export default class Bio extends Info {
    [immerable] = true
    constructor() {
        var skeleton = {
            name: "",
            gender: "",
            appearance: "",
            backstory: "",
            alignment: 'lg'
        }
        super(skeleton)
    }
    static parse(raw) {
        var self = super.parse(raw)
        self.name == "" && (self.name = "Unnamed Character")
        return self
    }
    displayLong({ patch }) {
        function FullBio({ obj, handler }) {
            return (
                <div>
                    <Row>
                        <Alignment update={handler} selected={obj.alignment} below={true} />
                        <Item label='name' below={true}>
                            <Field data={{ text: obj.name, path: 'name' }} handler={handler} toggleable={true} />
                        </Item>
                        <Item label='gender' below={true}>
                            <Field data={{ text: obj.gender, path: 'gender' }} handler={handler} toggleable={true} />
                        </Item>
                    </Row>
                    <Item label='appearance' below={true}>
                        <Field data={{ text: obj.appearance, path: 'appearance' }} handler={handler} toggleable={true} size='big' />
                    </Item>
                    <Item label='backstory' below={true}>
                        <Field data={{ text: obj.backstory, path: 'backstory' }} handler={handler} toggleable={true} size='big' />
                    </Item>
                </div>
            )
        }
        return (<FullBio obj={this} handler={patch('bio', 'update')} />)
    }
}
export function Alignment({ update, selected, below = false }) {
    return (<Item below={below} label={'alignment'}>
        <Dropdown name={'alignment'} path={'alignment'} data={ruleset.reference.alignments} handler={update} selected={selected} />
    </Item>)

}

