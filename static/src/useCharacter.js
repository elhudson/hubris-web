import { useImmerReducer } from "use-immer"
import {current} from 'immer'
export function useCharacter(ch) {    
    const [character, dispatch] = useImmerReducer(dispatcher, ch)
    function dispatcher(draft, action) {
        if (action.type=='add') {
            var f=ruleset[action.target][action.id]
            draft.purchase(f)
        }
        if (action.type=='drop') {
            var f=ruleset[action.target][action.id]
            draft.refund(f)
        }
        if (action.type=='bin') {
            draft.options[action.target].regroup(action.value)
        }
        if (action.type=='bio') {
            action.content=="" && (action.content=action.inner)
            draft.bio.update(action.target, action.content)
        }
        if (action.type=='update-score') {
            var ref=current(draft)
            if (action.direction=='up') {
                var atm=action.costs[action.value]
                var next=action.costs[Number(action.value)+1]
                var diff=next-atm
                if (ref.ability_scores.points-diff>=0) {
                    draft.ability_scores[action.code]+=1
                    draft.ability_scores.points-=diff
                }
            }
            if (action.direction=='down') {
                var atm=action.costs[action.value]
                var next=action.costs[Number(action.value)-1]
                var diff=next-atm
                draft.ability_scores[action.code]-=1
                draft.ability_scores.points-=diff
            }
        }
    }
    return [character, dispatch]
}


