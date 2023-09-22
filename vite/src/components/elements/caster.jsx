import { Popup, Button } from "@elements/interactive"
import { useContext, useState } from "react"
import { powerContext } from "@sections/powers"
import { MenuItem, Select } from "@mui/base"
import { DC } from '@elements/numbers'
import { css } from '@emotion/css'
import _, { indexOf } from 'lodash'
import { useTheme } from "@emotion/react"
import { Item } from '@elements/containers'

export default function UsePower({ feature, meta }) {
    const data = useContext(powerContext)
    const ranges = [meta.ranges.filter(m => m.applies(feature))].flat()
    const durations = [meta.durations.filter(d => d.applies(feature))].flat()
    const applicable = {
        ranges: Object.fromEntries(ranges.map(m => [ranges.indexOf(m), m])),
        durations: Object.fromEntries(durations.map(m => [durations.indexOf(m), m]))
    }
    const [range, setRange] = useState(null)
    const [duration, setDuration] = useState(null)
    const [dc, setDc] = useState(data.dc)
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
                display:flex;
                button {
                    width:100%;
                }
            `}>
                <SelectMetadata label={'Range'} obj={applicable.ranges} index={range} handler={handleRange} />
                <SelectMetadata label={'Duration'} obj={applicable.durations} index={duration} handler={handleDuration} />
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

                        `
                    },
                    listbox: {
                        className: css`
                            background-color:${theme.background};
                            display:flex;
                            padding:2px;
                            border:${theme.border};
                            border-radius:5px;
                        `
                    }
                }}
                renderValue={() => {
                    if (index == null)
                        return <Item label={label} />;
                    else {
                        return <Item label={label}>{obj[index].name}</Item>
                    }

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