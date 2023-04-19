import { combineReducers, configureStore } from '@reduxjs/toolkit';

// Reducers
import commonReducer from './commonSlice';
import authReducer from "./authSlice";
import auctionReducer from "./auctionSlice";
import resumeReducer from './resumeSlice';
import profileReducer from './profileSlice';

const combinedReducer = combineReducers({
  common: commonReducer,
  auth: authReducer,
  auction: auctionReducer,
  resume: resumeReducer,
  profile: profileReducer
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logoutStore") { 
    state = undefined; 
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});
