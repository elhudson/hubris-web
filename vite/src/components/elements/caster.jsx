import { Popup, Button, Label} from "@elements/interactive"
import { useContext, useState } from "react"
import { powerContext } from "@sections/powers"
import { MenuItem, Select } from "@mui/base"
import { DC } from '@elements/numbers'
import { css } from '@emotion/css'
import _, { indexOf } from 'lodash'
import { useTheme } from "@emotion/react"
import { Icon } from "@elements/images"

export default function UsePower({ feature, meta }) {
    const theme=useTheme()
    const data = useContext(powerContext)
    const ranges = [meta.ranges.filter(m => m.applies(feature))].flat()
    const durations = [meta.durations.filter(d => d.applies(feature))].flat()
    const applicable = {
        ranges: Object.fromEntries(ranges.map(m => [ranges.indexOf(m), m])),
        durations: Object.fromEntries(durations.map(m => [durations.indexOf(m), m]))
    }
    const [range, setRange] = useState(0)
    const [duration, setDuration] = useState(0)
    const [dc, setDc] = useState(data.dc+feature.dc_add(applicable.ranges[range], applicable.durations[duration]))
    const handleRange = (event) => {
        if (event != null) {
            var i=event.target.getAttribute('value')
            setRange(i)
            setDc(data.dc + feature.dc_add(applicable.ranges[i], applicable.durations[duration]))
        }
    }
    const handleDuration = (event) => {
        if (event != null) {
            var i=event.target.getAttribute('value')
            setDuration(i)
            setDc(data.dc + feature.dc_add(applicable.ranges[range], applicable.durations[i]))
        }
    }
    return (
        <Popup preview='Use'>
            <h1>Power Calculator</h1>
            <div className={css`
                display:flex;
                width:100%;
                >div {
                    width:100%;
                }
            `}>
                <DC item={{ label: 'Success', value: dc }} />
                <DC item={{ label: 'Miscast', value: dc - 5 }} />
            </div>
            <div className={css`
                >div {
                    display:flex;
                    align-items:center;
                    border:${theme.border};
                    margin:5px;
                    button {
                        width:100%;
                    }
                    div {
                        margin:unset;
                        height:fit-content;
                    }
                    >div {
                         border:${theme.border};
                         &:first-child {
                            margin-left:5px;
                         }
                    }
                }
            `}>
                <div>
                    <Label content='Range'>
                        <Icon name={'ui/distance'} size={16} />
                    </Label>
                    <SelectMetadata label={'Range'} obj={applicable.ranges} index={range} handler={handleRange} />
                </div>
                <div>
                    <Label content='Duration'>
                        <Icon name={'ui/stopwatch'} size={16} />
                    </Label>
                    <SelectMetadata label={'Duration'} obj={applicable.durations} index={duration} handler={handleDuration} />
                </div>
            </div>
        </Popup>
    )
}

function SelectMetadata({ label, obj, index, handler }) {
    const theme = useTheme()
    return (
        <>
            <Select
                onChange={handler}
                value={index}
                name={label}
                slots={{
                    listbox: 'div'
                }}
                slotProps={{
                    root: {
                        className: css`
                            background-color:${theme.transparent};
                            border:${theme.border};
                            margin:5px;
                            :hover{
                                cursor:pointer;
                            }
                        `
                    },
                    popper: {
                        className: css`
                            background-color:${theme.background};
                            padding:3px;
                            margin:0px;
                            box-shadow:${theme.shadow};
                            border-radius:5px;
                            border:${theme.border};
                        `
                    },
                    listbox: {
                        className: css`
                            background-color:${theme.background};
                            display:flex;
                            padding:2px;
                            border-radius:5px;
                            width:100%;
                        `
                    }
                }}
                renderValue={() => {
                    return obj[index].name
                }}
            >
                {Object.entries(obj).map(r =>
                    <MenuItem
                        value={Number(r[0])}
                        slots={{ root: 'div' }}
                        className={css`
                            border:${theme.border};
                            border-radius:5px;
                            padding:0px 2px;
                            font-size:${theme.small + 2}px;
                            font-family:${theme.mono};
                            :hover {
                                cursor: pointer;
                            }
                        `}
                    >
                        {r[1].name}
                    </MenuItem>)}
            </Select >
        </>

    )
}