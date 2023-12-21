import { useCharacter } from "@contexts/character";
import { useAsync } from "react-async-hook";
import _ from "lodash";
import { useState } from "react";
import Option from "./option";

export default () => {
  const { character, update } = useCharacter();
  const [settings, setSettings] = useState(null);
  const backgrounds = useAsync(async () => {
    const bgs = await fetch("/data/rules?table=backgrounds&relations=true").then((j) =>
      j.json()
    );
    const settings = [...new Set(bgs.map((s) => s.setting))];
    setSettings(
      Object.fromEntries(
        settings.map((s) => [s, bgs.filter((f) => f.setting == s)])
      )
    );
    return bgs;
  }).result;

  const [addable, setAddable] = useState(true);

  const addBackground = (e, id) => {
    update((draft) => {
      _.isUndefined(draft.backgrounds) && (draft.backgrounds = []);
      if (e) {
        if (draft.backgrounds.length == 2) {
          setAddable(false);
        } else {
          const bg = _.find(backgrounds, (f) => f.id == id);
          if (
            !(
              bg.setting != "Core" &&
              draft.backgrounds.map((b) => b.setting).includes(bg.setting)
            )
          ) {
            draft.backgrounds.push(bg);
          }
        }
      } else {
        _.remove(draft.backgrounds, (f) => f.id == id);
        setAddable(true);
      }
    });
  };

  return (
    <>
      {backgrounds && (
        <div>
          {Object.keys(settings).map((s) => (
            <div>
              <h4>{s}</h4>
              {settings[s].map((b) => (
                <Option
                  data={b}
                  avail={addable}
                  owned={
                    character.backgrounds &&
                    character.backgrounds.map((a) => a.id).includes(b.id)
                  }
                  buy={(e) => addBackground(e, b.id)}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
