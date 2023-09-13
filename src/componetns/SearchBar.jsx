import React, { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../Pages/UserContext";
import { useTranslation } from "react-i18next";
const SearchBar = ({ home , search}) => {
  const { t, i18n } = useTranslation();
  const {
    settings,
    apliedFilters,
    navigateToSearchFilters,
    setMyProduct,
    setTotalPages,
    navigateToSearch,
    setactive,
    setMyData,
    setKey,
    setSkl,
    onSearch,
    recentSearches,
    fetchData,
    keyword,
    setKeyword,
    fetchDataAdvance,
  } = useContext(UserContext);
  const [del, setDel] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const isRTL = i18n.language === "ar";
  const [color, setColor] = useState("#91A8BF");

  const handleSearch = (e) => {
    setMyProduct({});
    setTotalPages(0);
    setMyData({});
    if (!(keyword === "")) {
      e.preventDefault();
      let existingSearches = recentSearches;
      if (existingSearches.indexOf(keyword) === -1) {
        existingSearches.unshift(keyword);
        onSearch(existingSearches);
        window.localStorage.setItem(
          "recentSearches",
          JSON.stringify(recentSearches)
        );
      } else {
        existingSearches = existingSearches.filter(
          (search) => search !== keyword
        );
        existingSearches.unshift(keyword);
        onSearch(existingSearches);
        window.localStorage.setItem(
          "recentSearches",
          JSON.stringify(existingSearches)
        );
      }

      setSkl(true);
      if (home) {
        navigateToSearch();
        setactive("search");
      }
      if (Object.keys(apliedFilters).length !== 0) {
        fetchDataAdvance(keyword);
      } else {
        fetchData(keyword);
      }
      setKey(keyword);
    }
  };

  return (
    <form className={`mb-1 py-3 `} onSubmit={(e) => handleSearch(e)}>
      <div className="relative ">
        <div
          className={`absolute inset-y-0 ${
            isRTL ? " right-0 pr-3" : " left-0 pl-3"
          }  flex items-center  pointer-events-none`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 19"
            fill="none"
          >
            <g clip-path="url(#clip0_808_16927)">
              <path
                d="M17.7802 17.0743L13.3035 12.5976C14.5234 11.1055 15.1232 9.20164 14.9788 7.27974C14.8344 5.35785 13.9569 3.56497 12.5276 2.27196C11.0984 0.978956 9.2269 0.284742 7.30019 0.332916C5.37348 0.38109 3.53899 1.16797 2.17617 2.53078C0.813351 3.8936 0.0264755 5.72809 -0.0216984 7.6548C-0.0698723 9.58152 0.624341 11.453 1.91735 12.8823C3.21036 14.3115 5.00323 15.1891 6.92513 15.3335C8.84703 15.4779 10.7509 14.878 12.243 13.6581L16.7197 18.1348C16.8612 18.2714 17.0506 18.347 17.2473 18.3453C17.4439 18.3436 17.632 18.2647 17.7711 18.1257C17.9101 17.9866 17.989 17.7985 17.9907 17.6019C17.9924 17.4052 17.9168 17.2158 17.7802 17.0743ZM7.49996 13.8546C6.31327 13.8546 5.15323 13.5027 4.16654 12.8434C3.17984 12.1841 2.41081 11.247 1.95668 10.1507C1.50256 9.05432 1.38374 7.84792 1.61525 6.68403C1.84676 5.52014 2.4182 4.45105 3.25732 3.61193C4.09643 2.77282 5.16553 2.20137 6.32942 1.96986C7.4933 1.73835 8.6997 1.85717 9.79606 2.3113C10.8924 2.76542 11.8295 3.53446 12.4888 4.52115C13.1481 5.50785 13.5 6.66789 13.5 7.85457C13.4982 9.44532 12.8655 10.9704 11.7406 12.0952C10.6158 13.2201 9.09071 13.8528 7.49996 13.8546Z"
                fill="#242B2E"
              />
            </g>
            <defs>
              <clipPath id="clip0_808_16927">
                <rect
                  width="18"
                  height="18"
                  fill="white"
                  transform="translate(0 0.354492)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
        <input
        autoFocus={search ? true : false}
          onClick={() => {
            if (home) {
              navigateToSearch();
              setactive("search");
            }
          }}
          type="text"
          id="default-search"
          className={`block md:w-[30em] ${home ? "h-[52px]" : "h-[44px]"}   ${
            isRTL ? " pr-9" : " pl-9"
          }  placeholder:font-medium  placeholder:text-sm text-sm outline-none text-gray-900 border border-gray-300 hover:border-black rounded-lg`}
          placeholder={t("searchPage.searchBarPlaceholder")}
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          onFocus={(e) => setDel(!del)}
          onBlur={(e) => setDel(!del)}
        />
        {!home && (
          <div
            onClick={navigateToSearchFilters}
            onMouseEnter={() => setTooltip(true)}
            onMouseLeave={() => setTooltip(false)}
            className={` absolute ${
              isRTL ? " left-0" : " right-0"
            }  bottom-2 px-4 py-1 z-10 cursor-pointer`}
          >
            <img src="./images/filter 2.svg" alt="filter btn" />

            {tooltip && (
              <div
                className={`z-10 absolute -top-11 ${
                  isRTL ? " -left-2 " : " -right-0 "
                } bg-white rounded-lg shadow w-14 cursor-pointer`}
              >
                <div className="relative bg-[#242B2E] text-xs p-2 w-16 text-white text-center rounded-md">
                  <p>{t("searchPage.FilterTooltip")}</p>
                  <div
                    className={`absolute border-[7px] border-transparent border-t-[#242B2E] ${
                      isRTL ? "left-9" : " right-7"
                    } -bottom-[13px] `}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
        <button
          type="submit"
          className="text-white absolute right-0 bottom-0 px-3 py-1 "
          onClick={(e) => handleSearch(e)}
        ></button>
        {!(keyword === "") ? (
          <div
            onClick={() => setKeyword("")}
            onMouseEnter={() => setColor("#778da3")}
            onMouseLeave={() => setColor("#E0E0E0")}
            className={` absolute ${
              isRTL
                ? home
                  ? " left-0"
                  : " left-7"
                : home
                ? " right-0"
                : " right-7"
            }   ${
              home ? "bottom-3" : "bottom-2"
            }   px-4 py-[4px] z-10 cursor-pointer`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1_1369)">
                <path
                  d="M18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18C13.9706 18 18 13.9706 18 9Z"
                  fill={color}
                />
                <path
                  d="M6.45483 6.45459L11.546 11.5458"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M6.45483 11.5454L11.546 6.45424"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1_1369">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        ) : (
          ""
        )}
      </div>
    </form>
  );
};

export default SearchBar;
