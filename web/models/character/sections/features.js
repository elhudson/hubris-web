import Info from "../section"
import { immerable } from "immer"
import React from "react";
import Feature from "../../../elements/feature";
import { Region, Block, Snippet } from "hubris-components/containers";
import { SmallHeader } from "hubris-components/text";
import { style } from "hubris-components/styles";
import { Groups } from "../../../rules/sorts";


export default class Features extends Info {
    [immerable]=true
    constructor() {
        var skeleton={
            class_features:new Groups([]),
            tag_features:new Groups([])
        }
        super(skeleton)
    }
    static parse(json) {
        return super.parse('features', json)
    }
    add(feature) {
        this[feature.table].enqueue(feature)
        return feature.xp
    }  
    includes(feature) {
        return this[feature.table].includes(feature)
    }
    Features({features}) {
        const styled=style('features', {
            '& > div': {
                marginBottom:5
            }
        })
        return(
                <Block header={'Features'} className={styled}>
                    <Snippet snip={<SmallHeader>Class Features</SmallHeader>}>
                        {features.class_features.map(f=><Feature feature={f} />)}
                    </Snippet>
                    <Snippet snip={<SmallHeader>Tag Features</SmallHeader>}>
                        {features.tag_features.map(f=><Feature feature={f} />)}
                    </Snippet>
                    <Snippet snip={<SmallHeader>Background Features</SmallHeader>}>
                        {features.backgrounds.map(f=><Feature feature={f} />)}
                    </Snippet>
                </Block>
        )
    }
}

