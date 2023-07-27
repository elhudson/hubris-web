import React from "react";
import { Field, HiddenField } from "./utils";

export function Dialog({ header, error, buttons, items, handler }) {
    return (
        <div className="dialog">
            <h1>{header}</h1>
            <Error error={error} />
            <div class='content'>
                {items.map(item =>
                    item.hidden ?
                        <HiddenField label={item.label} data={item.data} id={item.id} handler={handler} /> :
                        <Field label={item.label} data={item.data} id={item.id} handler={handler} />)}
            </div>
            <Buttons data={buttons} />
        </div>
    )
}

function Error({error}) {
    const errors={
        'wrong-password':"Incorrent password! Try again-- or, if you forgot it, message El and she'll get it for you.",
        'no-account':"Account does not exist!",
        'account-exists':'An account with that username already exists.'
    }
    return(
        <div className='error'>
            {errors[error]}
        </div>
    )
}

function Buttons({data}) {
    return (
        <div class='buttons'>
            {data.map(item=> 
                <button type='button' onClick={item.handler}>{item.txt}</button> )}
        </div>
    )
}


