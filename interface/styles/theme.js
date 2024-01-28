import Color from "color";

const theme = {
  colors: {
    background: "#FBF1C7",
    text: "#282828",
    accent: "#665C54",
    red: "#CC241D"
  }
};

theme.palette = {
  accent1: Color(theme.colors.text).fade(0.95).toString()
};

export default theme;
