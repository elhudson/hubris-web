import { Editor, Homepage } from "@client/character";

const getOptions = async (character, location) =>
  await fetch(`/data/character/options`, {
    method: "POST",
    body: JSON.stringify(character),
    headers: {
      "Content-Type": "application/json",
      location,
    },
  }).then((r) => r.json());

const getCharacter = async (id) =>
  await fetch(`/data/character?id=${id}`).then((j) => j.json());

export default () => ({
  path: "character",
  children: [
    {
      path: "create",
      loader: async ({ params }) => {
        const {character, options}=await fetch(`/data/character/create`).then(res=> res.json())
        return { character, options };
      },
      element: <Editor.Create />,
    },
    {
      path: ":id",
      children: [
        {
          index: true,
          element: <Homepage />,
          loader: async ({ params }) => getCharacter(params.id),
        },
        {
          path: "advance",
          element: <Editor.Advance />,
          loader: async ({ params }) => {
            const character = await getCharacter(params.id);
            const options = await getOptions(character, "update");
            return { character, options };
          },
        },
      ],
    },
  ],
});
