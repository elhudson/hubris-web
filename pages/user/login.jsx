import { css } from "@emotion/react";
import { forwardRef } from "react";
import Dialog from "@ui/dialog";

const Login = forwardRef(({ ...props }, ref) => {
  return (
    <Dialog
      trigger={
        <button
          ref={ref}
          style={{ display: "none" }}
        />
      }>
      <form
        method="post"
        action="/login"
        css={css`
          position: relative;
          > a {
            position: absolute;
            top: 0;
            right: 0;
          }
        `}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="user"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="pwd"
          />
        </div>
        <button type="submit">Submit</button>
        <a href="/register">Create Account</a>
      </form>
    </Dialog>
  );
});

export default Login;
