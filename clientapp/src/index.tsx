import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/layout/App";
import "./app/layout/styles.css";
import reportWebVitals from "./reportWebVitals";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/Routes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <RouterProvider router={router} />
);

reportWebVitals();