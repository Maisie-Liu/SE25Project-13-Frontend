import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import itemReducer from './slices/itemSlice';
import orderReducer from './slices/orderSlice';
import categoryReducer from './slices/categorySlice';
import favoriteReducer from './slices/favoriteSlice';
import escrowReducer from './slices/escrowSlice';
import messageReducer from './slices/messageSlice';
import chatReducer from './slices/chatSlice';
import userPublicProfileReducer from './slices/userPublicProfileSlice';
import { recommendedItemsPageSlice, userProfileInterestSlice } from './slices/itemSlice';
import { personalizedRecommendSlice, userInterestProfileSlice } from './slices/authSlice';
import buyRequestReducer from './slices/buyRequestSlice';

// 配置持久化存储
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // 只持久化auth状态
};

// 使用combineReducers创建根reducer
const rootReducer = combineReducers({
  auth: authReducer,
  item: itemReducer,
  order: orderReducer,
  category: categoryReducer,
  favorites: favoriteReducer,
  escrow: escrowReducer,
  message: messageReducer,
  chat: chatReducer,
  recommendedItemsPage: recommendedItemsPageSlice,
  userProfileInterest: userProfileInterestSlice,
  personalizedRecommend: personalizedRecommendSlice,
  userInterestProfile: userInterestProfileSlice,
  userPublicProfile: userPublicProfileReducer,
  buyRequest: buyRequestReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 创建store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 关闭序列化检查以支持持久化
    }),
});

// 创建persistor
export const persistor = persistStore(store);

export default store; 