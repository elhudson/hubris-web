import React from "react";
import { User, useUser } from '../../models/user'
import { createRoot } from "react-dom/client";
import {styles, style} from 'hubris-components/styles'
import {Block} from 'hubris-components/containers'

const components=require('hubris-components')

import Dialog from "../../elements/dialog";
function Login({error}) {
    const ob=new User()
    const [user, updateUser]=useUser(ob)
    const handleUpdate=(e)=> {
        updateUser({
            type:'edit',
            path:e.target.getAttribute('path'),
            value:e.target.value
        })}
    const handleLogin=(e)=> {
        user.login()
    }
    const handleRegister=(e)=> {
        user.register()
    }
    return(
            <Dialog 
                error={error}
                header={'Welcome to HUBRIS!'} 
                items={[
                    {label:'username', hidden:false, data:{text:user.username, path:'username'}}, 
                    {label:'password', hidden:true, data:{text:user.password, path:'password'}}
                ]}
                buttons={[
                    {txt:'Register', handler:handleRegister},
                    {txt:'Login', handler:handleLogin}
                ]}
                handler={handleUpdate}
            />
    )
}

const error=()=> {
    return String(window.location).includes('error') ?
        String(window.location).split('=')[1] : null
    }

var root=createRoot(document.getElementById('page'))
root.render(<Login error={error()}/>)

