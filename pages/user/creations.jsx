import Characters from "./characters";
import Campaigns from "./campaigns";

export default () => {
  return (
    <div>
      <section>
        <h3>Characters</h3>
        <Characters />
      </section>
      <section>
        <h3>Campaigns</h3>
        <Campaigns />
      </section>
    </div>
  );
};
