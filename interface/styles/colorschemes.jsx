import { ThemeProvider } from "@emotion/react";
import { IconContext } from "react-icons";
import Color from "color";

import Style from "@styles/global";
import themes from "@styles/themes";
import classes from "@styles/classes";
import { useState } from "react";


export default ({ children }) => {
  const [scheme, setScheme] = useState(
    localStorage.getItem("colorscheme") ?? "gruvbox-light"
  );
  const colors = {
    background: themes[scheme].background,
    text: themes[scheme].foreground,
    accent: themes[scheme].accents["04"],
    text_accent: themes[scheme].accents["05"],
    ...themes[scheme]
  };
  const palette={
    accent1: Color(themes[scheme].foreground).fade(0.95).toString()
  }
  return (
    <ThemeProvider
      theme={{
        colors: colors,
        palette: palette,
        classes: classes({colors, palette}),
        controls: {
          scheme: scheme,
          setScheme: (val) => {
            setScheme(val);
            localStorage.setItem("colorscheme", val);
          }
        }
      }}>
      <IconContext.Provider
        value={{
          color: scheme.foreground,
          size: 15
        }}>
        <Style />
        {children}
      </IconContext.Provider>
    </ThemeProvider>
  );
};
