"use client";
import { Provider } from "react-redux";
// @ts-ignore
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
} 