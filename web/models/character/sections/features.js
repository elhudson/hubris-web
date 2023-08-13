import Info from "../section"
import { immerable } from "immer"
import React from "react";
import Feature from "../../../elements/feature";
import { Region, Block, Snippet, Tabbed } from "hubris-components/containers";
import { SmallHeader } from "hubris-components/text";
import { style } from "hubris-components/styles";
import { Groups } from "../../../rules/sorts";

import _ from "lodash";
export default class Features extends Info {
    [immerable]=true
    constructor() {
        var skeleton={
            class_features:new Groups([]),
            tag_features:new Groups([]),
            backgrounds:new Groups([])
        }
        super(skeleton)
    }
    static parse(raw, backgrounds) {
        var self=super.parse(raw)
        self.class_features=Groups.parse(self.class_features)
        self.tag_features=Groups.parse(self.tag_features)
        self.backgrounds=new Groups([backgrounds.primary, backgrounds.secondary])
        return self
    }
    add(feature) {
        this[feature.table].add(feature)
        return feature.xp
    }  
    includes(feature) {
        return this[feature.table].includes(feature)
    }
    regroup(action) {
        action.path.includes('.') && (action.path=action.path.split(".").slice(1).join('.'))
        _.get(this, action.path).regroup(action.data.value)
    }
    display({patch}) {
        function Features({features, binner}) {
            const styled=style('features', {
                maxHeight:260,
                overflow:'scroll',
                '& > div': {
                    marginBottom:5
                }
            })
            return(
                    <Block header={'Features'} className={styled}>
                        <Tabbed names={['Class', 'Tag', 'Background']}>
                            {features.class_features.display({asOption:false, binner:binner})}
                            {features.tag_features.display({asOption:false, binner:binner})}
                            {features.backgrounds.display({asOption:false, binner:binner})}
                        </Tabbed>
                    </Block>
            )
        }
        return(<Features features={this} binner={patch('features', 'regroup')}/>)
    }
}

