import { Button, Buttons } from '@elements/interactive';
import { css } from '@emotion/css';
import { useTheme } from '@emotion/react';

export function Page({ title, children }) {
    const theme=useTheme()
    return (
        <div className={css`
            max-width:800px;
            min-width:400px;
            width:50%;
            margin:auto;
            margin-top:10px;
        `}>
            <div className={css`
                border: ${theme.border};
                text-transform: uppercase;
                font-weight: bold;
                font-size: ${theme.big}px;
                text-align: center;
                margin-bottom:5px;
            `}>
                {title}
            </div>
            <div className={css`
                border:${theme.border};
                padding:5px;
            `}>
                {children}
            </div>
        </div>
    )
}