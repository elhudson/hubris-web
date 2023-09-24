import { Block, Tabbed } from "@elements/containers";

import Groups from "@models/featureset";
import Info from "@models/section"
import React from "react";
import _ from "lodash";
import { css } from "@emotion/css";
import { immerable } from "immer"
import { useTheme } from "@emotion/react";

export default class Features extends Info {
    [immerable] = true
    constructor() {
        var skeleton = {
            class_features: new ClassFeatures([]),
            tag_features: new TagFeatures([])
        }
        super(skeleton)
    }
    static parse(raw) {
        var self = super.parse(raw)
        self.class_features = ClassFeatures.parse(self.class_features)
        self.tag_features = TagFeatures.parse(self.tag_features)
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
        action.path.includes('.') && (action.path = action.path.split(".").slice(1).join('.'))
        _.get(this, action.path).regroup(action.data.value)
    }
    display(backgrounds) {
        function Features({ features }) {
            return (
                <Block header={'Features'}>
                    {features.class_features.display({ asOption: false })}
                    {features.tag_features.display({ asOption: false })}
                    {backgrounds.primary.displayFeature()}
                    {backgrounds.secondary.displayFeature()}
                </Block>
            )
        }
        return (<Features features={this} />)
    }
}

export class TagFeatures extends Groups {
    constructor(data) {
        super(data)
    }
}

export class ClassFeatures extends Groups {
    constructor(data) {
        super(data)
    }
}