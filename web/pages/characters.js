import { Icon } from '../components/components/images.js';
import React from 'react';
import { useAsync } from 'react-async-hook';
import { Character } from '../models/character/character.js';
import { Button } from '../components/components/interactive.js';
import { User } from '../models/user';
import { css } from '@emotion/css';
import { useTheme } from '@emotion/react';

export default async function chs() {
    var user=User.from_url()
    await user.get_characters()
    return <Characters user={user} />
}

export function Characters({user}) {
    const theme=useTheme();
    return(
        <div className={css`
            max-width: 800px;
            margin: auto;
        `}>
            <div className={css`
                max-width: 100%;
                border: ${theme.border};
                text-transform: uppercase;
                font-weight: bold;
                font-size: ${theme.big}px;
                text-align: center;
                margin-bottom:5px;
            `}>
                My Characters
            </div>
            <div className={css`
                max-width: 100%;
                padding: 5px;
                border: ${theme.border};
                display: grid;
                grid-template-columns: repeat(auto-fit, 200px);
                grid-column-gap: 20px;
            `}>
                {user.characters.map(id => <CharacterThumbnail id={id} />)}
                <NewCharacter user={user}/>
            </div>
        </div>
        )}

function CharacterThumbnail({ id }) {
    const fetchCharacter = async id => (await Character.request(id))
    const asyncHero = useAsync(fetchCharacter, [id])
    return (
        <>
            {asyncHero.result && (asyncHero.result.thumbnail())}
        </>
    )
}

function NewCharacter({user}) {
    const theme=useTheme()
    function handleClick(e) {
        user.create_character()
    }
    return (
        <div className={css`
            border: ${theme.border};
            padding:5px;
            height: fit-content;
            width: 100%;
            > div {
                margin-bottom:5px;
            }
        `}>
            <div className={css`
                border: ${theme.border};
                width: 100%;
                white-space: nowrap;
                text-transform: uppercase;
                text-align: center;
                font-weight: bold;
                a {
                    color: ${theme.text};
                }
            `}>
                <text>New Character</text>
            </div>
            <div className={css`
                svg {
                    height: 150px !important;
                    width: 150px !important;
                }
            `}>
                <Button onClick={handleClick}>
                    <Icon name={'plus'} />
                </Button>
            </div>
        </div>
    )
}