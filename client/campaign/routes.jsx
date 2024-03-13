import { Create, Homepage, Summarize } from "@client/campaign";

export default () => ({
  path: "campaign",
  children: [
    {
      path: "create",
      element: <Create />,
    },
    {
      path: ":id",
      children: [
        {
          index: true,
          element: <Homepage />,
          loader: async ({ params }) =>
            fetch(`/data/campaign?id=${params.id}`).then((j) => j.json()),
        },
        {
          path: "session",
          children: [{ path: ":session", element: <Summarize /> }],
        },
      ],
    },
  ],
});
