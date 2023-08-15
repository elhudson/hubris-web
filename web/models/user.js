import { useImmerReducer } from "use-immer";
import { immerable } from "immer";
import _ from "lodash";
import { Character } from "./character/character";
import { validate } from "uuid";

export const useUser = (data) => {
    const [user, dispatch]=useImmerReducer(dispatcher, data)
    function dispatcher(draft, action) {
        console.log(action)
        if (action.type=='edit') {
            _.set(draft, action.path, action.value)
        }
    }
    return [user, dispatch]
}

export class User {
    [immerable]=true
    constructor() {
        this.username="",
        this.password="",
        this.characters=[]
    }
    static parse(json) {
        var self=new User()
        Object.assign(self, json)
        return self
    }
    static from_url() {
        var user_id=window.location.pathname.split('/').at(-1)
        var user_data=JSON.parse(sessionStorage.getItem('user'))
        var js={
            ...user_data,
            id:user_id
        }
        return User.parse(js)
    }
    async login() {
        var data=await fetch('/login', {
            method:'POST',
            body:JSON.stringify(this)
        })
        sessionStorage.setItem('user',JSON.stringify(this))
        window.location.assign(data.url)
    }
    static async register() {
        var data=JSON.stringify(this)
        var request=await fetch('/register', {
            method:'POST',
            body:data
        })
        sessionStorage.setItem('user', JSON.stringify(this))
        return window.location.assign(request.url)
        }
    new_character() {
        this.characters.push(Character.create())
    }
    async get_characters() {
        var characters=await fetch(`/${this.id}`)
        var data=await characters.json()
        data.forEach(async (id)=> {
            if (validate(id)) {
                var ch=await Character.request(id)
            }
        })
        return data
    }
}
