import React from "react";
import { Switch, Route } from "react-router-dom";

import Main from "../components/Main";

const routes = (
  <Switch>
    <Route component={Main} />
  </Switch>
);

export default routes;
