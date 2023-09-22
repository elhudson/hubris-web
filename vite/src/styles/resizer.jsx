import { useState, useEffect } from "react";

export default function makeResizable() {
    const [dimensions, setDimensions] = useState({
        height: window.visualViewport.height,
        width: window.visualViewport.width
    })
    function debounce(fn, ms) {
        let timer
        return _ => {
            clearTimeout(timer)
            timer = setTimeout(_ => {
                timer = null
                fn.apply(this, arguments)
            }, ms)
        };
    }
    useEffect(() => {
        const dbResize = debounce(function handleResize() {
            setDimensions({
                height: window.visualViewport.height,
                width: window.visualViewport.width
            })
        })
        window.addEventListener('resize', dbResize)
        return _ => {
            window.removeEventListener('resize', dbResize)
        }
    })
    return dimensions
}