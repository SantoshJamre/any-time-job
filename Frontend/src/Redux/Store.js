import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./Slice/userSlice";
import verifyOtpReducer from "./Slice/OtpSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const otpPersistConfig = {
  key: 'otp',
  version: 1,
  storage,
};

const persistedUserReducer  = persistReducer(persistConfig, userReducer);
const persistedOtpReducer = persistReducer(otpPersistConfig, verifyOtpReducer);

const store = configureStore({
  reducer: { user: persistedUserReducer, otp: persistedOtpReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export let persistor = persistStore(store);
export default store;