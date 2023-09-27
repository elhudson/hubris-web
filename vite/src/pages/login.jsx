import React, { useContext } from "react";
import { useUser, userContext } from '@models/user'

import Dialog from "@elements/dialog";
import Uri from "jsuri";

export default function Login() {
    const error=new Uri(window.location.href).getQueryParamValue('error')
    const usr=useContext(userContext)
    const [user, editUser] = useUser(usr)
    console.log('here')
    const handleInput = (e) => {
        editUser({
            type: 'edit',
            path: e.target.getAttribute('path'),
            value: e.target.value
        })
    }
    const handleLogin = async () => {
        await user.login().then((url)=>window.location.assign(url))
    }
    const handleRegister = async () => {
        await user.register().then((url)=>window.location.assign(url))
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