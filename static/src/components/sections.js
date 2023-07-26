import React from "react";

export function Section({ open, header, items, cls, style = null }) {
    var c = cls + " content"
    return (
        <details open={open} className='subsection sectioned'>
            <summary> {header}  <img src='/static/assets/right-arrow.svg' /> </summary>
            <div className={c} style={style}>
                {items}
            </div>
        </details>
    )

}

export function ReadMore({ v, setToggle }) {
    var img;
    v == false ? img = <img src='/static/assets/plus.svg' /> : img = <img src='/static/assets/minus.svg' />
    return (
        <button type='button' class='expander' value={v} onClick={setToggle}>{img}</button>
    )
}