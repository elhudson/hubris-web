import React from "react";
import { User, useUser } from '../models/user'
import { createRoot } from "react-dom/client";
import Dialog from "../elements/dialog";
import Uri from "jsuri";
export default function login() {
    const error=new Uri(window.location.href).getQueryParamValue('error')
    return(<Login error={error} />)
}

function Login({error}) {
    const ob=new User()
    const [user, updateUser]=useUser(ob)
    const handleUpdate=(e)=> {
        updateUser({
            type:'edit',
            path:e.target.getAttribute('path'),
            value:e.target.value
        })}
    const handleLogin= async (e)=> {
        await user.login()
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