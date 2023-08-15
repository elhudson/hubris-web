import React from "react";
import { Field } from "../components/components/text";
import { LabeledItem } from "../components/components/containers"
import { Button, Buttons } from "../components/components/interactive";
import { style, styles } from "../components/components/styles";

export default function Dialog({ header, error, buttons, items, handler }) {
    return (
        <>
        <h1 style={{width:'fit-content', margin:'auto'}}>Welcome to HUBRIS!</h1>
        <div style={{
            border:styles.border,
            width:300,
            margin:'auto'}}>
            <div style={{ margin: 5 }}>
                <Error error={error} />
                <div>
                    {items.map(item =>
                        <Field data={item.data} hidden={item.hidden} handler={handler} toggleble={false} />)}
                </div>
            </div>
            <Buttons 
                className={style('bottom-btns', {
                    borderBottom:'unset !important',
                    borderLeft:'unset !important',
                    borderRight:'unset !important'
                    })} 
                vertical={false}>
                        {buttons.map(b =>
                            <Button onClick={b.handler}>
                                {b.txt}
                            </Button>

                )}
            </Buttons>
        </div>
        </>
    )
}

function Error({ error }) {
    const errors = {
        'wrong-password': "Incorrent password! Try again-- or, if you forgot it, message El and she'll get it for you.",
        'no-account': "Account does not exist!",
        'account-exists': 'An account with that username already exists.'
    }
    return (
        <div style={error == null ? { display: 'none' } : { display: 'block' }}>
            {errors[error]}
        </div>
    )
}



