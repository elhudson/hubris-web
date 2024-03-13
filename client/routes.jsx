import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { App } from "@interface/components";
import { Routes as Campaign } from "@client/campaign";
import { Routes as Character } from "@client/character";
import Directory from "@src/client/directory";
import { Routes as Srd } from "@client/srd";
import { Routes as User } from "@client/user";

export default () => {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          element: (
            <App>
              <Outlet />
            </App>
          ),
          children: [
            {
              index: true,
              element: <Directory />,
              loader: async () => fetch("/data/tables").then((j) => j.json()),
            },
            Srd(),
            Campaign(),
            User(),
            Character(),
          ],
        },
      ])}
    />
  );
};
