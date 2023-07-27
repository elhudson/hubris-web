import { useState } from 'react';
import React from 'react';
import { ReactSVG } from 'react-svg';

export function Counter({ limiter = null, boosted = false, item, update, costs }) {
    !Object.hasOwn(item, 'min') && (item.min = 0)
    !Object.hasOwn(item, 'max') && (item.max = 999999)
    if (boosted) {
        item.value += 1
        item.max += 1
        item.min += 1
    }
    const [count, setCount] = useState(item.value)
    function increase(e) {
        if (count < item.max && limiter != 0) {
            if (limiter!=1 || costs[count]-costs[count+1]==-1) {
                setCount(c => Number(c) + 1)
                var p = count
                if (boosted) {
                    p -= 1
                }
                update('up', costs, p, item.code)
            }

        }
    }
    function decrease(e) {
        if (count > item.min) {
            setCount(c => Number(c) - 1)
            var p = count
            if (boosted) {
                p -= 1
            }
            update('down', costs, p, item.code)
        }
    }
    var buttons = null
    if (item.readonly == false) {
        buttons=<UpDown increase={increase} decrease={decrease} />
    }
    return (<div className="item counter">
        <label>{item.label}</label>
        <input type='number' readonly={item.readonly} id={item.id} value={count} />
        {buttons}
    </div>)
}

export function UpDown({increase, decrease}) {
    return (
        <div className='toggles'>
            <button type="button" onClick={increase}>
                <Icon name={'plus'} />
            </button>
            <button type="button" onClick={decrease}>
                <Icon name={'minus'} />
            </button>
        </div>
    )
}


export function Field({label, data, id, handler}) {
    return (
        <div className='item'>
            <label>{label}</label>
            <input id={id} type='text' value={data} onChange={handler} />
        </div>
    )
}

export function HiddenField({label, data, id, handler}) {
    return (
        <div className='item'>
            <label>{label}</label>
            <input type='password' id={id} value={data} onChange={handler} />
        </div>
    )
    
}

export function BigField({label, data, id, handler}) {
    return (
        <div className='item big'>
            <label>{label}</label>
            <textarea id={id} onChange={handler}>{data}</textarea>
        </div>
    )
}

export function Bonus({ item }) {
    var sign;
    item.value < 0 ? sign = <img src='/static/assets/minus.svg' /> : sign = <img src='/static/assets/plus.svg' />
    return (
        <div className="item bonus">
            <label>{item.label}</label>
            <div className='modifier'>
                {sign}
                <Modifier editable={item.readonly} id={item.id} value={Math.abs(item.value)} />
            </div>
        </div>
    )

}

function Modifier({ editable, id, value }) {
    return (<input type='number' readonly={editable} id={id} value={value} />)
}

export function DC({ item }) {
    return (
        <div className="item dc">
            <label>{item.label}</label>
            <Modifier editable={item.readonly} id={item.id} value={item.value} />
        </div>
    )
}

export function Points({ item }) {
    return (
        <div className='item points'>
            <label>{item.label}</label>
            <Modifier editable={false} id={item.id} value={item.value} />
        </div>
    )
}

export function Item({ label, content }) {
    return (
        <div className='item'>
            <label>{label}</label>
            &nbsp;
            <span>{content}</span>
        </div>
    )
}

export function Dropdown({ label, data, handler, selected = null }) {
    return (
        <div className='item'>
            <label>{label}</label> &nbsp;
            <select id={label} defaultValue={selected} onChange={handler}>
                {Object.keys(data).map(opt =>
                    <option value={opt}>
                        {data[opt]}
                    </option>
                )}
            </select>
        </div>
    )
}
export function Icon({ name }) {
    var path = `/static/assets/icons/${name}.svg`
    return (
        <div className='icon'>
            <ReactSVG src={path} />
        </div>
    )
}

export function Radio({ label, data, onChange, readonly = true }) {
    if (readonly) {
        data.forEach((d) => { d.available = false })
    }
    return (<div className='item box'>
        <label>{label}</label>
        <div className='bubbles'>
            {data.map(item =>
                <div class='bubble'>
                    <input onChange={onChange} data-target={label} value={item.value} type='radio' disabled={!item.available} checked={item.selected} />
                    <label>{item.label}</label>
                </div>)}
        </div>
    </div>)
}

export function Tracker({ left, right, update }) {
    return (
        <div className="tracker item">
            <Counter item={left} update={update} />
            <Counter item={right} update={update} />
        </div>
    )
}



export const useToggle = (initialState) => {
    const [toggleValue, setToggleValue] = useState(initialState);
    const toggler = () => { setToggleValue(!toggleValue) };
    return [toggleValue, toggler]
};

