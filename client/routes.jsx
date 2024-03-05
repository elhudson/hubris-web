import * as Campaign from "@client/campaign";
import * as Character from "@client/character";
import * as Power from "@client/power";
import * as Srd from "@client/srd";
import * as User from "@client/user";

import { Background, Scrollable } from "@interface/ui";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { css, useTheme } from "@emotion/react";

import Menu from "@src/client/menu";

const App = ({ children }) => {
  return (
    <main
      css={css`
        height: 95vh;
        width: 80%;
        margin: auto;
      `}
    >
      <Scrollable>{children}</Scrollable>
    </main>
  );
};

export default () => (
  <BrowserRouter>
    <Routes>
      <Route
        element={
          <>
            <Menu />
            <App>
              <Outlet />
            </App>
          </>
        }
      >
        <Route
          path="/"
          element={<Srd.Wiki />}
        />

        <Route
          path="/register"
          element={<User.Register />}
        />

        <Route element={<Outlet />}>
          <Route
            path=":user/creations"
            element={<User.Creations />}
          />
          <Route
            path=":user/create/character"
            element={<Character.Editor.Create />}
          />
          <Route
            path=":user/create/campaign"
            element={<Campaign.Create />}
          />
        </Route>

        <Route element={<Outlet />}>
          <Route
            path="srd/:table"
            element={<Srd.Table />}
          />
          <Route
            path="srd/:table/:feature"
            element={<Srd.Entry />}
          />
        </Route>

        <Route element={<Outlet />}>
          <Route
            path="character/:id"
            element={<Character.Homepage />}
          />
          <Route
            path="character/:id/advance"
            element={<Character.Editor.Advance />}
          />
        </Route>
        <Route
          element={
            <>
              <Outlet />
              <Background type="campaigns" />
            </>
          }
        >
          <Route
            path="campaign/:id"
            element={<Campaign.Homepage />}
          />
          <Route
            path="campaign/:id/summaries/:session"
            element={<Campaign.Summarize />}
          />
        </Route>
        <Route
          path="db/powers"
          element={<Power.Powers />}
        />
        <Route
          path="tools/calculator"
          element={<Srd.Calculator />}
        />
      </Route>
    </Routes>
  </BrowserRouter>
);
