import * as av from "@radix-ui/react-avatar";
import { css } from "@emotion/css";
import { forwardRef, useRef, useState } from "react";
import { useCharacter } from "@contexts/character";
import { useTheme } from "@emotion/react";
import Context from "@ui/context";

const Upload = forwardRef(({ accept, name, setImage }, ref) => {
  const { colors } = useTheme();
  const handleChange = (ref) => {
    setImage({
      url: URL.createObjectURL(ref.current.files[0]),
      file: ref.current.files[0]
    });
  };
  return (
    <div
      className={css`
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
        background-color: ${colors.background};
      `}>
      <input
        style={{ display: "none" }}
        type="file"
        name={name}
        accept={accept}
        ref={ref}
        onChange={handleChange}
      />
    </div>
  );
});

export default ({ id = null, sz = 100 }) => {
  const { character } = useCharacter();
  const ref = useRef(null);
  const endpt = `/data/character/avatar?id=${character.id}`;
  const url = id
    ? `/portraits/${id}.png`
    : "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2Ffd%2F8c%2F75%2Ffd8c754d06e4e4799669ae3d13daf276.jpg&f=1&nofb=1&ipt=00669a87519e5052099232ee43c280f88c22f7ddccda6dea23bf7affeb1b97eb&ipo=images";
  const [img, setImage] = useState({
    url: url,
    file: null
  });
  const handleChange = () => {
    ref.current.click();
  };
  return (
    <Context
      trigger={
        <div
          className={css`
              all: unset;
              position: relative;
              height: 100%;
            `
          }>
          <av.Root
            className={css`
              display: inline-flex;
              align-items: center;
              justify-content: center;
              vertical-align: middle;
              overflow: hidden;
              width: ${sz}px;
              height: ${sz}px;
              user-select: none;
              .avatar {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: 0 0;
              }
            `}>
            <av.Image
              className="avatar"
              src={img.url}
            />
          </av.Root>
          <Upload
            name="profile"
            accept={"image/*"}
            setImage={setImage}
            ref={ref}
          />
        </div>
      }
      items={[
        {
          label: "Replace",
          action: handleChange
        },
        {
          label: "Save",
          action: async () => {
            const form = new FormData();
            form.append("profile", ref.current.files[0]);
            await fetch(endpt, {
              method: "POST",
              body: form
            });
          }
        }
      ]}
    />
  );
};
