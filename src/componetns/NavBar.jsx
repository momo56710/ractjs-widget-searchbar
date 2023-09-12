import React, { useContext } from "react";
import { UserContext } from "../Pages/UserContext";
import LanguageDrop from "./LanguageDrop";
import { useTranslation } from "react-i18next";
import SearchBar from "./SearchBar";
const NavBar = ({ home }) => {
  const {
    setactive,
    settings,
    navigateToHome,
    setCompare,
    filtersPage,
    CancelSearchFilters,
    navigateToSearch,
  } = useContext(UserContext);
  const [t, i18n] = useTranslation();
  const isRTL = i18n.language === "ar";

  let logo;
  function Logo() {
    if (settings.homePageLogo) {
      logo = settings.homePageLogo;
    } else if (settings.innerPageLogo) {
      logo = settings.innerPageLogo;
    } else {
      logo = "";
    }
  }
  Logo();
  return (
    <div
      className={`${
        home ? "" : "border-b-2 "
      }   border-gray-color  gap-2  py-4  px-3 flex items-center `}
    >
      <div
        onClick={() => {
          navigateToSearch();
          setactive("search");
        }}
        className={`container mx-auto w-[97%] overflow-y-auto ${
          home ? "inline" : "hidden"
        }`}
      >
        <SearchBar home={true} />
      </div>
      <div className={`container mx-auto flex items-center justify-start `}>
        {!home && (
          <button
            onClick={() => {
              if (!filtersPage) {
                navigateToHome();
                setactive("home");
                setCompare(false);
              } else {
                CancelSearchFilters();
              }
            }}
          >
            <img
              src="./images/arrow-left 1.svg"
              alt="arrow go back"
              className={`${isRTL ? "rotate-180" : ""}`}
            />
          </button>
        )}
        {logo !== "" && (
          <img src={logo} alt="logo" className={`max-h-[25px]`} />
        )}
      </div>
      <LanguageDrop home={home} />
    </div>
  );
};

export default NavBar;
