import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./index.css";
import "./i18n";
const widgetDivs = document.querySelectorAll(".techspecs-widget");

widgetDivs.forEach((div) => {
  const symbol = div.dataset.symbol; // Get the symbol value from the div's data attribute if required
  const root = createRoot(div); // createRoot(container!) if you use TypeScript
  root.render(<App symbol={symbol} />);
});
