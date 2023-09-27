import { createContext, useContext } from 'react';
import { current, immerable } from "immer";

import { Character } from "@models/character";
import { Icon } from '@elements/images';
import { Menu } from "@elements/interactive";
import { MenuItem } from "@mui/base";
import Uri from 'jsuri';
import _ from "lodash";
import { css } from '@emotion/css';
import { useImmerReducer } from "use-immer";
import { useTheme } from '@emotion/react';

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
        this.validated = false
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
            sessionStorage.setItem('user', JSON.stringify({
                ...this,
                validated:false
            }))
        }
        else {
            sessionStorage.setItem('user', JSON.stringify({
                ...this,
                validated: true,
                id: new Uri(request.url).getQueryParamValue('user')
            }))            
        }
        return request.url
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
        }).then((j)=>j.json())
        this.id=request.id
        this.validated=request.validated
        sessionStorage.setItem('user', JSON.stringify(this))
        return request.url
    }
    async characters() {
        var characters = await fetch('/user?' + new URLSearchParams({ user: this.id }))
            .then((result)=>result.json())
            .then((result)=>result.map(c=>Character.parse(c)))
        return characters
    }
    async create_character() {
        var init = await fetch('/new_character?' + new URLSearchParams({ user: this.id }))
        var data = await init.json()
        var character = new Character(data.id, data.user)
        sessionStorage.removeItem('character')
        sessionStorage.setItem('character', JSON.stringify(character))
        return data.url
    }
}

export const userContext = createContext(new User())


export function UserMenu() {
    const theme = useTheme()
    const user = useContext(userContext)
    const handleCreate = async () => {
        const redirect = await user.create_character()
        window.location.assign(redirect)
    }
    const handleGet = () => {
        window.location.assign('/characters?' + new URLSearchParams({ user: user.id }))
    }
    const handleLogout = () => {
        user.logout()
    }
    return (
        <>
        {user.validated &&
            <Menu icon={
                <Icon
                name={'ui/dice'}
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
        }
        </>

    )
}

