import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Pages/UserContext";
import { useTranslation } from "react-i18next";
const Recent = () => {
  const { t, i18n } = useTranslation();
  const [color, setColor] = useState([]);
  const { settings, recentSearches, setKeyword, setRecentSearches } =
    useContext(UserContext);
  function handleclick(keyw) {
    setKeyword(keyw);
    const updatedSearches = recentSearches.filter((search) => search !== keyw);
    updatedSearches.unshift(keyw);
    window.localStorage.setItem(
      "recentSearches",
      JSON.stringify(updatedSearches)
    );
    // Update the recentSearches state
    setRecentSearches(updatedSearches);
  }

  const deleteItem = (value) => {
    const updatedSearches = recentSearches.filter((search) => search !== value);
    window.localStorage.setItem(
      "recentSearches",
      JSON.stringify(updatedSearches)
    );
    // Update the recentSearches state
    setRecentSearches(updatedSearches);
  };

  return (
    <div className=" my-7">
      <div className=" mb-5 ">
        <div
          style={{ borderColor: settings.themeColor }}
          className="font-medium uppercase pb-2 text-xs border-b-2 w-fit  relative "
        >
          {t("comparisonPage.recent")}
        </div>
      </div>
      <div className="flex justify-start items-center flex-wrap gap-2   ">
        {recentSearches.map((keyw, index) => {
          return (
            <div
              key={index}
              className="bg-gray-color hover:bg-gray-200 py-1 px-2 rounded-md font-medium text-sm flex justify-center items-center gap-2 cursor-pointer"
            >
              <p
                onClick={(e) => {
                  handleclick(keyw);
                }}
              >
                {keyw}
              </p>

              <svg
                onMouseEnter={(e) =>
                  setColor((prev) => {
                    return [...prev, index];
                  })
                }
                onMouseLeave={(e) =>
                  setColor((prev) => {
                    let indexes = prev.filter((item) => item != index);
                    return [...indexes];
                  })
                }
                onClick={() => deleteItem(keyw)}
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7Z"
                  fill={color.includes(index) ? "#a5a5a5" : "#C4D1DD"}
                />
                <path
                  d="M4 7H10"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Recent;
