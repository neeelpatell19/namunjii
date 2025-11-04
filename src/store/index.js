import { combineReducers, configureStore } from "@reduxjs/toolkit";
import api from "./reducers/ApiReducer";

const store = configureStore({
  reducer: combineReducers({ api }),
});

export default store;
