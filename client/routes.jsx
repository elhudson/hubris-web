import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  Outlet
} from "react-router-dom";

import Menu from "./menu";
import { Srd } from "@pages/srd";
import Characters from "@pages/characters";
import Create from "@pages/create";
import Advance from "@pages/advance";
import Sheet from "@pages/sheet";
import Wiki from "@pages/wiki";
import Feature from "@components/feature";

export default createBrowserRouter(
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
      <Route
        path="characters/:user/create"
        element={<Create />}
      />
      <Route
        path="character/:id/advance"
        element={<Advance />}
      />
    </Route>
  )
);
