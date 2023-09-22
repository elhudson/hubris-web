import Color from "color"

const themes = {
    plain: {
        background: Color('#ffffff'),
        text: Color('#000000'),
        muted: Color('#a9a9a9'),
        light: Color('#eeeeee'),
        size: 14,
        mono: 'IBM Plex Mono',
        sans: 'IBM Plex Sans'
    },
    gruvbox: {
        light: {
            'background': Color('#F2E5BC'),
            'text': Color('#282828'),
            'muted': Color('#A89984'),
            'light': Color('#7C6F64'),
            'size': 14,
            'mono': 'IBM Plex Mono',
            'sans': 'IBM Plex Sans'
        }
    }
}

export default themes