import { Button, Buttons } from "./interactive";
import { Item, LabeledItem } from "./containers"

import { Field } from "./text";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";

export default function Dialog({ header, error, buttons, items, handler }) {
    const theme = useTheme()
    return (
        <div className={css`
            border:${theme.border};
            max-width:500px;
            width:50%;
            position:absolute;
            top:50%;
            right:50%;
            margin:auto;
            transform:translate(50%, -50%);
            >div:last-child {
                border:unset;
                border-top:${theme.border};
            }
        `}>
            <h1 className={css`
            border-bottom: ${theme.border};
            text-align: center;
            padding: unset;
            margin: unset;
            `}>{header}</h1>
            <Error error={error} />
            <div>
                {items.map(item =>
                    <Item label={item.label}>
                        <Field data={item.data} hidden={item.hidden} handler={handler} toggleble={false} />
                    </Item>
                )}

            </div>
            <Buttons vertical={false}>
                {buttons.map(b =>
                    <Button onClick={b.handler}>
                        {b.txt}
                    </Button>)}
            </Buttons>
        </div>
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



