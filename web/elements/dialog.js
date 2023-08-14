import React from "react";
import {Field} from 'hubris-components/text'
import { LabeledItem } from "hubris-components/containers";
import {Buttons, Button} from 'hubris-components/interactive'

export default function Dialog({ header, error, buttons, items, handler }) {
    return (
    <LabeledItem label={header}>
            <Error error={error} />
                <div>
                    {items.map(item =>
                            <Field data={item.data} hidden={item.hidden} handler={handler} toggleble={false} />)}
                </div>
                <Buttons vertical={false}>
                    {buttons.map(b=> 
                        <Button onClick={b.handler}>
                            {b.txt}
                        </Button>

                    )}
                </Buttons>
    </LabeledItem>)
}

function Error({error}) {
    const errors={
        'wrong-password':"Incorrent password! Try again-- or, if you forgot it, message El and she'll get it for you.",
        'no-account':"Account does not exist!",
        'account-exists':'An account with that username already exists.'
    }
    return(
        <div style={error==null ? {display:'none'} : {display:'block'}}>
            {errors[error]}
        </div>
    )
}



