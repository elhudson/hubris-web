import React, { useContext } from "react";
import { User, userContext, useUser } from '../models/user'
import Dialog from "../elements/dialog";
import Uri from "jsuri";

export default function Login({ usr, error }) {
    const [user, editUser] = useUser(usr)
    const handleInput = (e) => {
        editUser({
            type: 'edit',
            path: e.target.getAttribute('path'),
            value: e.target.value
        })
    }
    const handleLogin = async () => {
        var response = await user.login()
        editUser({
            type: 'edit',
            path: 'id',
            value: response.id
        })
        var clone={...user}
        clone.id=response.id
        sessionStorage.setItem('user',JSON.stringify(clone))
        window.location.assign('/characters?' + new URLSearchParams({ user: response.id }))
    }
    const handleRegister = () => {
        user.register()
    }
    return (
        <Dialog
            error={error}
            header={'Welcome to HUBRIS!'}
            items={[
                { label: 'username', hidden: false, data: { text: user.username, path: 'username' } },
                { label: 'password', hidden: true, data: { text: user.password, path: 'password' } }
            ]}
            buttons={[
                { txt: 'Register', handler: handleRegister },
                { txt: 'Login', handler: handleLogin }
            ]}
            handler={handleInput}
        />
    )
}