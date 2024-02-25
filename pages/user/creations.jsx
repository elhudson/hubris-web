import Characters from "./characters";
import Campaigns from "./campaigns";
import { css } from "@emotion/react";
import { useParams } from "react-router-dom";
import { useUser } from "@contexts/user";
export default () => {
  const { user } = useParams();
  const current = useUser();
  return (
    <div>
      {!current.logged_in || current?.username != user ? (
        <div>
          You're not logged in.
        </div>
      ) : (
        <>
          <section>
            <h2>Characters</h2>
            <Characters />
          </section>
          <section>
            <h2>Campaigns</h2>
            <Campaigns />
          </section>
        </>
      )}
    </div>
  );
};
