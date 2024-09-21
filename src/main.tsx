import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "@/store";

window.addEventListener("load", (_event) => {
  setTimeout(async () => {
    const appWindow = (await import("@tauri-apps/api/window")).appWindow;
    appWindow.show();
  }, 100);

  // disable default right click on app behavior
  document.addEventListener('contextmenu', function(event){
    event.preventDefault();
  })
  // disable f5 refresh 
  document.addEventListener('keydown', function (event) {
    // Prevent F5 or Ctrl+R (Windows/Linux) and Command+R (Mac) from refreshing the page
    if (
      event.key === 'F5' ||
      (event.ctrlKey && event.key === 'r') ||
      (event.metaKey && event.key === 'r')
    ) {
      event.preventDefault();
    }
  });
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
