import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
  const { isLogged } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isLogged) {
          // not logged in so redirect to login page with the return url
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        }
        // authorized so return component
        return <Component {...props} />;
      }}
    />
  );
}
