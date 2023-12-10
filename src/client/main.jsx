import React, { createContext } from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Menu from "./menu";
import { userContext } from "./user";
import { Srd } from "./pages/srd";
import Characters from "./pages/characters";
import Advance from "./pages/advance";
import Sheet from "./pages/sheet";
import Wiki from "./pages/wiki";

const user = await fetch("/login").then((res) => res.json());

const router = createBrowserRouter([
  {
    path: "/",
    element: <Wiki />
  },
  {
    path: "/:user/characters",
    element: <Characters />
  },
  {
    path: "/xp",
    element: <Advance />
  },
  {
    path: "/:user/:character_name/:id",
    element: <Sheet />
  },
  {
    path: "/srd",
    children: [
      {
        path: "/srd/:table",
        element: <Srd />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <userContext.Provider value={user}>
      <Menu />
      <RouterProvider router={router}></RouterProvider>
    </userContext.Provider>
  </React.StrictMode>
);
