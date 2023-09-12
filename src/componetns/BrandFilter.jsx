import React from "react";
import { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../Pages/UserContext";
import { useTranslation } from "react-i18next";
const BrandFilter = () => {
  const [open, setOpen] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const { brand, setBrand, Allbrand } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [checked, setchecked] = useState([]);
  const [t, i18n] = useTranslation();
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

  function toggle(value, array) {
    const index = array.indexOf(value);
    if (index === -1) {
      // Value not found in the array, so add it
      return [...array, value];
    } else {
      // Value found in the array, so remove it
      return array.filter((item) => item !== value);
    }
  }

  function handleCheckboxClick(e) {
    e.stopPropagation(); // Prevent click event propagation
  }

  const value = () => {
    if (brand.length === 0) {
      return t("searchPage.brandDropdown").toLowerCase();
    } else if (brand.length === 1) {
      return brand[0];
    } else {
      return brand[0] + " +" + (brand.length - 1);
    }
  };

  const handelDrop = (e, elm) => {
    e.stopPropagation();
    const arr = toggle(elm.brand, brand);
    setchecked(arr);
    setBrand(arr);
  };
  const handleSearchClick = (e) => {
    e.stopPropagation(); // Prevent click event propagation
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  let filteredBrands = Allbrand?.filter((elm) =>
    elm.brand.toLowerCase().includes(searchQuery.toLowerCase())
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
        className={`bg-gray-color px-2 py-[6px] sm:py-2 rounded-md flex items-center justify-center gap-[2px]  w-fit `}
        onClick={() => setOpen(!open)}
      >
        <p className="uppercase leading-[18px]  font-semibold text-[10px] sm:text-[12px] cursor-pointer ">
          {value()}
        </p>
        <img
          src="./images/arrow-down.svg"
          alt="open drop"
          className="cursor-pointer w-[14px] h-[14px]"
        />
        {tooltip && brand.length === 0 && (
          <div  className=" z-10 absolute top-10 -left-3 bg-gray-color divide-y divide-gray-100 rounded-lg shadow w-fit min-w-[100px] cursor-pointer">
            {!open && (
              <div className="relative bg-[#242B2E] text-xs p-3 text-white w-fit rounded-md">
                <p className=" min-w-max">{t("searchPage.brandTooltip")}</p>
                <div className="absolute border-[7px] border-transparent border-b-[#242B2E] -top-[13px] left-10"></div>
              </div>
            )}
          </div>
        )}
        {/* <div
          data-radix-popper-content-wrapper=""
        >
          <div
            data-side="right"
            data-align="center"
            data-state="delayed-open"
            class="rounded-md p-2 text-sm text-white bg-slate-600 shadow-md select-none max-w-[192px]"
            style="--radix-tooltip-content-transform-origin: var(--radix-popper-transform-origin); --radix-tooltip-content-available-width: var(--radix-popper-available-width); --radix-tooltip-content-available-height: var(--radix-popper-available-height); --radix-tooltip-trigger-width: var(--radix-popper-anchor-width); --radix-tooltip-trigger-height: var(--radix-popper-anchor-height);"
          >
            Destaca los elementos estéticos y el aspecto visual del diseño del
            producto
            <span style="position: absolute; left: 0px; transform-origin: 0px 0px; transform: translateY(50%) rotate(90deg) translateX(-50%); top: 35.5px;">
              <svg
                class="fill-gray-600"
                width="10"
                height="5"
                viewBox="0 0 30 10"
                preserveAspectRatio="none"
                style="display: block;"
              >
                <polygon points="0,0 30,0 15,10"></polygon>
              </svg>
            </span>
            <span
              id="radix-:r1o:"
              role="tooltip"
              style="position: absolute; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; overflow-wrap: normal;"
            >
              Destaca los elementos estéticos y el aspecto visual del diseño del
              producto
            </span>
          </div>
        </div> */}
        {open && (
          <div
            ref={dropdownBrandRef}
            className="Drop-dwon dropshd  absolute top-12 -left-24 sm:left-0 bg-white z-[502]  rounded-lg shadow w-44 cursor-pointer"
          >
            <div className="p-2">
              <label htmlFor="input-group-search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5  text-gray-400 "
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                ref={inputRef}
                  onChange={handleSearchChange}
                  onClick={handleSearchClick}
                  type="text"
                  id="input-group-search"
                  className="bg-white outline-none border border-gray-300 text-gray-900 text-sm rounded-3xl  block w-full pl-10 p-2.5 placeholder:text-gray-300 "
                  placeholder={t("navigationMenu.search")}
                />
              </div>
            </div>

            <ul className="py-2 text-sm text-gray-700 h-44 overflow-auto no-scrollbar">
              {filteredBrands && (
                <ul
                  dir="ltr"
                  className="py-2 text-sm text-gray-700 h-44 overflow-auto"
                >
                  {checked.map((brandName, index) => {
                    const brand = filteredBrands.find(
                      (elm) => elm.brand === brandName
                    );
                    if (brand) {
                      return (
                        <li key={index}>
                          <div onClick={(e) => handelDrop(e, brand)} className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                            <span
                              className="relative flex justify-center items-center border mr-2 w-[18px] h-[18px] bg-[#05AAF0] border-[#189ced] rounded"
                              value={brand.brand}
                              
                            >
                              <svg
                                className="w-3 h-3 mt-[.5px] text-white fill-current"
                                viewBox="0 0 16 16"
                              >
                                <path d="M13.75 3.25L5.75 11.25L2.25 7.75L3.65 6.35L5.75 8.45L12.35 1.85L13.75 3.25Z" />
                              </svg>
                            </span>
                            <label
                              htmlFor={brand.brand}
                              className="inline-flex items-center pointer-events-none cursor-pointer text-sm font-medium text-gray-900 rounded"
                            >
                              {brand.brand}
                            </label>
                          </div>
                        </li>
                      );
                    }
                    return null;
                  })}
                  {filteredBrands
                    .filter((elm) => !checked.includes(elm.brand))
                    .map((elm, index) => (
                      <li key={index}>
                        <div
                        
                        onClick={(e) => handelDrop(e, elm)}
                        className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                          <span
                            className="relative flex justify-center items-center border mr-2 w-[18px] h-[18px] bg-[#d8edf7] border-[#189ced] rounded"
                            value={elm.brand}
                          ></span>
                          <label
                            htmlFor={elm.brand}
                            className="inline-flex items-center cursor-pointer pointer-events-none text-sm font-medium text-gray-900 rounded"
                          >
                            {elm.brand}
                          </label>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandFilter;
