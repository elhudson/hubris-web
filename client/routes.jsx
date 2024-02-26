import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  Outlet
} from "react-router-dom";

import Menu from "./menu";
import pages from "@pages/pages";
const { rules, user, campaign, catalog, character, tools } = pages;
import Background from "@ui/background";
import { css, useTheme } from "@emotion/react";

const App = ({ children }) => {
  const { colors } = useTheme();
  return (
    <main
      css={css`
        height: 90vh;
        width: 80%;
        margin: auto;
        overflow: scroll;
      `}>
      {children}
    </main>
  );
};

export default createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <>
          <Menu />
          <App>
            <Outlet />
          </App>
        </>
      }>
      <Route
        path="/"
        element={<rules.wiki />}
      />

      <Route
        path="/register"
        element={<user.register />}
      />

      <Route element={<Outlet />}>
        <Route
          path=":user/creations"
          element={<user.creations />}
        />
        <Route
          path=":user/create/character"
          element={<character.create />}
        />
        <Route
          path=":user/create/campaign"
          element={<campaign.create />}
        />
      </Route>

      <Route element={<Outlet />}>
        <Route
          path="srd/:table"
          element={<rules.table />}
        />
        <Route
          path="srd/:table/:feature"
          element={<rules.entry />}
        />
      </Route>

      <Route element={<Outlet />}>
        <Route
          path="character/:id"
          element={<character.homepage />}
        />
        <Route
          path="character/:id/advance"
          element={<character.advance />}
        />
      </Route>
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
        path="db/powers"
        element={<catalog.powers />}
      />
      <Route
        path="tools/calculator"
        element={<rules.calculator />}
      />
    </Route>
  )
);
