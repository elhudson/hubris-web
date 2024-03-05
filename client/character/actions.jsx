import { Alert, Counter } from "@interface/ui";
import { GiFamilyTree, GiNightSleep, GiQuill } from "react-icons/gi";
import { forwardRef, useRef, useState } from "react";
import { useCharacter, useUser } from "contexts";

import { BiSolidCastle } from "react-icons/bi";
import { FaTrashAlt } from "react-icons/fa";
import Roll from "roll";
import _ from "lodash";
import { css } from "@emotion/react";
import { get_max_hp } from "utilities";
import { useImmer } from "use-immer";

export default () => {
  const { character, update } = useCharacter();
  const deleteRef = useRef(null);
  const shortRestRef = useRef(null);
  const menu = [
    {
      label: "Delete",
      action: () => deleteRef.current.click(),
      render: <Delete ref={deleteRef} />,
      icon: <FaTrashAlt />
    },
    {
      label: "Level Up",
      action: () =>
        window.location.assign(`/character/${character.id}/advance`),
      icon: <GiFamilyTree />
    },
    {
      label: "Short Rest",
      action: () => shortRestRef.current.click(),
      render: <ShortRest ref={shortRestRef} />,
      icon: <GiNightSleep />
    },
    {
      label: "Long Rest",
      icon: <BiSolidCastle />,
      action: () =>
        update((draft) => {
          draft.burn = 0;
          draft.health.hp = get_max_hp(draft);
          draft.HD.forEach((hd) => {
            hd.used = 0;
          });
        })
    }
  ];
  character.campaign &&
    menu.push({
      label: "Write Summary",
      action: () =>
        window.location.assign(
          `/campaign/${character.Campaign.id}/summaries/create`
        ),
      icon: <GiQuill />
    });
  return menu;
};

export const ShortRest = forwardRef(function Func(props = null, ref) {
  const { character, update } = useCharacter();
  const [isRolling, setIsRolling] = useState(false);
  const [hp, setHp] = useState(0);
  const [open, setOpen] = useState(false);
  const [dice, setDice] = useImmer(
    character.HD.map((d) => ({
      die: d.die,
      rolling: 0,
      avail: d.max - d.used
    }))
  );
  const rollDice = () => {
    setIsRolling(true);
    dice.forEach(async (d) => {
      const instruction = String(d.rolling) + d.die.title;
      const rng = new Roll();
      setHp(hp + rng.roll(instruction).result);
    });
  };
  const setNewHp = () => {
    update((draft) => {
      if (draft.health.hp + hp > get_max_hp(draft)) {
        draft.health.hp = get_max_hp(draft);
      } else {
        draft.health.hp += hp;
      }
      draft.HD.forEach((die) => {
        const used = _.find(dice, (d) => d.die.id == die.die.id).rolling;
        die.used += used;
      });
    });
    setIsRolling(false);
    setHp(0);
  };
  return (
    <div
      css={css`
        > button:first-child {
          display: none;
        }
      `}>
      <Alert
        open={open}
        setOpen={setOpen}
        confirm={isRolling ? setNewHp : null}
        button={
          <button
            ref={ref}
            style={{ display: "none" }}
          />
        }>
        <div
          style={{ display: isRolling ? "none" : "block" }}
          css={css`
            position: relative;
            > button:last-child {
              position: absolute;
              top: 0;
              right: 0;
            }
            div.griddable {
              display: grid;
              width: calc(100%-20px);
              grid-template-columns: 30px auto;
              h5 {
                font-size: 20px;
              }
            }
          `}>
          <h4>Choose your hit dice</h4>
          <div css="griddable">
            {dice.map((d) => {
              const inc = () =>
                setDice((draft) => {
                  _.find(draft, (a) => a.die.id == d.die.id).rolling += 1;
                });
              var dec = () =>
                setDice((draft) => {
                  _.find(draft, (a) => a.die.id == d.die.id).rolling -= 1;
                });
              return (
                <>
                  <h5>{d.die.title}</h5>
                  <Counter
                    item={d}
                    dec={dec}
                    inc={inc}
                    max={d.avail}
                    valuePath="rolling"
                  />
                </>
              );
            })}
          </div>
          <button onClick={rollDice}>Roll</button>
        </div>
        <div style={{ display: isRolling ? "block" : "none" }}>
          <h5>{hp} HP Gained</h5>
        </div>
      </Alert>
    </div>
  );
});

export const Delete = forwardRef(function Func(props = null, ref) {
  const { character } = useCharacter();
  const { username } = useUser();
  const handleDelete = async () => {
    await fetch(`/data/character/delete?id=${character.id}`, {
      method: "POST"
    });
    window.location.assign(`/${username}/creations`);
  };
  return (
    <div
      css={css`
        > button:first-child {
          display: none;
        }
      `}>
      <Alert
        confirm={handleDelete}
        button={
          <button
            ref={ref}
            style={{ display: "none" }}
          />
        }>
        <div>
          <h4>Are you sure?</h4>
          <p>Once you delete a character, you can't recover them.</p>
        </div>
      </Alert>
    </div>
  );
});
