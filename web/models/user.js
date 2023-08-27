import { useImmerReducer } from "use-immer";
import { immerable, current } from "immer";
import _ from "lodash";
import { Character } from "./character/character";
import { Icon } from '../components/components/images.js';
import React from 'react';
import { useAsync } from 'react-async-hook';
import { Button } from '../components/components/interactive.js';
import { css } from '@emotion/css';
import { useTheme } from '@emotion/react';
import Uri from 'jsuri';
import { useContext } from 'react';
import { userContext } from '../hubris.js';
import { Menu } from "../components/components/interactive.js";
import { MenuItem } from "@mui/base";

export const useUser = (data) => {
    const [user, dispatch] = useImmerReducer(dispatcher, data)
    function dispatcher(draft, action) {
        if (action.type == 'edit') {
            _.set(draft, action.path, action.value)
        }
    }
    return [user, dispatch]
}

export class User {
    [immerable] = true
    constructor() {
        this.username = "",
        this.password = ""
    }
    static parse(json) {
        var self = new User()
        Object.assign(self, json)
        return self
    }
    static from_url() {
        var params = new URLSearchParams(window.location.href.split('?')[1])
        var user_data = JSON.parse(sessionStorage.getItem('user'))
        var js = {
            ...user_data,
            id: params.get('user')
        }
        return User.parse(js)
    }
    static in_memory() {
        return Object.keys(sessionStorage).includes('user')
    }
    async login() {
        var data = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify(this),
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => response.json())

        return data
    }
    logout() {
        sessionStorage.clear()
        window.location.assign('/')
    }
    save() {
        sessionStorage.setItem('user', JSON.stringify(this))
    }
    async register() {
        var data = JSON.stringify(this)
        var request = await fetch('/register', {
            method: 'POST',
            body: data
        }).then((request) => request.json())
        sessionStorage.setItem('user', JSON.stringify(this))
    }
    async get_characters() {
        var characters = await fetch('/user?' + new URLSearchParams({ user: this.id }))
        var data = await characters.json().then((res) => res.flat(10))
        return data
    }
    async create_character() {
        var init = await fetch('/new_character?' + new URLSearchParams({ user: this.id }))
        var data = await init.json()
        var character = new Character(data.id, data.user)
        sessionStorage.removeItem('character')
        sessionStorage.setItem('character', JSON.stringify(character))
        return data.url
    }
    async focus_character() {
        var char_id = await this.create_character()
        var character = await Character.load(char_id)
        sessionStorage.setItem('character', JSON.stringify(character))
    }
}

export function UserMenu() {
    const theme = useTheme()
    const user = useContext(userContext)
    const handleCreate=async ()=> {
        const redirect=await user.create_character()
        window.location.assign(redirect)
    }
    const handleGet=()=> {
        window.location.assign('/characters?'+new URLSearchParams({user:user.id}))
    }
    const handleLogout=()=> {
        user.logout()
    }
    return (
        <div className={css`
            background-color:${theme.background};
            border-bottom:${theme.border};
            button.MuiMenuButton-root {
                height:fit-content;
                position:absolute;
                top:10px;
                left:10px;
            }
            h1 {
                text-align:center;
                width:100%;
            }
            display:inline-flex;
            position:fixed;
            width:100%;
            `}>
            {user == null ?
                <></> :
                <Menu icon={<Icon name='dice' sx={css`
                    svg {
                        height:50px;
                        width:auto;
                    }
                    `} />}>
                    <MenuItem onClick={handleCreate}>
                        New Character
                    </MenuItem>
                    <MenuItem onClick={handleGet}>
                        My Characters
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        Log Out
                    </MenuItem>
                </Menu>}
            <h1>
                HUBRIS
            </h1>
        </div>)
}



export function Characters({ids}) {
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
                {ids.map(id => <CharacterThumbnail id={id} />)}
            </div>
        </div>
    )}

function CharacterThumbnail({ id }) {
    const fetchCharacter = async id => (await Character.request(id))
    const asyncHero = useAsync(fetchCharacter, [id])
    console.log(asyncHero)
    return (
        <>
            {asyncHero.result && (asyncHero.result.thumbnail())}
        </>
    )
}