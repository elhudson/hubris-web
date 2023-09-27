import { css } from '@emotion/css'
import { Page } from '@elements/pages';

import _ from 'lodash'
import { useContext } from 'react';
import {useAsync} from 'react-async-hook'
import { userContext } from '@models/user';

export default function Characters() {
    const user = useContext(userContext)
    const getCharacters=async()=>await user.characters()
    const characters=useAsync(getCharacters)
    return (
        <Page title='My Characters'>
            <div className={css`
                display:grid;
                grid-gap:10px;
                grid-template-columns:repeat(auto-fill, 200px);
             `}>
                {characters.result && 
                    characters.result.length>0 ? characters.result.map(c=>c.thumbnail()) :
                    "You haven't created any characters yet."
                }
            </div>
        </Page>
    )
}
