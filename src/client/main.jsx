import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, useTheme } from "@emotion/react";
import { IconContext } from "react-icons";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
  Outlet
} from "react-router-dom";
import Menu from "./menu";
import { userContext } from "@contexts/user";
import { Srd } from "./pages/srd";
import Characters from "./pages/characters";
import Advance from "./pages/advance";
import Sheet from "./pages/sheet";
import Wiki from "./pages/wiki";

import Feature from "@components/feature";

import Style from "@styles/global";
import theme from "@styles/theme";

const user = await fetch("/login").then((res) => res.json());

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Wiki />
//   },
//   {
//     path: "*",
//     index: true,
//     element: <Menu />,
//   },
//   {
//     path: "/:user/characters",
//     element: <Characters />
//   },
//   {
//     path: "/:user/:character_id/xp",
//     element: <Advance />
//   },
//   {
//     path: "/:user/:character_name/:id",
//     element: <Sheet />
//   },
//   {
//     path: "/srd",
//     children: [
//       {
//         path: "/srd/:table",
//         element: <Srd />
//       },
//       { path: "/srd/:table/:feature", element: <Feature /> }
//     ]
//   }
// ]);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <>
          <Menu />
          <Outlet />
        </>
      }>
      <Route
        path="/"
        element={<Wiki />}
      />
      <Route
        path="characters/:user"
        element={<Characters />}
      />
      <Route
        path="srd/:table"
        element={<Srd />}
      />
      <Route
        path="srd/:table/:feature"
        element={<Feature />}
      />
      <Route
        path="character/:id"
        element={<Sheet />}
      />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <IconContext.Provider
        value={{
          color: theme.colors.text,
          size: 15
        }}>
        <Style />
        <userContext.Provider value={user}>
          <RouterProvider router={router} />
        </userContext.Provider>
      </IconContext.Provider>
    </ThemeProvider>
  </React.StrictMode>
);
