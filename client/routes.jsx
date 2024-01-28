import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  Outlet
} from "react-router-dom";

import Menu from "./menu";
import pages from "@pages/pages";
const { rules, user, campaign, catalog, character } = pages;

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
        element={<rules.wiki />}
      />
      <Route
        path="creations/:user"
        element={<user.creations />}
      />
      <Route
        path="srd/:table"
        element={<rules.srd />}
      />
      <Route
        path="srd/:table/:feature"
        element={<rules.entry />}
      />
      <Route
        path="character/:id"
        element={<character.homepage />}
      />
      <Route
        path="campaign/:id"
        element={<campaign.homepage />}
      />
      <Route
        path="characters/:user/create"
        element={<character.create />}
      />
      <Route
        path="character/:id/advance"
        element={<character.advance />}
      />
      <Route
        path="campaigns/:user/create"
        element={<campaign.create />}
      />
      <Route
        path="campaign/:id/summaries/create"
        element={<campaign.summarize />}
      />
      <Route
        path="db/powers"
        element={<catalog.powers />}
      />
    </Route>
  )
);
