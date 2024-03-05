import { Calculator } from "@client/power";
import { usePower } from "contexts";

export default () => {
  const { power, update } = usePower();
  return (
    <main>
      <h2>
        <input
          type="text"
          value={power.name}
          onChange={(e) =>
            update((draft) => {
              draft.name = e.target.value;
            })
          }
        />
      </h2>
      <Calculator filters />
    </main>
  );
};
