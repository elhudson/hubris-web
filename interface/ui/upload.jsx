import * as av from "@radix-ui/react-avatar";
import { css } from "@emotion/css";
import { forwardRef, useRef, useState } from "react";
import { useCharacter } from "@contexts/character";
import { useTheme } from "@emotion/react";
import Context from "@ui/context";

const Upload = forwardRef(({ accept, name, setImage }, ref) => {
  const { colors } = useTheme();
  const handleChange = () => {
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

export default ({ endpoint, path, sz }) => {
  const ref = useRef(null);
  const [img, setImage] = useState({
    url: path,
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
          `}>
          <av.Root
            className={"pic "+css`
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
            await fetch(endpoint, {
              method: "POST",
              body: form
            });
          }
        }
      ]}
    />
  );
};
