import { useTheme } from "@emotion/react";
import Radio from "@ui/radio";
import themes from "@styles/themes";

export default () => {
  const { controls } = useTheme();
  const { scheme, setScheme } = controls;
  const ts = Object.keys(themes).map((t) => ({
    label: t,
    action: ()=> setScheme(t)
  }));
  return ts
  // return (
  //   <Radio
  //     data={themeOptions}
  //     current={{
  //       name: scheme
  //     }}
  //     valuePath="name"
  //     labelPath="name"
  //     onChange={(e) => setScheme(e)}
  //     inline={false}
  //   />
  // );
};
