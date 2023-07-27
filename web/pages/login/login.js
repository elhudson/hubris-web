import React from "react";
import { createRoot } from "react-dom/client";
import { Dialog } from "../../components/dialog";
import {immerable} from 'immer';
import {useImmerReducer} from 'use-immer';
import { BlankPage } from "../../components/pages";
import './login.scss';

function Login({error}) {
    const ob=new User()
    const [user, updateUser]=useUser(ob)
    const handleUpdate=(e)=> {
        updateUser({
            type:'edit',
            target:e.target.id,
            value:e.target.value
        })}
    const handleLogin=(e)=> {
        user.login()
    }
    const handleRegister=(e)=> {
        user.register()
    }
    return(
        <BlankPage content={
            <Dialog 
                error={error}
                header={'Welcome to HUBRIS!'} 
                items={[
                    {label:'username',id:'username',value:user.username}, 
                    {label: 'password', id:'password', value:user.password}
                ]}
                buttons={[
                    {txt:'Register', handler:handleRegister},
                    {txt:'Login', handler:handleLogin}
                ]}
                handler={handleUpdate}
            />} 
        />
    )
}

const error=()=> {
    return String(window.location).includes('error') ?
        String(window.location).split('=')[1] : null
    }

var root=createRoot(document.getElementById('page'))
root.render(<Login error={error()}/>)

