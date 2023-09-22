import { Button, Buttons } from '@elements/interactive';
import { css } from '@emotion/css';
import { useTheme } from '@emotion/react';

export function NextPage({ current, character }) {
    var progression = ['class', 'backgrounds', 'stats', 'skills', 'bio', 'save']
    var next = progression[progression.indexOf(current) + 1]
    async function proceed() {
        if (ruleset.condition(current, character) == true) {
            sessionStorage.setItem('character', JSON.stringify(character))
            if (next == 'save') {
                character.save()
                await character.write()
                window.location.assign(character.routes.characters)
            }
            else { window.location.assign('/create?' + new URLSearchParams({ character: character.id, stage: next })) }
        }
        else { alert('Please choose all required options before proceeding.') }
    }
    return (
        <Buttons>
            <Button onClick={proceed}> next </Button>
        </Buttons>
    )
}

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