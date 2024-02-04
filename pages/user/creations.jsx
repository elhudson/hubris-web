import Characters from "./characters";
import Campaigns from "./campaigns";
import { css } from "@emotion/react";
export default () => {
  return (
    <div>
      <section>
        <h2>Characters</h2>
        <Characters />
      </section>
      <section>
        <h2>Campaigns</h2>
        <Campaigns />
      </section>
    </div>
  );
};
