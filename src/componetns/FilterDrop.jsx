import React, { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../Pages/UserContext";
import { useTranslation } from "react-i18next";

const FilterDrop = ({ title, arr, stt, setstt }) => {
  const [open, setOpen] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { category } = useContext(UserContext);
  const [t, i18n] = useTranslation();
  const isRTL = i18n.language === "ar";
  function handelDrop(elm) {
    setSearchQuery("");
    setTooltip(false);
    setstt(elm);
    setOpen(!open);
  }
  const dropdownBrandRef = useRef(null);
  useEffect(() => {
    const closeDropdownOnOutsideClick = (event) => {
      if (!dropdownBrandRef.current?.contains(event.target)) {
        console.log("Clicked outside, closing dropdown");
        setOpen(false);
        setTooltip(false);
      }
    };

    document.addEventListener("mousedown", closeDropdownOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeDropdownOnOutsideClick);
    };
  }, [dropdownBrandRef]);

  const handleSearchClick = (e) => {
    e.stopPropagation();
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  let filteredCategory = arr.filter((elm) =>
    elm.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const inputRef = useRef(null);
  useEffect(() => {
    // Check if the dropdown is open and the ref is available
    if (open && inputRef.current) {
      // Set focus to the dropdown element when it opens
      inputRef.current.focus();
    }
  }, [open]);
  return (
    <div className="relative">
      <div
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        className={`bg-gray-color  px-2 py-[6px] sm:py-2 rounded-md  flex items-center justify-center gap-[2px] w-fit ${
          category === t("searchPage.deviceTypeDropdown").toLowerCase() &&
          title === "brand"
            ? "bg-gray-50 text-gray-500"
            : ""
        }`}
        onClick={() => {
          setSearchQuery("");
          setOpen(!open);
        }}
      >
        <p className="uppercase leading-[18px]	 text-[10px] sm:text-[12px] font-semibold cursor-pointer">
          {category}
        </p>
        <img
          src="./images/arrow-down.svg"
          alt="open drop"
          className="cursor-pointer w-[14px] h-[14px]"
        />

        {tooltip && (
          <div
            className={`z-10 absolute top-10 ${
              isRTL ? " right-2 " : " left-1"
            } bg-white rounded-lg shadow min-w-[120px] cursor-pointer`}
          >
            {title === "category" && !open && (
              <div className="relative bg-[#242B2E] text-xs p-3 text-white rounded-md">
                <p className="min-w-max">{t("searchPage.categoryTooltip")}</p>
                <div
                  className={`absolute border-[7px] border-transparent border-b-[#242B2E] ${
                    isRTL ? "right-4" : " left-10"
                  } -top-[13px] `}
                ></div>
              </div>
            )}
          </div>
        )}

        {open && (
          <>
            <div
              ref={dropdownBrandRef}
              className={`z-[70] Drop-dwon dropshd  absolute top-12   ${
                isRTL ? "right-0" : "left-0"
              } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 cursor-pointer`}
            >
              {title === "category" && (
                <div className="p-2">
                  <label htmlFor="input-group-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <input
                      ref={inputRef}
                      onChange={handleSearchChange}
                      onClick={handleSearchClick}
                      type="text"
                      id="input-group-search"
                      className=" outline-none border border-gray-color text-gray-900 text-sm rounded-3xl  block w-full pl-10 p-2.5 placeholder:text-gray-300 "
                      placeholder={t("navigationMenu.search")}
                    />
                  </div>
                </div>
              )}

              {title === "category" && (
                <ul className="py-2 text-sm text-gray-700 h-44 overflow-auto">
                  {title === "category" &&
                    filteredCategory &&
                    filteredCategory.map((elm, index) => (
                      <p
                        key={index}
                        onClick={(e) => handelDrop(elm)}
                        className="block px-4 py-2 hover:bg-gray-100 w-full"
                      >
                        {elm}
                      </p>
                    ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FilterDrop;
