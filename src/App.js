import React, {useEffect} from 'react'
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import './App.less';

import routes from './router/index'

const getRouterByRoutes = (value = []) => {
  let routesArr = [...value];
  let renderedRoutesList = [];
  const renderRoutes = (routes, parentPath) => {
    Array.isArray(routes) &&
      routes.forEach((route) => {
        const { path, redirect, children, layout, component } = route;
        if(redirect) {
          renderedRoutesList.push(
            <Redirect
              key={`${parentPath}${path}`}
              exact
              from={path}
              to={`${parentPath}${redirect}`}
            />
          );
        }
        if (component) {
          renderedRoutesList.push(
            layout ? (
              <Route
                key={`${parentPath}${path}`}
                exact
                path={`${parentPath}${path}`}
                render={(props) =>
                  React.createElement(
                    layout,
                    props,
                    React.createElement(component, props)
                  )
                }
              />
            ) : (
              <Route
                key={`${parentPath}${path}`}
                exact
                path={`${parentPath}${path}`}
                component={component}
              />
            )
          );
        }
        if (Array.isArray(children) && children.length > 0) {
          renderRoutes(children, path);
        }
      });
  };

  renderRoutes(routesArr, "");

  return renderedRoutesList;
  
};


function App() {  
  return (
    <div className="App">
     <Router>
        <Switch>
          {getRouterByRoutes(routes.default)}
        </Switch>
      </Router>
    </div>
  );
}

export default App;