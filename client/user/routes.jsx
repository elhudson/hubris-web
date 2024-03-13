import { Creations, Register } from "@client/user";

export default () => ({
  path: "user",
  children: [
    {
      path: "register",
      element: <Register />,
    },
    {
      path: ":user",
      children: [
        {
          index: true,
          loader: async () => fetch(`/data/user`).then((h) => h.json()),
          element: <Creations />,
        },
      ],
    },
  ],
});
