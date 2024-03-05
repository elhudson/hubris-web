import { Themes } from "@interface/styles";
import { useTheme } from "@emotion/react";

export default () => {
  const { controls } = useTheme();
  const { setScheme } = controls;
  const ts = Object.keys(Themes).map((t) => ({
    label: t,
    action: ()=> setScheme(t)
  }));
  return ts
};
