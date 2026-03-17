import { configureStore } from "@reduxjs/toolkit";
import { randomStringsApi } from "./api";

export const store = configureStore({
  reducer: {
    [randomStringsApi.reducerPath]: randomStringsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(randomStringsApi.middleware),
});
