export default () => {
  return (
    <form
      method="post"
      action="/register">
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
  );
};
