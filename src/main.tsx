import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "@/components/ui/toaster";
import { Provider } from "react-redux";
import store from "@/store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </React.StrictMode>
);
