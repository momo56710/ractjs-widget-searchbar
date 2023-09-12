import React, { useEffect, useRef, useState } from "react";
import { UserContext } from "../Pages/UserContext";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import FiltersTags from "./FiltersTags";

const PropertyList = () => {
  const {
    filters,
    apliedFilters,
    setApliedFilters,
    settings,
    setMyData,
    category,
    setCategory,
    setTotalResult,
  } = useContext(UserContext);

  const [t, i18n] = useTranslation();
  const isRTL = i18n.language === "ar";
  const [filtersValues, setFiltersValues] = useState({});
  const [Open, setOpenFilters] = useState([]);
  const [unit, setUnit] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [schema, setSchema] = useState({});
  const [sortedFiltersArray, setSortedFiltersArray] = useState([]);
  function convertToTimestamp(inputDateValue) {
    const inputDate = new Date(inputDateValue); // Create a Date object from the input value

    // Get the timestamp in seconds
    const timestampInSeconds = Math.floor(inputDate.getTime() / 1000);
    return timestampInSeconds;
  }
  const handelNumiriqueFilters = (property, minValue, maxValue) => {
    console.log(property, minValue, maxValue);
    if (minValue !== "" && maxValue !== "") {
      setApliedFilters((prev) => ({
        ...prev,
        [property]: [`${minValue} TO ${maxValue}`],
      }));
    } else if (minValue === "" && maxValue !== "") {
      setApliedFilters((prev) => ({
        ...prev,
        [property]: [`<= ${maxValue}`],
      }));
    } else if (maxValue === "" && minValue !== "") {
      setApliedFilters((prev) => ({
        ...prev,
        [property]: [`>= ${minValue}`],
      }));
    } else {
      const updatedFilters = { ...apliedFilters };
      delete updatedFilters[property];
      setApliedFilters(updatedFilters);
    }
  };
  useEffect(() => {
    if (
      apliedFilters?.["Product.Category"] &&
      apliedFilters?.["Product.Category"][0] !== category
    ) {
      setCategory(apliedFilters?.["Product.Category"][0]);
    }
    console.log("initialieation", apliedFilters?.["Product.Category"]?.[0]);
  }, [apliedFilters]);

  // Function to lighten a color by a given factor
  function applyOpacityToColor(color, opacity) {
    const hexColor = color.startsWith("#") ? color.substring(1) : color;

    const red = parseInt(hexColor.substring(0, 2), 16);
    const green = parseInt(hexColor.substring(2, 4), 16);
    const blue = parseInt(hexColor.substring(4, 6), 16);

    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
  }
  const gradientColor2 = applyOpacityToColor(settings.themeColor, 0.7); // Lighten the color

  function removeUnderscoreAndHyphen(str) {
    let result = "";
    if (str) {
      for (let i = 0; i < str.length; i++) {
        if (str[i] === "_" || str[i] === "-") {
          result += " ";
        } else {
          result += str[i];
        }
      }
    }

    return result;
  }

  const handelfilterClick = (property, value) => {
    if (property !== `Product.Category`) {
      setApliedFilters((prev) => {
        const updatedFilters = { ...prev };

        if (updatedFilters[property]) {
          // Toggle the value in the array
          if (updatedFilters[property].includes(value)) {
            updatedFilters[property] = updatedFilters[property].filter(
              (item) => item !== value
            );
            if (updatedFilters[property].length === 0) {
              delete updatedFilters[property];
            }
          } else {
            updatedFilters[property] = [...updatedFilters[property], value];
          }
        } else {
          updatedFilters[property] = [value];
        }

        return updatedFilters;
      });
    } else {
      setApliedFilters((prev) => {
        const updatedFilters = { ...prev };

        updatedFilters[property] = [value];

        return updatedFilters;
      });
    }
    setTotalResult(0);
    setMyData({});
  };

  const getFilterValues = (name) => {
    const hostname = "acme.com";

    const baseURL =
      import.meta.env.MODE === "production"
        ? import.meta.env.VITE_BASE_URL_PRODUCTION
        : import.meta.env.VITE_BASE_URL_STAGING;

    const url = baseURL + `/filters/search?hostname=${hostname}`;
    const data = JSON.stringify({
      name: name,
      value: "",
    });

    const headers = {
      accept: "application/json",
      "content-type": "application/json",
    };

    axios
      .post(url, data, { headers })
      .then((response) => {
        setFiltersValues((prev) => ({ ...prev, [name]: response.data.data }));
      })
      .catch((err) => console.error(err));
  };

  const generateOrderedFilters = (obj, parentKey = "") => {
    const filters = [];
    for (const key in obj) {
      const currentKey = parentKey ? `${parentKey}.${key}` : key;

      if (obj[key] === null) {
        filters.push(null);
      } else if (typeof obj[key] === "object") {
        filters.push(...generateOrderedFilters(obj[key], currentKey));
      } else {
        filters.push(currentKey);
      }
    }

    return filters;
  };
  // const mergeSchemas = (existingSchema, newSchema) => {
  //   const mergedSchema = { ...existingSchema };

  //   const mergeAttributes = (target, source) => {
  //     for (const attribute in source) {
  //       if (
  //         typeof source[attribute] === "object" &&
  //         !Array.isArray(source[attribute])
  //       ) {
  //         if (!target.hasOwnProperty(attribute)) {
  //           target[attribute] = {};
  //         }
  //         mergeAttributes(target[attribute], source[attribute]);
  //       } else {
  //         target[attribute] = source[attribute];
  //       }
  //     }
  //   };

  //   for (const att in newSchema) {
  //     if (!mergedSchema.hasOwnProperty(att)) {
  //       mergedSchema[att] = {};
  //     }
  //     mergeAttributes(mergedSchema[att], newSchema[att]);
  //   }

  //   return mergedSchema;
  // };

  let orderedFiltersArray = [];
  useEffect(() => {
    if (
      apliedFilters?.["Product.Category"] &&
      apliedFilters?.["Product.Category"].length !== 0
    ) {
      apliedFilters["Product.Category"].forEach((category, index) => {
        const baseURL =
          import.meta.env.MODE === "production"
            ? import.meta.env.VITE_BASE_URL_PRODUCTION
            : import.meta.env.VITE_BASE_URL_STAGING;

        const url =
          baseURL + `/products/schema?hostname=acme.com&category=` + category;

        const headers = {
          accept: "application/json",
          "content-type": "application/json",
        };

        axios
          .get(url, { headers })
          .then((response) => {
            setSchema(response.data.data);
          })
          .catch((err) => console.error(err));
      });
    }
  }, [apliedFilters["Product.Category"]]);

  useEffect(() => {
    if (Object.keys(schema).length !== 0) {
      orderedFiltersArray = generateOrderedFilters(schema);
      console.log('schema' , schema);
      console.log("orderd filters array", orderedFiltersArray);
      let sortedFiltersArr = orderedFiltersArray?.filter(
        (filter) =>
          filters.includes(filter) ||
          [
            "Design.Body.Height",
            "Design.Body.Thickness",
            "Design.Body.Weight",
            "Design.Body.Width",
          ].includes(filter)
      );

      sortedFiltersArr = sortedFiltersArr.flatMap((element) => {
        if (element === "Design.Body.Height") {
          return ["Design.Body.Height_mm", "Design.Body.Height_in"];
        } else if (element === "Design.Body.Thickness") {
          return ["Design.Body.Thickness_mm", "Design.Body.Thickness_in"];
        } else if (element === "Design.Body.Weight") {
          return ["Design.Body.Weight_g", "Design.Body.Weight_oz"];
        } else if (element === "Design.Body.Width") {
          return ["Design.Body.Width_mm", "Design.Body.Width_in"];
        } else {
          return [element];
        }
      });

      console.log(sortedFiltersArr);

      setSortedFiltersArray(sortedFiltersArr);
    }
  }, [schema]);

  const categories = sortedFiltersArray.map(
    (property) => property.split(".")[0]
  );
  const uniqueCategories = [
    ...new Set(categories.filter((category) => category !== "_id")),
  ];
  const dropdownRef = useRef(null);
  const dropdownBtnRef = useRef(null);
  useEffect(() => {
    const closeDropdownOnOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !dropdownRef.current.previousElementSibling.contains(event.target)
        ) {
        console.log("Clicked outside, closing dropdown");
        let property = dropdownRef.current.getAttribute("data-property");
        setOpenFilters((prev) => {
          if (prev.includes(property)) {
            console.log("include", property);
            return prev.filter((prop) => prop !== property);
          }
          return prev;
        });
        setSearchValue("");
      }
    };
  // if( !dropdownBtnRef.current){
  //   document.addEventListener("click", closeDropdownOnOutsideClick);

  // }

  document.addEventListener("mousedown", closeDropdownOnOutsideClick);


 
      // Attach the mousedown event listener to the document
      // Cleanup the event listener when the component unmounts
      return () => {
        // if (dropdownBtnRef.current) {
        //   dropdownBtnElement.removeEventListener("click", handleButtonClick);
        // }
        document.removeEventListener("mousedown", closeDropdownOnOutsideClick);
      };
    
    
  }, [dropdownRef, dropdownBtnRef]);
  

  
  const inputRef = useRef(null);
  useEffect(() => {
    // Check if the dropdown is open and the ref is available
    if (Open && inputRef.current) {
      // Set focus to the dropdown element when it opens
      inputRef.current.focus();
    }
  }, [Open]);

  const renderSubcategories = (
    category,
    subcategories,
    propertiesForCategory
  ) => {
    if (propertiesForCategory.length === 0) {
      return (
        <div key={category}>
          <h5
            style={{ color: settings.themeColor }}
            className="text-sm font-semibold my-4 w-fit"
          >
            {removeUnderscoreAndHyphen(category)}
          </h5>
          <hr className="border-gray-100" />
          <div className="flex justify-start items-start flex-wrap gap-2 py-2 relative">
            {subcategories.map((property, index) => (
              <div key={`${index}.${property}`}>
                <p className="text-black text-sm mb-1">
                  {removeUnderscoreAndHyphen(property)}
                </p>
                {property.toLowerCase() !== "released timestamp" &&
                  ![
                    "Height_in",
                    "Height_mm",
                    "Thickness_in",
                    "Thickness_mm",
                    "Weight_g",
                    "Weight_oz",
                    "Width_in",
                    "Width_mm",
                  ].includes(property.split(".")[2]) && (
                    <>
                      <button
                        ref={dropdownBtnRef}
                        onClick={() => {
                          setOpenFilters((prev) => {
                            let openfilters = [...prev];

                            if (
                              openfilters.includes(`${category}.${property}`)
                            ) {
                              openfilters = openfilters.filter(
                                (item) => item !== `${category}.${property}`
                              );
                              return openfilters;
                            } else {
                              openfilters = [
                                ...openfilters,
                                `${category}.${property}`,
                              ];
                            }

                            console.log("property", `${category}.${property}`);

                            getFilterValues(`${category}.${property}`);
                            return [...openfilters, `${category}.${property}`];
                          });
                        }}
                        className="bg-gray-100 flex items-center justify-between p-2 rounded-md text-sm font-medium hover:bg-gray-200 space-x-1 w-40"
                      >
                        <span>
                          {Object.keys(apliedFilters).includes(
                            `${category}.${property}`
                          )
                            ? apliedFilters[`${category}.${property}`].length >
                              1
                              ? apliedFilters[`${category}.${property}`][0] +
                                " +" +
                                (apliedFilters[`${category}.${property}`]
                                  .length -
                                  1)
                              : apliedFilters[`${category}.${property}`][0]
                            : t("searchPage.filtersBtn")}
                        </span>
                        <span aria-hidden="true" className="">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                              fill="currentColor"
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </button>

                      {property.toLowerCase() !== "category" &&
                        Open?.includes(`${category}.${property}`) && (
                          <div
                            ref={dropdownRef}
                            data-property={`${category}.${property}`}
                            className="Drop-dwon dropshd   absolute  bg-white z-[5000001] h-48  rounded-lg shadow w-44 cursor-pointer"
                          >
                            <div className="p-2">
                              <label
                                htmlFor="input-group-search"
                                className="sr-only"
                              >
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
                                  value={searchValue}
                                  onChange={(e) =>
                                    setSearchValue(e.target.value)
                                  }
                                  type="text"
                                  id="input-group-search"
                                  className="bg-white outline-none border border-gray-300 text-gray-900 text-sm rounded-3xl  block w-full pl-10 p-2.5 placeholder:text-gray-300 "
                                  placeholder={t("navigationMenu.search")}
                                />
                              </div>
                            </div>

                            <ul className="py-2 text-sm text-gray-700 h-[130px] overflow-y-auto no-scrollbar">
                              {filtersValues[`${category}.${property}`] && (
                                <ul
                                  dir="ltr"
                                  className="py-2 text-sm text-gray-700 h-[130px] overflow-y-auto overflow-x-hidden"
                                >
                                  {Array.isArray(
                                    filtersValues[`${category}.${property}`]
                                  )
                                    ? filtersValues[`${category}.${property}`]
                                        .filter(({ value }) =>
                                          value
                                            .toLowerCase()
                                            .includes(searchValue.toLowerCase())
                                        )
                                        .filter(({ value }) =>
                                          apliedFilters[
                                            `${category}.${property}`
                                          ]?.includes(value)
                                        )
                                        .map(
                                          (
                                            { value, highlighted, count },
                                            index
                                          ) => (
                                            <li
                                              key={`${category}.${property}.${index}`}
                                            >
                                              <div 
                                                   onClick={() =>
                                                    handelfilterClick(
                                                      `${category}.${property}`,
                                                      value
                                                    )
                                                  }
                                              className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                                                <div
                                                  className=" flex justify-center items-center border mr-2 w-[17px] h-[17px] bg-[#05AAF0] border-[#189ced] rounded"
                                             
                                                >
                                                  <svg
                                                    className="w-3 h-3 mt-[.5px] text-white fill-current"
                                                    viewBox="0 0 16 16"
                                                  >
                                                    <path d="M13.75 3.25L5.75 11.25L2.25 7.75L3.65 6.35L5.75 8.45L12.35 1.85L13.75 3.25Z" />
                                                  </svg>
                                                </div>

                                                <label className="inline-flex w-[131px] items-center cursor-pointer text-xs font-medium text-gray-900 rounded">
                                                  {value}
                                                  <span className="text-xs text-gray-400 ml-1 ">
                                                    {"(" + count + ")"}
                                                  </span>
                                                </label>
                                              </div>
                                            </li>
                                          )
                                        )
                                    : (() => {
                                        console.log(
                                          `filtersValues[${`${category}.${property}`}] is not an array`
                                        );
                                        return null;
                                      })()}

                                  {Array.isArray(
                                    filtersValues[`${category}.${property}`]
                                  )
                                    ? filtersValues[`${category}.${property}`]
                                        .filter(({ value }) =>
                                          value
                                            .toLowerCase()
                                            .includes(searchValue.toLowerCase())
                                        )
                                        .filter(
                                          ({ value }) =>
                                            !apliedFilters[
                                              `${category}.${property}`
                                            ]?.includes(value)
                                        )
                                        .map(
                                          (
                                            { value, highlighted, count },
                                            index
                                          ) => (
                                            <li
                                              key={`${category}.${property}.${index}`}
                                            >
                                              <div
                                               onClick={() =>
                                                handelfilterClick(
                                                  `${category}.${property}`,
                                                  value
                                                )
                                              }
                                              className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                                                <div
                                                  className="  flex justify-center items-center border mr-2 w-[17px] h-[17px] bg-[#d8edf7] border-[#189ced] rounded"
                                                  // onClick={() =>
                                                  //   handelfilterClick(
                                                  //     `${category}.${property}`,
                                                  //     value
                                                  //   )
                                                  // }
                                                ></div>

                                                <label className="inline-flex w-[131px] items-center cursor-pointer text-xs font-medium text-gray-900 rounded">
                                                  {value}
                                                  <span className="text-xs text-gray-400 ml-1 ">
                                                    {"(" + count + ")"}
                                                  </span>
                                                </label>
                                              </div>
                                            </li>
                                          )
                                        )
                                    : (() => {
                                        console.log(
                                          `filtersValues[${`${category}.${property}`}] is not an array`
                                        );
                                        return null;
                                      })()}
                                </ul>
                              )}
                            </ul>
                          </div>
                        )}
                      {property.toLowerCase() === "category" &&
                        Open?.includes(`${category}.${property}`) && (
                          <div
                            ref={dropdownRef}
                            data-property={`Product.Category`}
                            className="Drop-dwon dropshd  absolute  bg-white z-[5000001] h-48  rounded-lg shadow w-44 cursor-pointer"
                          >
                            <div className="p-2">
                              <label
                                htmlFor="input-group-search"
                                className="sr-only"
                              >
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
                                  value={searchValue}
                                  onChange={(e) =>
                                    setSearchValue(e.target.value)
                                  }
                                  type="text"
                                  id="input-group-search"
                                  className="bg-white outline-none border  border-gray-300 text-gray-900 text-sm rounded-3xl  block w-full pl-10 p-2.5 placeholder:text-gray-300 "
                                  placeholder={t("navigationMenu.search")}
                                />
                              </div>
                            </div>

                            <ul className="py-2 text-sm text-gray-700 h-[130px] overflow-y-auto no-scrollbar">
                              {filtersValues[`Product.Category`] && (
                                <ul
                                  dir="ltr"
                                  className="py-2 text-sm text-gray-700 h-[130px] overflow-y-auto overflow-x-hidden"
                                >
                                  {Array.isArray(
                                    filtersValues[`Product.Category`]
                                  )
                                    ? filtersValues[`Product.Category`]
                                        .filter(({ value }) =>
                                          value
                                            .toLowerCase()
                                            .includes(searchValue.toLowerCase())
                                        )
                                        .map(
                                          (
                                            { value, highlighted, count },
                                            index
                                          ) => (
                                            <li
                                              key={`Product.Category.${index}`}
                                              onClick={() => {
                                                setOpenFilters((prev) => {
                                                  if (
                                                    prev.includes(
                                                      "Product.Category"
                                                    )
                                                  ) {
                                                    console.log(
                                                      "include",
                                                      "Product.Category"
                                                    );
                                                    return prev.filter(
                                                      (prop) =>
                                                        prop !==
                                                        "Product.Category"
                                                    );
                                                  }
                                                });
                                                handelfilterClick(
                                                  `Product.Category`,
                                                  value
                                                );
                                              }}
                                            >
                                              <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                                                <label className="inline-flex  w-[131px] items-center cursor-pointer text-xs font-medium text-gray-900 rounded">
                                                  {value}
                                                  <span className="text-xs text-gray-400 ml-1 ">
                                                    {"(" + count + ")"}
                                                  </span>
                                                </label>
                                              </div>
                                            </li>
                                          )
                                        )
                                    : (() => {
                                        console.log(
                                          `filtersValues[${`${category}.${property}`}] is not an array`
                                        );
                                        return null;
                                      })()}
                                </ul>
                              )}
                            </ul>
                          </div>
                        )}
                    </>
                  )}

                {property.toLowerCase() === "released timestamp" && (
                  <input
                    placeholder="Select Date"
                    type="date"
                    onChange={(e) => {
                      const inputValue = e.target.value; // Get the date value from the input change event
                      const timestampValue = convertToTimestamp(inputValue); // Convert the date value to a timestamp
                      if (timestampValue && timestampValue !== NaN) {
                        handelfilterClick(
                          `${category}.${property}`,
                          timestampValue
                        );
                      }

                      console.log(`${category}.${property}`, timestampValue);
                    }}
                    className="rounded-md border-gray-200 p-2
                        border-2 focus:border-black text-black text-xs h-9"
                  />
                )}
                {[
                  "Height_in",
                  "Height_mm",
                  "Thickness_in",
                  "Thickness_mm",
                  "Weight_g",
                  "Weight_oz",
                  "Width_in",
                  "Width_mm",
                ].includes(property.split(".")[2]) && (
                  <div className="flex space-x-1 justify-between">
                    <input
                      placeholder={t("searchPage.min")}
                      onChange={(e) => {
                        handelNumiriqueFilters(
                          property,
                          e.target.value,
                          e.target.nextElementSibling.value
                        );
                      }}
                      type="number"
                      className="rounded-md border-gray-200 p-2
                        border-2 focus:border-black text-black text-xs w-16 h-9"
                    />
                    <input
                      placeholder={t("searchPage.min")}
                      type="number"
                      onChange={(e) => {
                        handelNumiriqueFilters(
                          property,
                          e.target.previousElementSibling.value,
                          e.target.value
                        );
                      }}
                      className="rounded-md border-gray-200 p-2
                        border-2 focus:border-black text-black text-xs w-16 h-9"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div key={category}>
          <h5
            style={{ color: settings.themeColor }}
            className="text-sm font-semibold my-4 w-fit"
          >
            {removeUnderscoreAndHyphen(category)}
          </h5>
          <hr className="border-gray-100" />
          {category.toLowerCase() === "design" && (
            <div className="flex basis-full items-center space-x-2 mt-4">
              <p className="text-black text-sm">
                {t("searchPage.imperialUnitMesg")}
              </p>

              <label className="relative inline-flex items-center ">
                <input
                  type="checkbox"
                  checked={unit}
                  onChange={() => {
                    setUnit(!unit);
                  }}
                  value=""
                  className="sr-only peer"
                />
                <div
                // , borderColor:( unit ? settings.themeColor:'#DEE5EC')
                style={{background:(unit ? settings.themeColor  :'#f8fafb')  }}
                  className={`w-11 h-6 bg-[#f8fafb]  border-[2px] border-[#DEE5EC] rounded-full peer  peer-checked:after:translate-x-full   peer-checked:border-opacity-90  ${unit ? `after:bg-[${settings.themeColor}] border-[${settings.themeColor}] ` :''} peer-checked:after:bg-opacity-90 after:content-[''] after:absolute after:top-[2.4px] after:left-[3px] after:bg-gray-200   after:rounded-full after:h-[19px] after:w-[19px] after:transition-all  `}
                ></div>
              </label>
            </div>
          )}
          <div className="flex justify-start items-start flex-wrap gap-x-6 gap-y-2 py-2">
            {subcategories.map((subcategory, index) => {
              if (
                sortedFiltersArray?.some((elm) =>
                  elm.startsWith(`${category}.${subcategory}.`)
                )
              ) {
                return (
                  <div key={`${category}.${subcategory}.${index}`}>
                    <p className="text-xs font-semibold my-3">
                      {removeUnderscoreAndHyphen(subcategory)}
                    </p>
                    <hr className="border-gray-100" />
                    <div className=" relative flex justify-start items-start flex-wrap gap-2 py-2">
                      {sortedFiltersArray
                        ?.filter((property) =>
                          property.startsWith(
                            category + "." + subcategory + "."
                          )
                        )
                        .map((property, index) => (
                          <div key={`?${index}`}>
                            {![
                              "Height_in",
                              "Height_mm",
                              "Thickness_in",
                              "Thickness_mm",
                              "Weight_g",
                              "Weight_oz",
                              "Width_in",
                              "Width_mm",
                            ].includes(property.split(".")[2]) && (
                              <p className="text-black text-sm mb-1">
                                {removeUnderscoreAndHyphen(
                                  property.split(".")[2]
                                )}
                              </p>
                            )}
                            {unit &&
                              [
                                "Height_in",
                                "Thickness_in",
                                "Weight_oz",
                                "Width_in",
                              ].includes(property.split(".")[2]) && (
                                <p className="text-black text-sm mb-1  w-[120px]">
                                  {removeUnderscoreAndHyphen(
                                   property.split(".")[2].split('_').join(' (').concat(')')

                                  )}
                                </p>
                              )}
                            {!unit &&
                              [
                                "Thickness_mm",
                                "Weight_g",
                                "Width_mm",
                                "Height_mm",
                              ].includes(property.split(".")[2]) && (
                                <p className="text-black text-sm mb-1  w-[120px]">
                                  {removeUnderscoreAndHyphen(
                                   property.split(".")[2].split('_').join(' (').concat(')')
                                   )}
                                </p>
                              )}

                            {property.split(".")[2].toLowerCase() !==
                              "released timestamp" &&
                              ![
                                "Height_in",
                                "Height_mm",
                                "Thickness_in",
                                "Thickness_mm",
                                "Weight_g",
                                "Weight_oz",
                                "Width_in",
                                "Width_mm",
                              ].includes(property.split(".")[2]) && (
                                <>
                                  <button
                                    ref={dropdownBtnRef}
                                    // onClick={() => {
                                    //   setOpenFilters((prev) => {
                                    //     console.log("property", property);

                                    //     getFilterValues(property);
                                    //     return [...prev, property];
                                    //   });
                                    // }}
                                    onClick={() => {
                                      setOpenFilters((prev) => {
                                        let openfilters = [...prev];

                                        if (
                                          openfilters.includes(
                                            property
                                          )
                                        ) {
                                          openfilters = openfilters.filter(
                                            (item) =>
                                              item !== property
                                          );
                                          return openfilters;
                                        } else {
                                          openfilters = [
                                            ...openfilters,
                                            property,
                                          ];
                                        }

                                        console.log(
                                          "property",
                                          property
                                        );

                                        getFilterValues(
                                          property
                                        );
                                        return [
                                          ...openfilters,
                                          property,
                                        ];
                                      });
                                    }}
                                    className="bg-gray-100 flex items-center justify-between p-2 rounded-md text-sm font-medium hover:bg-gray-200 space-x-1 w-40"
                                  >
                                    <span>
                                      {Object.keys(apliedFilters).includes(
                                        property
                                      )
                                        ? apliedFilters[property].length > 1
                                          ? apliedFilters[property][0] +
                                            " +" +
                                            (apliedFilters[property].length - 1)
                                          : apliedFilters[property][0]
                                        : t("searchPage.filtersBtn")}
                                    </span>
                                    <span aria-hidden="true" className="">
                                      <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                                          fill="currentColor"
                                          fill-rule="evenodd"
                                          clip-rule="evenodd"
                                        ></path>
                                      </svg>
                                    </span>
                                  </button>

                                  {Open?.includes(property) && (
                                    <div
                                      ref={dropdownRef}
                                      data-property={property}
                                      className="Drop-dwon dropshd  absolute  bg-white  z-[5000001] rounded-lg shadow w-44 h-48 cursor-pointer"
                                    >
                                      <div className="p-2">
                                        <label
                                          htmlFor="input-group-search"
                                          className="sr-only"
                                        >
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
                                            value={searchValue}
                                            onChange={(e) =>
                                              setSearchValue(e.target.value)
                                            }
                                            type="text"
                                            id="input-group-search"
                                            className="bg-white outline-none border border-gray-300 text-gray-900 text-sm rounded-3xl  block w-full pl-10 p-2.5 placeholder:text-gray-300 "
                                            placeholder={t(
                                              "navigationMenu.search"
                                            )}
                                          />
                                        </div>
                                      </div>

                                      <ul className="py-2 text-sm text-gray-700 h-[130px] overflow-y-auto no-scrollbar">
                                        {filtersValues[property] && (
                                          <ul
                                            dir="ltr"
                                            className="py-2 text-sm text-gray-700 h-[130px] overflow-y-auto overflow-x-hidden"
                                          >
                                            {/* {Array.isArray(
                                              filtersValues[property]
                                            )
                                              ? filtersValues[property]
                                                  .filter(({ value }) =>
                                                    value
                                                      .toLowerCase()
                                                      .includes(
                                                        searchValue.toLowerCase()
                                                      )
                                                  )
                                                  .map(
                                                    (
                                                      {
                                                        value,
                                                        highlighted,
                                                        count,
                                                      },
                                                      index
                                                    ) => (
                                                      <li key={value}>
                                                        <div
                                                          onClick={() =>
                                                            handelfilterClick(
                                                              property,
                                                              value
                                                            )
                                                          }
                                                          className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                                                        >
                                                          <label className="inline-flex w-[131px] items-center cursor-pointer text-sm font-medium text-gray-900 rounded">
                                                            {value}
                                                            <span className="text-xs text-gray-400 ml-1 ">
                                                              {"(" +
                                                                count +
                                                                ")"}
                                                            </span>
                                                          </label>
                                                        </div>
                                                      </li>
                                                    )
                                                  )
                                              : (() => {
                                                  console.log(
                                                    `filtersValues[${property}] is not an array`
                                                  );
                                                  return null;
                                                })()} */}
                                            {Array.isArray(
                                              filtersValues[property]
                                            )
                                              ? filtersValues[property]
                                                  .filter(({ value }) =>
                                                    value
                                                      .toLowerCase()
                                                      .includes(
                                                        searchValue.toLowerCase()
                                                      )
                                                  )
                                                  .filter(({ value }) =>
                                                    apliedFilters[
                                                      property
                                                    ]?.includes(value)
                                                  )
                                                  .map(
                                                    (
                                                      {
                                                        value,
                                                        highlighted,
                                                        count,
                                                      },
                                                      index
                                                    ) => (
                                                      <li
                                                        key={`${property}.${index}`}
                                                      >
                                                        <div 
                                                           onClick={() =>
                                                            handelfilterClick(
                                                              property,
                                                              value
                                                            )
                                                          }

                                                        className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                                                          <div
                                                            className=" flex justify-center items-center border mr-2 w-[17px] h-[17px] bg-[#05AAF0] border-[#189ced] rounded"
                                                           
                                                          >
                                                            <svg
                                                              className="w-3 h-3 mt-[.5px] text-white fill-current"
                                                              viewBox="0 0 16 16"
                                                            >
                                                              <path d="M13.75 3.25L5.75 11.25L2.25 7.75L3.65 6.35L5.75 8.45L12.35 1.85L13.75 3.25Z" />
                                                            </svg>
                                                          </div>

                                                          <label className="inline-flex w-[131px] items-center cursor-pointer text-xs font-medium text-gray-900 rounded">
                                                            {value}
                                                            <span className="text-xs text-gray-400 ml-1 ">
                                                              {"(" +
                                                                count +
                                                                ")"}
                                                            </span>
                                                          </label>
                                                        </div>
                                                      </li>
                                                    )
                                                  )
                                              : (() => {
                                                  console.log(
                                                    `filtersValues[${property}] is not an array`
                                                  );
                                                  return null;
                                                })()}

                                            {Array.isArray(
                                              filtersValues[property]
                                            )
                                              ? filtersValues[property]
                                                  .filter(({ value }) =>
                                                    value
                                                      .toLowerCase()
                                                      .includes(
                                                        searchValue.toLowerCase()
                                                      )
                                                  )
                                                  .filter(
                                                    ({ value }) =>
                                                      !apliedFilters[
                                                        property
                                                      ]?.includes(value)
                                                  )
                                                  .map(
                                                    (
                                                      {
                                                        value,
                                                        highlighted,
                                                        count,
                                                      },
                                                      index
                                                    ) => (
                                                      <li
                                                        key={`${property}.${index}`}
                                                      >
                                                        <div 
                                                           onClick={() =>
                                                            handelfilterClick(
                                                            property,
                                                              value
                                                            )
                                                          }
                                                          className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                                                          <div
                                                            className=" flex justify-center items-center border mr-2 w-[17px] h-[17px] bg-[#d8edf7] border-[#189ced] rounded"
                                                     
                                                          ></div>

                                                          <label className="inline-flex  w-[131px] items-center cursor-pointer text-xs font-medium text-gray-900 rounded ">
                                                            {value}
                                                            <span className="text-xs text-gray-400 ml-1 ">
                                                              {"(" +
                                                                count +
                                                                ")"}
                                                            </span>
                                                          </label>
                                                        </div>
                                                      </li>
                                                    )
                                                  )
                                              : (() => {
                                                  console.log(
                                                    `filtersValues[${`property`}] is not an array`
                                                  );
                                                  return null;
                                                })()}
                                          </ul>
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                </>
                              )}
                            {unit &&
                              [
                                "Height_in",
                                "Thickness_in",
                                "Weight_oz",
                                "Width_in",
                              ].includes(property.split(".")[2]) && (
                                <div className="flex space-x-1 justify-between gap-2">
                                  <input
                                    type="number"
                                    placeholder={t("searchPage.min")}
                                    onChange={(e) => {
                                      handelNumiriqueFilters(
                                        property,
                                        e.target.value,
                                        e.target.nextElementSibling.value
                                      );
                                    }}
                                    className="rounded-md border-gray-200 py-2 px-1
                          border-2 focus:border-black text-black text-xs w-16 h-9"
                                  />
                                  <input
                                    placeholder={t("searchPage.max")}
                                    onChange={(e) => {
                                      handelNumiriqueFilters(
                                        property,
                                        e.target.previousElementSibling.value,
                                        e.target.value
                                      );
                                    }}
                                    type="number"
                                    className="rounded-md border-gray-200 py-2 px-1
                          border-2 focus:border-black text-black text-xs w-16 h-9"
                                  />
                                </div>
                              )}
                            {!unit &&
                              [
                                "Height_mm",
                                "Thickness_mm",
                                "Weight_g",
                                "Width_mm",
                              ].includes(property.split(".")[2]) && (
                                <div className="flex space-x-1 justify-between gap-2 ">
                                  <input
                                    placeholder={t("searchPage.min")}
                                    onChange={(e) => {
                                      handelNumiriqueFilters(
                                        property,
                                        e.target.value,
                                        e.target.nextElementSibling.value
                                      );
                                    }}
                                    type="number"
                                    className="rounded-md border-gray-200  py-2 px-1
                          border-2 focus:border-black text-black text-xs w-16 h-9"
                                  />
                                  <input
                                    placeholder={t("searchPage.max")}
                                    onChange={(e) => {
                                      handelNumiriqueFilters(
                                        property,
                                        e.target.previousElementSibling.value,
                                        e.target.value
                                      );
                                    }}
                                    type="number"
                                    className="rounded-md border-gray-200 py-2 px-1
                          border-2 focus:border-black text-black text-xs w-16 h-9"
                                  />
                                </div>
                              )}
                          </div>
                        ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={category}>
                  <h5 className="text-sm font-semibold my-3 w-fit h-4"></h5>
                  <hr className="border-gray-100" />

                  <div className="flex justify-start items-start flex-wrap gap-2 py-2 relative">
                    <div key={category + ".?" + subcategory}>
                      <p className="text-black text-sm mb-1">
                        {removeUnderscoreAndHyphen(subcategory)}
                      </p>

                      <button
                        ref={dropdownBtnRef}
                        // onClick={() => {
                        //   setOpenFilters((prev) => {
                        //     console.log(
                        //       "property",
                        //       `${category}.${subcategory}`
                        //     );

                        //     getFilterValues(`${category}.${subcategory}`);
                        //     return [...prev, `${category}.${subcategory}`];
                        //   });
                        // }}
                        onClick={() => {
                          setOpenFilters((prev) => {
                            let openfilters = [...prev];

                            if (
                              openfilters.includes(`${category}.${subcategory}`)
                            ) {
                              openfilters = openfilters.filter(
                                (item) => item !== `${category}.${subcategory}`
                              );
                              return openfilters;
                            } else {
                              openfilters = [
                                ...openfilters,
                                `${category}.${subcategory}`,
                              ];
                            }

                            console.log("property", `${category}.${subcategory}`);

                            getFilterValues(`${category}.${subcategory}`);
                            return [...openfilters, `${category}.${subcategory}`];
                          });
                        }}
                        className="bg-gray-100 flex items-center justify-between p-2 rounded-md text-sm font-medium hover:bg-gray-200 space-x-1 w-40"
                      >
                        <span>
                          {Object.keys(apliedFilters).includes(
                            `${category}.${subcategory}`
                          )
                            ? apliedFilters[`${category}.${subcategory}`]
                                .length > 1
                              ? apliedFilters[`${category}.${subcategory}`][0] +
                                " +" +
                                (apliedFilters[`${category}.${subcategory}`]
                                  .length -
                                  1)
                              : apliedFilters[`${category}.${subcategory}`][0]
                            : t("searchPage.filtersBtn")}
                        </span>
                        <span aria-hidden="true" className="">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                              fill="currentColor"
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </button>

                      {Open?.includes(`${category}.${subcategory}`) && (
                        <div
                          ref={dropdownRef}
                          data-property={`${category}.${subcategory}`}
                          className="Drop-dwon dropshd  absolute  bg-white z-[5000001] h-48  rounded-lg shadow w-44 cursor-pointer"
                        >
                          <div className="p-2">
                            <label
                              htmlFor="input-group-search"
                              className="sr-only"
                            >
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
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                type="text"
                                id="input-group-search"
                                className="bg-white outline-none border border-gray-300 text-gray-900 text-sm rounded-3xl  block w-full pl-10 p-2.5 placeholder:text-gray-300 "
                                placeholder={t("navigationMenu.search")}
                              />
                            </div>
                          </div>

                          <ul className="py-2 text-sm text-gray-700 h-[130px] overflow-y-auto no-scrollbar">
                            {filtersValues[`${category}.${subcategory}`] && (
                              <ul
                                dir="ltr"
                                className="py-2 text-sm text-gray-700 h-[130px] overflow-y-auto overflow-x-hidden"
                              >
                                {/* {Array.isArray(
                                  filtersValues[`${category}.${subcategory}`]
                                )
                                  ? filtersValues[`${category}.${subcategory}`]
                                      .filter(({ value }) =>
                                        value
                                          .toLowerCase()
                                          .includes(searchValue.toLowerCase())
                                      )
                                      .map(
                                        (
                                          { value, highlighted, count },
                                          index
                                        ) => (
                                          <li key={index}>
                                            <div
                                              onClick={() =>
                                                handelfilterClick(
                                                  `${category}.${property}`,
                                                  value
                                                )
                                              }
                                              className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                                            >
                                              <label className="inline-flex  w-[131px] items-center cursor-pointer text-sm font-medium text-gray-900 rounded">
                                                {value}
                                                <span className="text-xs text-gray-400 ml-1 ">
                                                  {"(" + count + ")"}
                                                </span>
                                              </label>
                                            </div>
                                          </li>
                                        )
                                      )
                                  : (() => {
                                      console.log(
                                        `filtersValues[${`${category}.${subcategory}`}] is not an array`
                                      );
                                      return null;
                                    })()} */}
                                {Array.isArray(
                                  filtersValues[`${category}.${subcategory}`]
                                )
                                  ? filtersValues[`${category}.${subcategory}`]
                                      .filter(({ value }) =>
                                        value
                                          .toLowerCase()
                                          .includes(searchValue.toLowerCase())
                                      )
                                      .filter(({ value }) =>
                                        apliedFilters[
                                          `${category}.${subcategory}`
                                        ]?.includes(value)
                                      )
                                      .map(
                                        (
                                          { value, highlighted, count },
                                          index
                                        ) => (
                                          <li
                                            key={`${category}.${subcategory}.${index}`}
                                          >
                                            <div
                                             onClick={() =>
                                              handelfilterClick(
                                                `${category}.${subcategory}`,
                                                value
                                              )
                                            }
                                             className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                                              <div
                                                className=" flex justify-center items-center border mr-2 w-[17px] h-[17px] bg-[#05AAF0] border-[#189ced] rounded"
                                               
                                              >
                                                <svg
                                                  className="w-3 h-3 mt-[.5px] text-white fill-current"
                                                  viewBox="0 0 16 16"
                                                >
                                                  <path d="M13.75 3.25L5.75 11.25L2.25 7.75L3.65 6.35L5.75 8.45L12.35 1.85L13.75 3.25Z" />
                                                </svg>
                                              </div>

                                              <label className="inline-flex  w-[131px] items-center cursor-pointer text-xs font-medium text-gray-900 rounded">
                                                {value}
                                                <span className="text-xs text-gray-400 ml-1 ">
                                                  {"(" + count + ")"}
                                                </span>
                                              </label>
                                            </div>
                                          </li>
                                        )
                                      )
                                  : (() => {
                                      console.log(
                                        `filtersValues[${`${category}.${subcategory}`}] is not an array`
                                      );
                                      return null;
                                    })()}

                                {Array.isArray(
                                  filtersValues[`${category}.${subcategory}`]
                                )
                                  ? filtersValues[`${category}.${subcategory}`]
                                      .filter(({ value }) =>
                                        value
                                          .toLowerCase()
                                          .includes(searchValue.toLowerCase())
                                      )
                                      .filter(
                                        ({ value }) =>
                                          !apliedFilters[
                                            `${category}.${subcategory}`
                                          ]?.includes(value)
                                      )
                                      .map(
                                        (
                                          { value, highlighted, count },
                                          index
                                        ) => (
                                          <li
                                            key={`${category}.${subcategory}.${index}`}
                                          >
                                            <div
                                               onClick={() =>
                                                handelfilterClick(
                                                  `${category}.${subcategory}`,
                                                  value
                                                )
                                              }
                                              
                                            className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                                              <div
                                                className=" flex justify-center items-center border mr-2 w-[17px] h-[17px] bg-[#d8edf7] border-[#189ced] rounded"
                                             
                                              ></div>

                                              <label className="inline-flex  w-[131px] items-center cursor-pointer text-xs font-medium text-gray-900 rounded">
                                                {value}
                                                <span className="text-xs text-gray-400 ml-1 ">
                                                  {"(" + count + ")"}
                                                </span>
                                              </label>
                                            </div>
                                          </li>
                                        )
                                      )
                                  : (() => {
                                      console.log(
                                        `filtersValues[${`${category}.${subcategory}`}] is not an array`
                                      );
                                      return null;
                                    })()}
                              </ul>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="z-[5000001] ">
      <div className="my-2  max-h-32 overflow-y-auto  ">
        <div
          className={`text-sm  font-semibold flex items-center ${
            category === t("searchPage.deviceTypeDropdown").toLowerCase()
              ? "text-black "
              : "text-gray-400"
          } `}
        >
          {t("searchPage.categorySelection")}
          <span className="text-[17px] font-bold mx-2 ">
            {category === t("searchPage.deviceTypeDropdown").toLowerCase()
              ? "  "
              : " > "}
          </span>
          {
            <span className=" mx-2 text-black  ">
              {category === t("searchPage.deviceTypeDropdown").toLowerCase()
                ? ""
                : t("searchPage.filterRefinement")}
            </span>
          }
        </div>

        <FiltersTags />
      </div>
      {category !== t("searchPage.deviceTypeDropdown").toLowerCase() &&
        sortedFiltersArray.length !== 0 &&
        uniqueCategories.map((category) => {
          const subcategories1 = sortedFiltersArray
            ?.filter((property) => property.startsWith(category + "."))
            .map((property) => property.split(".")[1]);
          const subcategories = [...new Set(subcategories1)];
          const propertiesForCategory = sortedFiltersArray
            ?.filter((property) => property.startsWith(category + "."))
            .map((property) => property.split(".")[2])
            .filter((property) => property !== undefined && property !== null);
          return renderSubcategories(
            category,
            subcategories,
            propertiesForCategory
          );
        })}

      {category === t("searchPage.deviceTypeDropdown").toLowerCase() && (
        <div className="flex items-center h-[calc(100vh-275px)] z-[5000001] overflow-hidden  justify-center  ">
          <div className=" ">
            <p className="text-black text-sm mb-1">{"Category"}</p>
            <button
              ref={dropdownBtnRef}
              // onClick={() => {
              //   setOpenFilters((prev) => {
              //     console.log("property", `Product.Category`);

              //     getFilterValues(`Product.Category`);
              //     return [...prev, `Product.Category`];
              //   });
              // }}
              onClick={() => {
                setOpenFilters((prev) => {
                  let openfilters = [...prev];

                  if (openfilters.includes(`Product.Category`)) {
                    openfilters = openfilters.filter(
                      (item) => item !== `Product.Category`
                    );
                    return openfilters;
                  } else {
                    openfilters = [...openfilters, `Product.Category`];
                  }

                  console.log("property", `Product.Category`);

                  getFilterValues(`Product.Category`);
                  return [...openfilters,`Product.Category`];
                });
              }}
              className="bg-gray-100 flex items-center justify-between p-2 rounded-md text-sm font-medium hover:bg-gray-200 space-x-1 w-40"
            >
              <span>{t("searchPage.filtersBtn")}</span>
              <span aria-hidden="true">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
            </button>

            {Open?.includes(`Product.Category`) && (
              <div
                ref={dropdownRef}
                data-property={`Product.Category`}
                className="Drop-dwon dropshd  absolute  bg-white z-[5000001] h-48  rounded-lg shadow w-44 cursor-pointer"
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
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      type="text"
                      id="input-group-search"
                      className="bg-white outline-none border  border-gray-300 text-gray-900 text-sm rounded-3xl  block w-full pl-10 p-2.5 placeholder:text-gray-300 "
                      placeholder={t("navigationMenu.search")}
                    />
                  </div>
                </div>

                <ul className="py-2 text-sm text-gray-700 h-[130px] overflow-y-auto no-scrollbar">
                  {filtersValues[`Product.Category`] && (
                    <ul
                      dir="ltr"
                      className="py-2 text-sm text-gray-700 h-[130px] overflow-y-auto overflow-x-hidden"
                    >
                      {Array.isArray(filtersValues[`Product.Category`])
                        ? filtersValues[`Product.Category`]
                            .filter(({ value }) =>
                              value
                                .toLowerCase()
                                .includes(searchValue.toLowerCase())
                            )
                            .map(({ value, highlighted, count }, index) => (
                              <li
                                key={`Product.Category.${index}`}
                                onClick={() => {
                                  setOpenFilters((prev) => {
                                    if (prev.includes("Product.Category")) {
                                      console.log(
                                        "include",
                                        "Product.Category"
                                      );
                                      return prev.filter(
                                        (prop) => prop !== "Product.Category"
                                      );
                                    }
                                  });
                                  handelfilterClick(`Product.Category`, value);
                                }}
                              >
                                <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                                  <label className="inline-flex  w-[131px] items-center cursor-pointer text-xs font-medium text-gray-900 rounded">
                                    {value}
                                    <span className="text-xs text-gray-400 ml-1 ">
                                      {"(" + count + ")"}
                                    </span>
                                  </label>
                                </div>
                              </li>
                            ))
                        : (() => {
                            console.log(
                              `filtersValues[${`${category}.${property}`}] is not an array`
                            );
                            return null;
                          })()}
                    </ul>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
