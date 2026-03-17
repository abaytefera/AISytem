import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { 
  persistStore, 
  persistReducer, 
  FLUSH, 
  REHYDRATE, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER 
} from "redux-persist";
import storage from 'redux-persist/lib/storage';
import { APi } from "./CenteralAPI.jsx";
import authReducer from "./auth.jsx";
import webState from "./WebState.jsx";
import { rtkQueryErrorLogger } from './middleware';
const rootReducer = combineReducers({
  'webState': webState,
  'auth': authReducer,
  [APi.reducerPath]: APi.reducer
});

// Added 'auth' to whitelist so the login token persists on refresh
const persisConfig = { 
  key: 'root', 
  storage: storage.default ? storage.default : storage, 
  whitelist: ['webState', 'auth'] 
};

const presisReducer = persistReducer(persisConfig, rootReducer);

export const store = configureStore({
  reducer: presisReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(APi.middleware,rtkQueryErrorLogger);
  }
});

export const persistor = persistStore(store);