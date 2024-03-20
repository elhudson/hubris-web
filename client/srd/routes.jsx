import { Calculator, Entry, Powers, Table } from "@client/srd";

import { redirect } from "react-router-dom";

const queries = {
  class_features: {
    include: {
      classes: true,
      class_paths: true,
      requires: true,
      required_for: true
    }
  },
  backgrounds: {
    include: {
      settings: true,
      background_features: true,
      skills: true,
      attributes: true
    }
  },
  classes: {
    include: {
      class_paths: true,
      tags: true,
      attributes: true,
      hit_dice: true
    }
  },
  ranges: {
    include: {
      area: true,
      range: true,
      requires: true,
      required_for: true,
      trees: true
    }
  },
  durations: {
    include: {
      requires: true,
      required_for: true,
      trees: true
    }
  },
  effects: {
    include: {
      trees: true,
      tags: true,
      requires: true,
      required_for: true
    }
  },
  skills: {
    include: {
      attributes: true,
      backgrounds: true
    }
  },
  tag_features: {
    include: {
      tags: true,
      requires: true,
      required_for: true
    }
  },
  settings: {
    include: {
      backgrounds: true
    }
  },
  injuries: {
    include: {
      conditions: true
    }
  }
};

const table = async ({ params }) => {
  const query = queries[params.table];
  const res=await fetch(`/data/rules?table=${params.table}&relations=true`).then((r) =>
    r.json()
  );
  return res
};

const entry = async ({ params }) => {
  return fetch(`/data/entry?table=${params.table}&id=${params.feature}`);
};

export default () => ({
  path: "srd",
  children: [
    {
      path: "calculator",
      element: <Calculator />
    },
    {
      path: "powers",
      loader: () => fetch("/data/powers").then((j) => j.json()),
      element: <Powers />
    },
    {
      path: "mention/:id",
      loader: async ({ params }) => {
        const table = await fetch(`/data/table?id=${params.id}`).then(
          (r) => r.text
        );
        return redirect(`/srd/${table}/${params.id}`);
      }
    },
    {
      path: ":table",
      children: [
        {
          index: true,
          element: <Table />,
          loader: table
        },
        {
          path: ":feature",
          element: <Entry />,
          loader: entry
        }
      ]
    }
  ]
});
