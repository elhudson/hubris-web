import { Dialog } from "@ui/dialog";
const Login = () => {
  return (
    <Dialog trigger={<button>Login</button>}>
      <form
        method="post"
        action="/login">
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
      </form>
    </Dialog>
  );
};

export default Login;
