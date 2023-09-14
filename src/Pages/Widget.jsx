import Home from "./Home";
import Search from "./Search";
import Product from "./Product";
import Compare from "./Compare";
import { UserContext } from "./UserContext";
import { useContext, useEffect } from "react";
const Widget = () => {
  const fullParentHostname = window.location.ancestorOrigins[0];
  // Remove "http://" or "https://" from the hostname
  const startIndex = fullParentHostname?.indexOf("//") + 2;
  const cleanParentHostname = fullParentHostname?.substring(startIndex);
  useEffect(() => {
    window.plausible("Inline Widget Loaded", {
      host: cleanParentHostname,
    });
  }, []);

  const { currentPage, setCurrentPage } = useContext(UserContext);
  useEffect(() => {
    // Retrieve the current page value from localStorage
    const storedPage = localStorage.getItem("widgetCurrentPage");
    if (storedPage) {
      setCurrentPage(storedPage);
    }
  }, []);

  useEffect(() => {
    // Store the current page value in localStorage
    localStorage.setItem("widgetCurrentPage", currentPage);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "search":
        return <Search />;
      case "compare":
        return <Compare />;
      case "product":
        return <Product />;
      default:
        return null;
    }
  };
  return <div className="fixed top-0 left-0 w-screen">{renderPage()}</div>;
};

export default Widget;
