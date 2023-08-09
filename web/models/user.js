import { useImmerReducer } from "use-immer";
import { immerable } from "immer";
import _ from "lodash";

export const useUser = (data) => {
    const [user, dispatch]=useImmerReducer(dispatcher, data)
    function dispatcher(draft, action) {
        if (action.type=='edit') {
            _.set(draft, action.path, action.value)
        }
    }
    return [user, dispatch]
}

export class User {
    [immerable]=true
    constructor() {
        this.username=null,
        this.password=null,
        this.characters=[]
    }
    login() {
        var data=JSON.stringify(this)
        fetch('/login', {
            method:'POST',
            body:data
        }).then((result)=>
            window.location.assign(result.url))
    }
    register() {
        var data=JSON.stringify(this)
        fetch('/register', {
            method:'POST',
            body:data
        }).then((result)=>
            window.location.assign(result.url))
        }
    new_character() {
        pass
    }
    get_characters() {
        pass
    }
}
