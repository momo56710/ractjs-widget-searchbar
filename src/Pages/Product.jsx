import React, { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "./UserContext";
import NavBar from "../componetns/NavBar";
import Footer from "../componetns/Footer";
import { useTranslation } from "react-i18next";

const Product = () => {
  const {
    productsId,
    cleanParentHostname,
    setactive,
    setProductsId,
    myProduct,
    settings,
    compare,
    setLangParms,
    navigateToCompare,
    CompareProducts,
    fetchProduct,
  } = useContext(UserContext);
  useEffect(() => {
    window.plausible("Visit - Product Details - Inline Widget", {
      host: cleanParentHostname,
    });
  }, []);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [ClickedIndex, setClickedIndex] = useState(0);
  const [HoverdIndex, setHoverdIndex] = useState(50);
  const [del, setDel] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchversion, setSearchVersion] = useState("");
  const [versionArr, setVersionArr] = useState([]);
  const [version, setVersion] = useState(0);
  const scrollContainerRef = useRef(null);
  const [error, setError] = useState(false);
  const [error1, setError1] = useState(false);
  const [buttonContent, setButtonContent] = useState([]);
  const [tooltipContent, setTooltipContent] = useState({
    section: "",
    desc: "",
  });
  const [expandedItems, setExpandedItems] = useState([]);
  const [t, i18n] = useTranslation();
  const isRTL = i18n.language === "ar";
  const [color, setColor] = useState("#91A8BF");

  const dropDownRef = useRef(null);

  useEffect(() => {
    const closeDropdownOnOutsideClick = (event) => {
      if (!dropDownRef.current?.contains(event.target)) {
        console.log("Clicked outside, closing dropdown");
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeDropdownOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeDropdownOnOutsideClick);
    };
  }, [dropDownRef]);

  // Function to toggle the expansion state of a content item
  const toggleExpandItem = (index) => {
    setExpandedItems((prevExpandedItems) => {
      if (prevExpandedItems.includes(index)) {
        return prevExpandedItems.filter((item) => item !== index);
      } else {
        return [...prevExpandedItems, index];
      }
    });
  };
  let matchesSearch = false;
  let matcheskey = false;
  let matchesSection = false;

  const handleMouseEnterTooltip = (section) => {
    const desc = t(`tooltips.${section}`);
    setTooltipContent({ section: section, desc: desc });
  };

  const handleMouseLeaveTooltip = () => {
    setTooltipContent({ section: "", desc: "" });
  };

  function getAllKeys(obj) {
    let keys = [];

    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        keys = keys.concat(
          removeUnderscoreAndHyphen(key),
          getAllKeys(obj[key])
        );
      }
      keys.push(removeUnderscoreAndHyphen(key));
    }

    return keys;
  }
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

  const inputRef = useRef(null);
  useEffect(() => {
    // Check if the dropdown is open and the ref is available
    if (open && inputRef.current) {
      // Set focus to the dropdown element when it opens
      inputRef.current.focus();
    }
  }, [open]);
  function render(item) {
    const productCategory =
      item?.[capitalizeFirstLetter(t("detailsPage.product"))]?.[capitalizeFirstLetter(t("detailsPage.category"))];
      console.log('prrr' , productCategory);
    let imageSrc = "";
    let frontImageExists = "";
    let backImageExists = "";
    if (item[capitalizeFirstLetter(t("detailsPage.image"))]) {
      console.log('image' , item[capitalizeFirstLetter(t("detailsPage.image"))]);
      if (
        item?.[capitalizeFirstLetter(t("detailsPage.image"))]?.[capitalizeFirstLetter(t("detailsPage.front"))] &&
        item?.[capitalizeFirstLetter(t("detailsPage.image"))]?.[capitalizeFirstLetter(t("detailsPage.front"))] !== null
      )
        frontImageExists =
          item?.[capitalizeFirstLetter(t("detailsPage.image"))]?.[capitalizeFirstLetter(t("detailsPage.front"))]; // Set to true if the front image exists
          console.log( capitalizeFirstLetter(t("detailsPage.front")) , frontImageExists);
      if (
        item?.[capitalizeFirstLetter(t("detailsPage.image"))]?.[capitalizeFirstLetter(t("detailsPage.back"))] &&
        item?.[capitalizeFirstLetter(t("detailsPage.image"))]?.[capitalizeFirstLetter(t("detailsPage.back"))] !== null
      )
        backImageExists =
          item?.[capitalizeFirstLetter(t("detailsPage.image"))]?.[capitalizeFirstLetter(t("detailsPage.back"))]; // Set to true if the back image exists
    console.log('back' , backImageExists);
        }

    if (frontImageExists !== "") {
      imageSrc = frontImageExists;
    } else if (backImageExists !== "") {
      imageSrc = backImageExists;
    } else {
      switch (productCategory) {
        case "Smartphones":
          imageSrc = import.meta.env.VITE_SMARTPHONE_IMAGE_URL;
          break;
        case "Tablets":
          imageSrc = import.meta.env.VITE_TABLET_IMAGE_URL;
          break;
        case "Smartwatches":
          imageSrc = import.meta.env.VITE_SMARTWATCH_IMAGE_URL;
          break;
        case "Laptops":
          imageSrc = import.meta.env.VITE_LAPTOP_IMAGE_URL;
          break;
        case "Desktops":
          imageSrc = import.meta.env.VITE_DESKTOP_IMAGE_URL;
          break;
        case "GPUs":
          imageSrc = import.meta.env.VITE_GPU_IMAGE_URL;
          break;
        case "Displays":
          imageSrc = import.meta.env.VITE_DISPLAY_IMAGE_URL;
          break;
        default:
          imageSrc = import.meta.env.VITE_DEFAULT_IMAGE_URL;
          break;
      }
    }
    return imageSrc;
  }
  function isProductIncluded(productId, elements) {
    const storedLanguage = localStorage.getItem("language"); // Retrieve the stored language from local storage
    if (!storedLanguage || JSON.parse(storedLanguage).isoCode === "en") {
      return elements.some(
        (element) => element?.[t("detailsPage.product")]?.id === productId
      );
    } else {
      return elements.some(
        (element) =>
          element?.[t("detailsPage.product")]?.english_id === productId
      );
    }
  }
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
  function handelCompareClick(productId, category) {
    if (CompareProducts.length > 0) {
      let catg =
        CompareProducts[0]?.[t("detailsPage.product")]?.[
          t("detailsPage.category")
        ];
      if (!(category === catg)) {
        setError(true);
        setTimeout(() => setError(false), 1000);
      } else {
        if (isProductIncluded(productId, CompareProducts)) {
          setError1(true);
          setTimeout(() => setError1(false), 1000);
        } else {
          fetchProduct(productId, true);
          navigateToCompare();
          let prIds;
          prIds = toggle(productId, productsId);
          setProductsId(prIds);
        }
      }
    } else {
      fetchProduct(productId, true);
      navigateToCompare();
      let prIds;
      prIds = toggle(productId, productsId);
      setProductsId(prIds);
    }
  }

  function removeUnderscoreAndHyphen(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "_" || str[i] === "-") {
        result += " ";
      } else {
        result += str[i];
      }
    }
    return result;
  }

  const handleMouseEnter = (index) => {
    setHoverdIndex(index);
    setIsHovered(true);
  };

  const handleMouseLeave = (index) => {
    setHoverdIndex(50);
    setIsHovered(false);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (myProduct.items) {
      setVersionArr(
        myProduct.items.map((item, index) => ({
          version: item?.[t("detailsPage.product")]?.[t("detailsPage.version")],
          index: index,
        }))
      );

      if (myProduct.items.length > 0) {
        const arr = getAllKeys(myProduct.items[0]); // Assuming you want to get keys from the first item

        if (arr.length > 0) {
          const idd = arr.find((str) => str.includes(search));
          if (idd) {
            const iddelm = document.getElementById(idd);
            if (iddelm) {
              scrollContainerRef.current.scrollTop = iddelm.offsetTop - 250;
            }
          }
        }
      }
    }
  }, [myProduct, search]);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language"); // Retrieve the stored language from local storage
    if (!storedLanguage || JSON.parse(storedLanguage).isoCode === "en") {
      if (myProduct.items)
        setLangParms({
          productId: myProduct.items[version]?.[t("detailsPage.product")]?.id,
          version: version,
        });
    } else {
      if (myProduct.items)
        setLangParms({
          productId:
            myProduct.items[version]?.[t("detailsPage.product")]?.english_id,
          version: version,
        });
    }
  }, [myProduct]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.value.toLowerCase());
  };

  const handleClick = (index, content) => {
    setClickedIndex(index);
    setIsClicked(true);
    if (content.toLowerCase() === "what's inside") {
      scrollToSection("inside");
    } else {
      scrollToSection(content.toLowerCase());
    }
  };

  const buttonStyle = {
    width: "92px",
    height: "34px",
    borderRadius: "4px",
    cursor: "pointer",
    textTransform: "uppercase",
    fontSize: "10px",
    fontWeight: "600",
    display: "flex",
    lineHeight: "18px",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2F6",
  };

  const hoverStyle = {
    backgroundColor: settings.themeColor,
    color: "white",
  };
  const clickStyle = {
    backgroundColor: isClicked ? settings.themeColor : "#EEF2F6",
    color: isClicked ? "white" : "black",
  };

  useEffect(() => {
    const calculateButtons = () => {
      const ar = [];

      if (myProduct.items) {
        for (const key in myProduct.items[version]) {
          if (
            key !== t("detailsPage.product") &&
            key !== t("detailsPage.image") &&
            key !== t("detailsPage.date")
          ) {
            ar.push(removeUnderscoreAndHyphen(key));
          }
        }
      }

      return ar;
    };

    setButtonContent(calculateButtons());
  }, [myProduct, version]);

  // State variable to track section collapse state
  const [collapsedSections, setCollapsedSections] = useState({
    design: false, // Set the desired sections to false to keep them expanded
    // Add more sections as needed
  });

  // Function to toggle the collapse state of a section
  const toggleSection = (section) => {
    setCollapsedSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };

  const renderProperties = (properties, parentKey = "") => {
    return Object.entries(properties).map(([key, value], index) => {
      const sectionKey = parentKey ? `${parentKey}.${key}` : key;
      if (!(search === "")) {
        matchesSearch = removeUnderscoreAndHyphen(sectionKey.toLowerCase())
          .toLowerCase()
          .includes(search.toLowerCase());
      }
      if (typeof value === "object") {
        const isSectionCollapsed = collapsedSections[sectionKey];
        if (!(search === "")) {
          matcheskey = removeUnderscoreAndHyphen(key.toLowerCase())
            .toLowerCase()
            .includes(search.toLowerCase());
        }

        return (
          <div key={index} id={removeUnderscoreAndHyphen(key.toLowerCase())}>
            <div
              className={`flex justify-between  border-b-[1px] border-gray-color px-[8px] py-5 items-center ${
                matcheskey
                  ? `text-[${settings.themeColor}]`
                  : search !== ""
                  ? " text-gray-300"
                  : ""
              }`}
            >
              <h3
                className={`capitalize font-semibold text-[12px] `}
                onClick={(e) => toggleSection(sectionKey)}
              >
                {removeUnderscoreAndHyphen(key)}
              </h3>

              <img src="./images/arrow-down.svg" alt="" />
            </div>

            {!isSectionCollapsed && renderProperties(value, sectionKey)}
          </div>
        );
      } else {
        const storagelanguage = JSON.parse(
          localStorage.getItem("language")
        )?.isoCode;
        if (key === "color" || key === "color_options") {
          const colors = value.split(",");
          return (
            <div>
              <div
                key={index}
                id={removeUnderscoreAndHyphen(key.toLowerCase())}
                className={`flex justify-between items-center  px-[8px]  py-[20px] border-b-[1px] border-gray-color  ${
                  matchesSearch || matchesSection
                    ? `text-[${settings.themeColor}]`
                    : search !== ""
                    ? " text-gray-300"
                    : ""
                }`}
              >
                <p
                  className={`${
                    matchesSection
                      ? `text-[${settings.themeColor}]`
                      : "text-[#91A8BF]"
                  } text-xs font-normal capitalize`}
                >
                  {removeUnderscoreAndHyphen(key)}
                </p>
                <div className="flex items-center justify-center gap-5">
                  {colors.map((color, index) => (
                    <div className="flex flex-col gap-1 sm:gap-2 justify-center items-center ">
                      <p
                        className="font-normal text-[10px] sm:text-xs ml-auto  max-w-[210px] sm:max-w-[390px]  hyphens-auto break-words hpnes"
                        lang={storagelanguage || "en"}
                      >
                        {color}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }
        const max_content = 80;
        return (
          <div
            key={index}
            id={removeUnderscoreAndHyphen(key.toLowerCase())}
            className={`flex justify-between items-center px-[8px] py-[20px] border-b-[1px] border-gray-color  ${
              matchesSearch || matchesSection
                ? `text-[${settings.themeColor}]`
                : search !== ""
                ? " text-gray-300"
                : ``
            }        `}
          >
            <p
              style={{
                color:
                  matchesSearch || matchesSection ? settings.themeColor : "",
              }}
              className={`${
                search !== "" ? " text-gray-300" : "text-[#91A8BF]"
              }   text-xs font-normal `}
            >
              {removeUnderscoreAndHyphen(key)}
            </p>

            {value.length > 80 ? (
              <div>
                <p
                  className={`font-normal text-[12px] text-center ${
                    isRTL ? "mr-auto" : "ml-auto"
                  }  max-w-[210px] sm:max-w-[390px] hyphens-auto break-words hpnes`}
                  lang={storagelanguage || "en"}
                >
                  {!expandedItems.includes(index)
                    ? value.slice(0, 80)
                    : value + "  "}
                  <button
                    onClick={() => toggleExpandItem(index)}
                    className="text-[#91A8BF] font-normal text-[12px] "
                  >
                    {expandedItems.includes(index)
                      ? `(${t("buttons.lessBtn")})`
                      : `(${t("buttons.moreBtn")})`}
                  </button>
                </p>
              </div>
            ) : (
              <p
                className={`font-normal text-[12px] text-center ${
                  isRTL ? "mr-auto" : "ml-auto"
                }  max-w-[210px] sm:max-w-[390px] hyphens-auto break-words hpnes`}
                lang={storagelanguage || "en"}
              >
                {removeUnderscoreAndHyphen(value)}
              </p>
            )}
          </div>
        );
      }
    });
  };
  const handleSearchClick = (e) => {
    e.stopPropagation();
  };
  const handleSearchChange = (e) => {
    setSearchVersion(e.target.value);
  };

  let filteredVersion = versionArr.filter(
    (elm) =>
      elm.version &&
      elm.version.toLowerCase().includes(searchversion.toLowerCase())
  );

  return (
    <div
      className={`w-full flex flex-col h-screen bg-white  ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="fixed top-0 z-50 w-full bg-white">
        <NavBar />
      </div>
      {error && (
        <div className="fixed z-[999999999] top-[32%] left-1/2 -translate-x-1/2 bg-red-200 px-7 py-1 rounded-md mb-3 w-fit mx-auto">
          {[t("detailsPage.interCategoryErrorMessage")]}{" "}
        </div>
      )}
      {error1 && (
        <div className="fixed z-[999999999] top-[32%] left-1/2 -translate-x-1/2 bg-red-200 px-7 py-1 rounded-md mb-3 w-fit mx-auto">
          {[t("detailsPage.duplicateProductErrorMessage")]}{" "}
        </div>
      )}
      <div className="flex mt-[63px] h-screen bg-white">
        <div className="stiky h-screen min-w-[150px] left-0 w-40 lg:w-48 sm:pl-8 sm:pr-2 sm:pt-4 hidden sm:block">
          <img
            src={
              myProduct.items && myProduct.items[version]
                ? render(myProduct.items[version])
                : ""
            }
            alt=""
            className="w-[150px] block skeleton "
          />
        </div>

        <div className="flex-grow flex flex-col ">
          <div className="">
            <div className=" border-b-2 border-gray-color  pb-2 sm:pb-8 mb-5  ">
              {Object.keys(myProduct).length !== 0 ? (
                <div className="mx-auto 2xl:container flex justify-between  ">
                  <div className="relative flex  items-center  w-full gap-4 sm:gap-6 pl-4 sm:px-5">
                    <div
                      onClick={(e) => {
                        const storedLanguage = localStorage.getItem("language"); // Retrieve the stored language from local storage
                        if (
                          !storedLanguage ||
                          JSON.parse(storedLanguage).isoCode === "en"
                        ) {
                          handelCompareClick(
                            myProduct.items[version][t("detailsPage.product")]
                              .id,
                            myProduct.items[version]?.[
                              t("detailsPage.product")
                            ]?.[t("detailsPage.category")]
                          );
                        } else {
                          handelCompareClick(
                            myProduct.items[version][t("detailsPage.product")]
                              .english_id,
                            myProduct.category
                          );
                        }
                      }}
                      style={{ background: settings.themeColor }}
                      className={`absolute top-9 ${
                        isRTL
                          ? "left-0 rounded-bl-none rounded-tl-none pr-4 pl-2"
                          : "-right-0 rounded-br-none rounded-tr-none pl-4 pr-2"
                      } sm:top-8  cursor-pointer rounded-full      py-[10px] h-fit  flex items-center justify-center`}
                    >
                      <img
                        src="./images/Compare Button.svg"
                        alt=""
                        className="w-[25px]"
                      />
                    </div>
                    <img
                      src={
                        myProduct.items && myProduct.items[version]
                          ? render(myProduct.items[version])
                          : ""
                      }
                      alt="product image"
                      className="w-[45px] min-h-[45px] sm:hidden skeleton "
                    />
                    <div className=" flex-grow flex flex-col gap-2 sm:mt-6">
                      <div className="mb-3 flex ">
                        <div className="   mt-4 sm:mt-0 ">
                          <h2 className="font-bold text-[18px] sm:text-[32px] mb-2 text-[#242B2E] lg:max-w-none sm:max-w-[520px] max-w-[189px]">
                            {myProduct.items && myProduct.items[version]
                              ? myProduct.items[version]?.[
                                  t("detailsPage.product")
                                ]?.[t("detailsPage.model")]
                              : ""}
                          </h2>
                          <div
                            className="relative flex items-center gap-[2px] cursor-pointer w-fit"
                            onClick={() => setOpen(!open)}
                          >
                            <p className="font-normal text-xs lg:text-lg text-[#505558]  ">
                              {myProduct.items && myProduct.items[version]
                                ? myProduct.items[version]?.[
                                    t("detailsPage.product")
                                  ]?.[t("detailsPage.version")]
                                : ""}
                            </p>
                            <img
                              src="./images/arrow-down.svg"
                              alt="arrow down"
                            />
                            {open && (
                              <div
                                ref={dropDownRef}
                                className="z-30 absolute top-12 left-0  rounded-lg dropshd w-44 cursor-pointer bg-white "
                              >
                                <div className="py-2 text-sm  ">
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
                                        onChange={handleSearchChange}
                                        onClick={handleSearchClick}
                                        type="text"
                                        id="input-group-search"
                                        className="bg-white outline-none border border-gray-300 text-gray-900 text-sm rounded-3xl  block w-full pl-10 p-2.5 placeholder:text-gray-300 "
                                        placeholder={t("navigationMenu.search")}
                                      />
                                    </div>
                                  </div>
                                  <div className="overflow-auto max-h-36 ">
                                    {filteredVersion.map((elm, index) => (
                                      <p
                                        key={index}
                                        onClick={(e) => setVersion(elm.index)}
                                        className="block px-4 py-2 hover:bg-gray-100 w-full"
                                      >
                                        {elm.version}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className=" items-center justify-between gap-2 hidden sm:flex ">
                        <div className=" flex items-center  flex-wrap gap-[3px] w-[350px] sm:w-[650px] ">
                          {buttonContent.map((content, index) => (
                            <button
                              key={index}
                              onMouseEnter={(e) => handleMouseEnter(index)}
                              onMouseLeave={(e) => handleMouseLeave(index)}
                              onClick={(e) => handleClick(index, content)}
                              style={{
                                ...buttonStyle,
                                ...(isHovered &&
                                  HoverdIndex === index &&
                                  hoverStyle),
                                ...(isClicked &&
                                  ClickedIndex === index &&
                                  clickStyle),
                              }}
                            >
                              {content}
                            </button>
                          ))}
                        </div>
                        <form className=" w-1/3  mr-5 hidden md:block ">
                          <div className="relative ">
                            <div
                              className={`absolute inset-y-0  ${
                                isRTL ? " right-0 pr-3" : " left-0 pl-3"
                              }  flex items-center  pointer-events-none`}
                            >
                              <svg
                                aria-hidden="true"
                                className="w-5 h-5 text-black"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                              </svg>
                            </div>
                            <input
                              type="text"
                              id="default-search"
                              className={`block w-full p-2  ${
                                isRTL ? " pr-9" : " pl-9"
                              }   text-sm outline-none text-gray-900 border border-gray-300 hover:border-black rounded-lg`}
                              placeholder={t(
                                "detailsPage.searchBarPlaceholder"
                              )}
                              value={search}
                              onChange={(e) => handleSearch(e)}
                              onFocus={(e) => setDel(!del)}
                              onBlur={(e) => setDel(!del)}
                            />
                            <button
                              type="submit"
                              className="text-white absolute right-0 bottom-0 px-3 py-1 "
                              onClick={(e) => handleSearch(e)}
                            ></button>
                            {/* {  (search !=="") && <img src="./images/button-close 1.svg" alt="" className={` absolute ${isRTL?' left-0':' right-0' } bottom-[5px] px-3 py-1 z-10 cursor-pointer`} onClick={()=>{setSearch('')}} /> } */}

                            {!(search === "") ? (
                              <div
                                onClick={() => {
                                  setSearch("");
                                }}
                                onMouseEnter={() => setColor("#a5a5a5")}
                                onMouseLeave={() => setColor("#91A8BF")}
                                className={` absolute ${
                                  isRTL ? " left-0" : " right-0"
                                }  bottom-[5px] px-3 py-1 z-10 cursor-pointer`}
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
                                      <rect
                                        width="18"
                                        height="18"
                                        fill="white"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mx-auto container flex justify-between ">
                  <div className="flex  items-center  w-full h-28 md:h-32 gap-4 sm:gap-6  px-5">
                    <img
                      src={
                        myProduct.items && myProduct.items[version]
                          ? render(myProduct.items[version])
                          : ""
                      }
                      alt=""
                      className="w-[48px] min-h-[48px] sm:hidden skeleton "
                    />
                    <div className=" flex-grow flex flex-col gap-5 sm:mt-6">
                      <div className="mb-3">
                        <h2 className="font-bold text-[18px] sm:text-[32px] mb-1 text-[#242B2E] skeleton skeleton-title-product ">
                          {myProduct.items && myProduct.items[version]
                            ? myProduct.items[version][
                                t("detailsPage.product")
                              ]?.[t("detailsPage.model")]
                            : ""}
                        </h2>
                        <div className="relative flex items-center gap-[2px] cursor-pointer w-fit">
                          <p className="font-normal text-xs lg:text-lg text-[#505558]  skeleton skeleton-version-product">
                            {myProduct.items && myProduct.items[version]
                              ? myProduct.items[version][
                                  t("detailsPage.product")
                                ]?.[t("detailsPage.version")]
                              : ""}
                          </p>
                        </div>
                      </div>

                      <div className=" items-center justify-between gap-2 hidden sm:flex ">
                        <div className=" flex items-center  gap-2 w-[350px] sm:w-[400px] ">
                          {["", "", "", ""].map((content, index) => (
                            <button
                              key={index}
                              className="skeleton"
                              style={{ ...buttonStyle }}
                            >
                              <div className="flex justify-between items-center h-24   py-2 border-b-2 border-gray-color">
                                <div className="flex  items-center py-4  gap-2 sm:gap-6">
                                  <div className=""></div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                        <form className="w-1/3 hidden md:block ">
                          <div className="relative ">
                            <div
                              className={`absolute inset-y-0  ${
                                isRTL ? " right-0 pr-3" : " left-0 pl-3"
                              }  flex items-center  pointer-events-none`}
                            >
                              <svg
                                aria-hidden="true"
                                className="w-5 h-5 text-black"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                              </svg>
                            </div>
                            <input
                              type="text"
                              id="default-search"
                              className={`block w-full p-2  ${
                                isRTL ? " pr-9" : " pl-9"
                              }   text-sm outline-none text-gray-900 border border-gray-300 hover:border-black rounded-lg`}
                              placeholder={t(
                                "detailsPage.searchBarPlaceholder"
                              )}
                              value={search}
                              onChange={(e) => handleSearch(e)}
                              onFocus={(e) => setDel(!del)}
                              onBlur={(e) => setDel(!del)}
                            />
                            <button
                              type="submit"
                              className="text-white absolute right-0 bottom-0 px-3 py-1 "
                              onClick={(e) => handleSearch(e)}
                            ></button>
                            {/* {  (search !=="") && <img src="./images/button-close 1.svg" alt="" className={` absolute ${isRTL?' left-0':' right-0' } bottom-[5px] px-3 py-1 z-10 cursor-pointer`}  onClick={()=>{setSearch('')}} /> }     */}

                            {!(search === "") ? (
                              <div
                                onClick={() => {
                                  setSearch("");
                                }}
                                onMouseEnter={() => setColor("#a5a5a5")}
                                onMouseLeave={() => setColor("#91A8BF")}
                                className={` absolute ${
                                  isRTL ? " left-0" : " right-0"
                                }  bottom-[5px] px-3 py-1 z-10 cursor-pointer`}
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
                                      <rect
                                        width="18"
                                        height="18"
                                        fill="white"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  {compare && (
                    <img
                      src="./images/compare.svg"
                      alt="compare icon"
                      className="w-10 sm:w-12 cursor-pointer"
                      onClick={navigateToCompare}
                    />
                  )}
                </div>
              )}
            </div>

            <form
              className="w-[90%] mx-auto md:hidden"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative ">
                <div
                  className={`absolute inset-y-0  ${
                    isRTL ? " right-0 pr-3" : " left-0 pl-3"
                  }  flex items-center  pointer-events-none`}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="default-search"
                  className={`block w-full p-2  ${
                    isRTL ? " pr-9" : " pl-9"
                  }   text-sm outline-none text-gray-900 border border-gray-300 hover:border-black rounded-lg`}
                  placeholder={t("detailsPage.searchBarPlaceholder")}
                  value={search}
                  onChange={(e) => handleSearch(e)}
                  onFocus={(e) => setDel(!del)}
                  onBlur={(e) => setDel(!del)}
                />
                <button
                  type="submit"
                  className="text-white absolute right-0 bottom-0 px-3 py-1 "
                  onClick={(e) => handleSearch(e)}
                ></button>
                {search !== "" && (
                  <img
                    src="./images/button-close 1.svg"
                    alt=""
                    className={` absolute ${
                      isRTL ? " left-0" : " right-0"
                    } bottom-[5px] px-3 py-1 z-10 cursor-pointer`}
                    onClick={() => {
                      setSearch("");
                    }}
                  />
                )}{" "}
              </div>
            </form>
          </div>
          <div
            className="mx-auto container px-3 sm:px-5 overflow-y-auto flex-grow "
            ref={scrollContainerRef}
          >
            {Object.keys(myProduct).length !== 0 ? (
              myProduct.items &&
              myProduct.items[version] &&
              Object.entries(myProduct.items[version]).map(
                ([section, properties], index) => {
                  if (!(search === "")) {
                    matchesSection = section
                      .toLowerCase()
                      .includes(search.toLowerCase());
                  }
                  if (
                    section === t("detailsPage.product") ||
                    section === t("detailsPage.image") ||
                    section === t("detailsPage.date")
                  ) {
                    return "";
                  } else {
                    return (
                      <div key={index}>
                        <div
                          onClick={(e) => toggleSection(section)}
                          id={removeUnderscoreAndHyphen(section.toLowerCase())}
                          className={`flex justify-between border-b-[1px] border-gray-color px-[8px] py-5 items-center ${
                            matchesSection
                              ? `text-[${settings.themeColor}]`
                              : search !== ""
                              ? "text-gray-300"
                              : ""
                          }`}
                        >
                          <h2
                            style={{
                              color:
                                search === "" ||
                                (search !== "" && matchesSection)
                                  ? settings.themeColor
                                  : "",
                            }}
                            className="flex items-center gap-1 relative uppercase font-semibold text-[12px]"
                          >
                            {removeUnderscoreAndHyphen(section)}

                            <span
                              onMouseEnter={() =>
                                handleMouseEnterTooltip(
                                  removeUnderscoreAndHyphen(
                                    section.toLowerCase()
                                  )
                                )
                              }
                              onMouseLeave={handleMouseLeaveTooltip}
                              className="bg-slate-300 hover:bg-slate-400 rounded-full w-[15px]  h-[15px] flex items-center justify-center  cursor-pointer ml-2 "
                            >
                              <img
                                src="./images/question-mark.png"
                                className="w-[15px] h-[15px]"
                                alt=""
                              />
                            </span>

                            {tooltipContent.section ===
                              removeUnderscoreAndHyphen(
                                section.toLowerCase()
                              ) &&
                              tooltipContent.desc && (
                                <div className="absolute -top-1 left-full pl-3">
                                  <div className="relative bg-[#242B2E] text-[10px] p-2 text-white rounded-md">
                                    <p className="w-fit min-w-[70px]">
                                      {tooltipContent.desc}
                                    </p>
                                    <div className="absolute border-[7px] border-transparent border-r-[#242B2E] top-[8px] -left-3"></div>
                                  </div>
                                </div>
                              )}
                          </h2>

                          <img src="./images/arrow-down.svg" alt="" />
                        </div>
                        {!collapsedSections[section] &&
                          renderProperties(properties, section)}
                      </div>
                    );
                  }
                }
              )
            ) : (
              <div>
                <div
                  className={`flex justify-between border-b-2 border-gray-color px-2 py-5 items-center `}
                >
                  <h2 className="uppercase font-semibold text-[12px] skeleton skeleton-version-product"></h2>
                  <img src="./images/arrow-down.svg" alt="" />
                </div>

                <div
                  className={`flex justify-between items-center px-2 py-[23px] border-b-2 border-gray-color  `}
                >
                  <p
                    className={`skeleton skeleton-version  text-sm font-normal capitalize`}
                  ></p>
                  <p className=" skeleton skeleton-version  font-normal text-xs ml-auto  w-[110px] "></p>
                </div>
                <div
                  className={`flex justify-between items-center px-2 py-[23px] border-b-2 border-gray-color  `}
                >
                  <p
                    className={`skeleton skeleton-version  text-sm font-normal capitalize`}
                  ></p>
                  <p className=" skeleton skeleton-version  font-normal text-xs ml-auto  w-[110px] "></p>
                </div>

                <div
                  className={`flex justify-between border-b-2 border-gray-color px-2 py-5 items-center `}
                >
                  <h2 className="uppercase font-semibold text-[12px] skeleton skeleton-version-product"></h2>
                  <img src="./images/arrow-down.svg" alt="" />
                </div>
                <div
                  className={`flex justify-between border-b-2 border-gray-color px-2 py-5 items-center `}
                >
                  <h2 className="uppercase font-semibold text-[12px] skeleton skeleton-version-product"></h2>
                  <img src="./images/arrow-down.svg" alt="" />
                </div>
                <div
                  className={`flex justify-between border-b-2 border-gray-color px-2 py-5 items-center `}
                >
                  <h2 className="uppercase font-semibold text-[12px] skeleton skeleton-version-product"></h2>
                  <img src="./images/arrow-down.svg" alt="" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer img={settings.innerPageLogo} />
    </div>
  );
};

export default Product;
