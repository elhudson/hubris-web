import Info from "../section"
import { immerable } from "immer"
import React from "react";
import Feature, { FeatureMeta } from "../../../elements/feature";
import { Region, Row, Block, OptionList, Snippet } from "hubris-components/containers";
import { SmallHeader } from "hubris-components/text";
import { style } from "hubris-components/styles";
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs'
import { Bonus, Counter, DC } from "hubris-components/numbers";
import { Groups } from "../../../rules/sorts";

export default class Powers extends Info {
    constructor() {
        var skeleton = {
            effects: new Groups([]),
            metadata: {
                ranges: new Groups([]),
                durations: new Groups([])
            },
            used: 0,
            attr: null
        }
        super(skeleton)
    }
    dc() {
        return 10 + this.used
    }
    static parse(raw, data) {
        var self = super.parse(raw)
        self.effects = new Groups(self.effects)
        self.metadata.ranges = new Groups(self.metadata.ranges)
        self.metadata.durations = new Groups(self.metadata.durations)
        self.attr=data.attr.name.slice(0,3).toLowerCase()
        self.mod = data.pb + data.scores[self.attr].value
        return self
    }
    display({ patch }) {
        function Powers({ powers, patch }) {
            const handlers = [patch('powers', 'increment'), patch('powers', 'decrement')]
            return (
                <Block header={'Powers'}>
                    <Row>
                        <Bonus item={{ label: 'Power Mod', value: powers.mod }} />
                        <DC item={{ label: 'Power DC', value: powers.dc() }} />
                        <Counter update={handlers} item={{ label: 'Powers Used', value: powers.used, path: "used", readOnly: false }} />
                    </Row>
                    <OptionList>
                        {powers.effects.map(f =>
                            <div>
                                <Feature
                                    feature={f}
                                    meta={powers.metadata} />
                            </div>)}
                    </OptionList>
                </Block>
            )
        }
        return <Powers powers={this} patch={patch} />
    }
}

