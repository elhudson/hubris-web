import { Background, Scrollable } from "@interface/ui";
import {
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { css, useTheme } from "@emotion/react";

import Campaign from "@client/campaign"
import Character from "@client/character"
import Menu from "@src/client/menu";
import Power from "@client/power"
import Rules from "@client/rules"
import Srd from "@client/srd"
import User from "@client/user"

const App = ({ children }) => {
  const { colors } = useTheme();
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
          element={<Character.Create />}
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
          element={<Character.Advance />}
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
  )
);
