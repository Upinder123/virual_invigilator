import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import checkAuth from '../../helper/checkAuth';

const AuthRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={props =>
      checkAuth() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/admin/login',
            state: { from: props.location, auth: false },
          }}
        />
      )
    }
  />
);

export default AuthRoute;
