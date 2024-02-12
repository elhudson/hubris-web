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
import { css, useTheme } from "@emotion/react";

import { useParams } from "react-router-dom";
import { sql_danger } from "utilities";

const Rules = () => {
  const { colors } = useTheme();
  const { table } = useParams();
  return (
    <>
      <h2>{sql_danger(table)}</h2>
      <div
        css={css`
          border: 1px solid ${colors.accent};
          padding: 10px;
          max-height: 85vh;
          overflow: scroll;
          &::scrollbar-track-color {
            color: ${colors.accent};
          }
        `}>
        {rules[table]()}
      </div>
    </>
  );
};

export default createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <>
          <Menu />
          <container
            css={css`
              display: inline-block;
              width: 100%;
              height: 95vh;
              overflow: hidden;
              > main {
                width: 80%;
                margin: auto;
                height: 90vh;
              }
            `}>
            <main>
              <Outlet />
            </main>
          </container>
        </>
      }>
      <Route
        path="/"
        element={<rules.wiki />}
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
          element={<Rules />}
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
    </Route>
  )
);
