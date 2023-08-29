import Info from "../section"
import { immerable } from "immer"
import React from "react";
import { Groups } from "../../../elements/sorts";
import { Block, Tabbed } from "../../../components/components/containers";
import _ from "lodash";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";


export default class Features extends Info {
    [immerable]=true
    constructor() {
        var skeleton={
            class_features:new Groups([]),
            tag_features:new Groups([])
        }
        super(skeleton)
    }
    static parse(raw) {
        var self=super.parse(raw)
        self.class_features=Groups.parse(self.class_features)
        self.tag_features=Groups.parse(self.tag_features)
        delete self.backgrounds
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
    display(backgrounds) {
        function Features({features}) {   
            var items=Object.keys(features)
            return(
                    <Block header={'Features'}>
                        {items.map(key=>
                            <div>
                                {features[key].display({asOption:false})}
                            </div>
                            )}
                        {backgrounds.primary.displayFeature()}
                        {backgrounds.secondary.displayFeature()}
                    </Block>
            )
        }
        return(<Features features={this}/>)
    }
}