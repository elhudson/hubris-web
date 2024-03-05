import { Classes, Global, Themes } from "@interface/styles";

import Color from "color";
import { IconContext } from "react-icons";
import { ThemeProvider } from "@emotion/react";
import { useState } from "react";

export default ({ children }) => {
  const [scheme, setScheme] = useState(
    localStorage.getItem("colorscheme") ?? "default"
  );
  const colors = {
    background: Themes[scheme].background,
    text: Themes[scheme].foreground,
    accent: Themes[scheme].accents["04"],
    text_accent: Themes[scheme].accents["05"],
    ...Themes[scheme].colors,
  };
  const palette = {
    accent1: Color(Themes[scheme].foreground).fade(0.95).toString(),
    accent2: Color(Themes.accent).fade(0.6).toString(),
  };
  return (
    <ThemeProvider
      theme={{
        colors: colors,
        palette: palette,
        classes: Classes({ colors, palette }),
        controls: {
          scheme: scheme,
          setScheme: (val) => {
            setScheme(val);
            localStorage.setItem("colorscheme", val);
          },
        },
      }}
    >
      <IconContext.Provider
        value={{
          color: scheme.text_accent,
          size: 14,
        }}
      >
        <Style />
        {children}
      </IconContext.Provider>
    </ThemeProvider>
  );
};
