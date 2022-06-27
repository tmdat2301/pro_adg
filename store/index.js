// Imports: Dependencies
import AsyncStorage from '@react-native-community/async-storage';
import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import _ from 'lodash';
// Imports: Redux
import sagas from '../src/redux/sagas';
import rootReducer from '../src/redux/reducers';
import actionTypes from '@redux/actionTypes';
import { setToken } from '@services/serviceHandle';
// Middleware: Redux Persist Config
const persistConfig = {
  // Root
  key: 'root',
  timeout: 0,
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: ['userReducer', 'languageReducer'],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: [],
};
// Middleware: Redux Persist Persisted Reducer
const middleware = [];
const sagaMiddleware = createSagaMiddleware();
const handleAuthTokenMiddleware = (store) => (next) => (action) => {
  if (action.type === actionTypes.LOGIN_SUCCESS) {
    const token = action.response?.access_token;
    setToken(token);
  }
  next(action);
};
middleware.push(sagaMiddleware, handleAuthTokenMiddleware);
if (__DEV__) {
  middleware.push(createLogger());
}
const persistedReducer = persistReducer(persistConfig, rootReducer);

const enhancers = [applyMiddleware(...middleware)];

const config = { enhancers };

// Redux: Store

const store = createStore(persistedReducer, undefined, compose(...enhancers));
// Middleware: Redux Persist Persister
const persistor = persistStore(store, config, () => {
  const stateData = store.getState();
  if (!_.isEmpty(stateData.userReducer) && !_.isEmpty(stateData.userReducer.data)) {
    setToken(stateData.userReducer.accessToken);
  }
});
sagaMiddleware.run(sagas);

// Exports
export { store, persistor };
