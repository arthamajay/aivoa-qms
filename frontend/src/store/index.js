import { configureStore } from "@reduxjs/toolkit";
import { rcaReducer, initialRcaState } from "../App.jsx";

export const store = configureStore({
  reducer: { rca: rcaReducer },
});

export default store;
