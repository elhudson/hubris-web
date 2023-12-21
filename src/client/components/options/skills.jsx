import { useCharacter } from "@contexts/character";
import { useAsync } from "react-async-hook";
import _ from "lodash";
import Skill from "@components/character/skill";

export default () => {
  const { update } = useCharacter();
  const skills = useAsync(
    async () =>
      await fetch("/data/rules?table=skills&relations=true").then((k) =>
        k.json()
      )
  ).result;
  const handleSkill = (e, id) => {
    update((draft) => {
      const skill = _.find(skills, (f) => f.id == id);
      const known = draft.skills.length;
      const free =
        draft.int +
        2 +
        draft.backgrounds.map((s) => s.skills).filter((f) => f != null).length;
      if (e) {
        if (known < free) {
          draft.skills.push(skill);
        } else {
          const cost = 2 + Math.abs(known - free);
          if (draft.xp_spent + cost <= draft.xp_earned) {
            draft.skills.push(skill);
            draft.xp_spent += cost;
          }
        }
      } else {
        if (
          !draft.backgrounds
            .filter((f) => f.skills != null)
            .map((s) => s.skills.id)
            .includes(id)
        ) {
          if (known > free) {
            const refund = 1 + Math.abs(known - free);
            draft.xp_spent -= refund;
          }
          _.remove(draft.skills, (s) => s.id == id);
        }
      }
    });
  };
  return (
    <div>
      {skills &&
        skills.map((c) => (
          <Skill
            skill={c}
            editable={true}
            onCheck={(e) => handleSkill(e, c.id)}
          />
        ))}
    </div>
  );
};
