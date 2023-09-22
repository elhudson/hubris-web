import { createContext, useContext } from 'react';
import { current, immerable } from "immer";

import { Character } from "@models/character";
import { Icon } from '@elements/images';
import { Menu } from "@elements/interactive";
import { MenuItem } from "@mui/base";
import Uri from 'jsuri';
import _ from "lodash";
import { css } from '@emotion/css';
import { useAsync } from 'react-async-hook';
import { useImmerReducer } from "use-immer";
import { useTheme } from '@emotion/react';

import dice from '@assets/icons/dice.svg'

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
        this.password = "",
        this.validated=false
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
        var request = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify(this),
            headers: { 'Content-Type': 'application/json' }
        })
        if (new Uri(request.url).hasQueryParam('error')) {
            window.location.assign(request.url)
        }
        else {
            var data=await request.json()
            return data
        }
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
        })
        sessionStorage.setItem('user', JSON.stringify(this))
        window.location.assign(request.url)
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

export const userContext = createContext(new User())


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
            position:sticky;
            width:100%;
            `}>
                <Menu icon={<Icon 
                    path={dice} 
                    sx={css`
                        svg {
                            height:50px;
                            width:auto;
                        }
                    `} 
                    />}>
                    <MenuItem onClick={handleCreate}>
                        New Character
                    </MenuItem>
                    <MenuItem onClick={handleGet}>
                        My Characters
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        Log Out
                    </MenuItem>
                </Menu>
                <h1>
                    HUBRIS
                </h1>
        </div>)
}

