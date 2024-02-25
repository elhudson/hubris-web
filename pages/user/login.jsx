import Dialog from "@ui/dialog";
import { css } from "@emotion/react";
const Login = () => {
  return (
    <Dialog trigger={<button>Login</button>}>
      <form
        method="post"
        action="/login"
        css={css`
        position: relative;
        >a {
          position: absolute;
          top: 0;
          right: 0;
        }
        `}
        >
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
};

export default Login;
