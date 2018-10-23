import React from "react";
import {Route} from "react-router-dom";
import {Redirect} from "react-router";

const PrivateRoute = ({component: Component, path, loginSuccessFull, ...rest}) => {
    return (
        <Route
            path={path}
            render={props => loginSuccessFull
                ? <Component {...props} {...rest}/>
                : <Redirect to="/"/>
            }
        />
    )
};

export default PrivateRoute;