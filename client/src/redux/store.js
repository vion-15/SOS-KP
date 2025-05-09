import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import postReducer from "./post/postSlice";
import cartReducer from "./keranjang/keranjangSlice";
import storeStatusReducer from "./storestatus/storeSlice";

const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
    posts: postReducer,
    storeStatus: storeStatusReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);