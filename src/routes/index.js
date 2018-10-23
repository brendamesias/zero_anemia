import React from "react";
import {Route, Switch} from "react-router-dom";
import {Redirect} from "react-router";

import {Drivers, RouteFiles} from "../pages";

const Routes = () => {
    return (
        <Switch>
            <Route
                exact
                path="/"
                component={RouteFiles}
            />
            <Route
                path="/drivers"
                component={Drivers}
            />
        </Switch>
    )
};

export default Routes;