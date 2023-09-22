import { Character } from '@models/character';
import { css } from '@emotion/css'
import { Page } from '@elements/pages';

import _ from 'lodash'
import { useContext } from 'react';
import {useAsync} from 'react-async-hook'
import { userContext } from '@models/user';

export default function Characters() {
    const user = useContext(userContext)
    const ids = user.characters
    return (
        <Page title='My Characters'>
            <div className={css`
                display:grid;
                grid-gap:10px;
                grid-template-columns:repeat(auto-fill, 200px);
             `}>
                {ids.map(id => <CharacterThumbnail id={id} />)}
            </div>
        </Page>
    )
}

function CharacterThumbnail({ id }) {
    const asyncChar=async (data)=> await Character.load(id)
    const character=useAsync(asyncChar)
    return (
        <>
            {character.result && (character.result.thumbnail())}
        </>
    )
}