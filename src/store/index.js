
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import logger from 'redux-logger'

// const logger = createLogger();
// thunk, promise, logger
// reducer
import user from "./user";
const rootReducer = combineReducers({
  user
});

const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(thunk, logger)
);

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      enhancer,
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
  return store;
}
