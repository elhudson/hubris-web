import { useImmerReducer } from "use-immer"

export default function useOptions(options, ch) {
    const [choices, dispatch] = useImmerReducer(dispatcher, options)
    function dispatcher(draft, action) {
        var focus = draft[action.location]
        if (action.type == 'group') {
            focus.regroup(action.value)
        }
        else {
            var feature = featurify(action)
            var writer=action.dispatch
            if (action.type == 'add') {
                buy(ch, focus, feature, writer)
            }
            if (action.type == 'drop') {
                unbuy(ch, focus, feature, writer)
            }
        }
        function featurify(action) {
            var f;
            Object.hasOwn(action, 'table') ? f = 'table' : f = 'location'
            return ruleset[action[f]][action.id]
        }
    }
    return [choices, dispatch]
}

function buy(ch, focus, feature, dispatch) {
    focus.content[feature.get(focus.by)]=focus.buy(feature)
    dispatch({
        type:'add',
        target:feature.table,
        id:feature.id,
        cost:feature.xp,
        dispatch:optwrite
    })
}

function unbuy(char, focus, feature, dispatch) {
    focus.get(feature).bought=false
    focus.get(feature).children().forEach((ch)=> {ch!=undefined && (ch.bought=false)})
    focus.content[focus.find_branch(feature)]=focus.dequal(char, feature)
    dispatch({
        type:'drop',
        target:feature.table,
        id:feature.id,
        cost:feature.cost
    })
}