import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  Outlet
} from "react-router-dom";

import Menu from "./menu";
import pages from "@pages/pages";
const { rules, user, campaign, catalog, character } = pages;
import Background from "@ui/background";
import { css } from "@emotion/react";

export default createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <>
          <Menu />
          <div css={css`
            width: 80%;
            margin: auto;
          `}>
            <Outlet />
          </div>
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
        element={
          <>
            <Outlet />
            <Background type="campaigns" />
          </>
        }>
        <Route
          path="campaign/:id"
          element={<campaign.homepage />}
        />
        <Route
          path="campaign/:id/summaries/:session"
          element={<campaign.summarize />}
        />
      </Route>
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
        path="db/powers"
        element={<catalog.powers />}
      />
    </Route>
  )
);
