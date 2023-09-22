import React, { useContext } from "react";
import { User, useUser, userContext } from '@models/user'

import Dialog from "@elements/dialog";
import Uri from "jsuri";

export default function Login() {
    const error=new Uri(window.location.href).getQueryParamValue('error')
    const usr=useContext(userContext)
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
        var characters=await user.get_characters()
        var clone={...user}
        clone.id=response.id
        clone.characters=characters
        clone.validated=true
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