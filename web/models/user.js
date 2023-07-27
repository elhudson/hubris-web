import { useImmerReducer } from "use-immer";
import { immerable } from "immer";

export const useUser = (data) => {
    const [user, dispatch]=useImmerReducer(dispatcher, data)
    function dispatcher(draft, action) {
        if (action.type=='edit') {
            draft[action.target]=action.value
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
}
