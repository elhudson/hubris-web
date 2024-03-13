import { Editor, Homepage } from "@client/character";

const getter = async ({ params }) =>
  fetch(`/data/character?id=${params.id}`).then((j) => j.json());

export default () => ({
  path: "character",
  children: [
    {
      path: "create",
      element: <Editor.Create />,
    },
    {
      path: ":id",
      children: [
        {
          index: true,
          element: <Homepage />,
          loader: getter,
        },
        { path: "advance", element: <Editor.Advance />, loader: getter },
      ],
    },
  ],
});
