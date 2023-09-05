import Info from "../section"
import React from "react";
import { Region, Row, Block, OptionList, LabeledItem } from "../../../components/components/containers";
import { style } from "../../../components/components/styles";
import { Bonus, Counter, DC } from "../../../components/components/numbers";
import { Groups } from "../featureset";
import { css } from "@emotion/css";

export default class Powers extends Info {
    constructor() {
        var skeleton = {
            effects: new Effects([]),
            metadata: {
                ranges: new Ranges([]),
                durations: new Durations([])
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
        self.effects =Effects.parse(self.effects)
        self.metadata.ranges = Ranges.parse(self.metadata.ranges)
        self.metadata.durations = Durations.parse(self.metadata.durations)
        self.attr=data.attr.name.slice(0,3).toLowerCase()
        self.mod = data.pb + data.scores[self.attr].value
        return self
    }
    display({ patch }) {
        function Powers({ powers, patch }) {
            const handlers = [patch('powers', 'increment'), patch('powers', 'decrement')]
            return (
                <Block header={'Powers'}>
                        <div className={css`
                            display:flex;
                            >div {
                                width:100%;
                            }
                        `}>
                            <LabeledItem label='Power Mod'>
                                <Bonus item={{ label: 'Power Mod', value: powers.mod }} />
                            </LabeledItem>
                            <DC item={{ label: 'Power DC', value: powers.dc() }} />
                            <LabeledItem label='Powers Used'>
                                <Counter update={handlers} item={{ label: 'Powers Used', value: powers.used, path: "used", readOnly: false }} />
                            </LabeledItem>
                        </div>
                    <OptionList>
                        {powers.effects.pool().map(p=>p.displayFeature({ranges:powers.metadata.ranges, durations:powers.metadata.durations}))}
                    </OptionList>
                </Block>
            )
        }
        return <Powers powers={this} patch={patch} />
    }
}

export class Effects extends Groups {
    constructor(data) {
        super(data)
    }
}

export class Ranges extends Groups {
    constructor(data) {
        super(data)
    }
}

export class Durations extends Groups {
    constructor(data) {
        super(data)
    }
}