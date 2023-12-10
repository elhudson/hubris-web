import { useAsync } from "react-async-hook";
import * as dialog from "@radix-ui/react-dialog";

const Login = () => {
  return (
    <dialog.Root>
      <dialog.Trigger asChild>
        <button>Login</button>
      </dialog.Trigger>
      <dialog.Portal>
        <dialog.Content>
          <form
            method="post"
            action="/login">
            <input
              type="text"
              name="user"
            />
            <input
              type="text"
              name="pwd"
            />
            <button type="submit">Submit</button>
          </form>
        </dialog.Content>
      </dialog.Portal>
    </dialog.Root>
  );
};

export default Login;
