import React, { useContext, useState, useRef, useEffect } from "react";
import Footer from "../componetns/Footer";
import { UserContext } from "./UserContext";
import LanguageDrop from "../componetns/LanguageDrop";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useSpring, animated } from "react-spring";

const Compare = () => {
  const {
    cleanParentHostname,
    productsId,
    setactive,
    setProductsId,
    setCurrentPage,
    setMyData,
    autopilotData,
    setAutopilotData,
    autopilotOn,
    setAutopilotOn,
    settings,
    navigateToHome,
    recentCompareProducts,
    setCompare,
    fetchProduct,
    properties,
    CompareProducts,
    setCompareProducts,
    render,
    displayedData,
    setDisplayedData,
  } = useContext(UserContext);
  useEffect(() => {
    window.plausible("Visit - Compare - Inline Widget", {
      host: cleanParentHostname,
    });

    setCompare(true);
  }, []);
  const [open, setOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [openRecent, setOpenRecent] = useState(false);
  const [productsObj, setProductsObj] = useState({});
  const [cProducts, setCProducts] = useState([]);
  const [error, setError] = useState(false);
  const [error1, setError1] = useState(false);
  const parentDivRef = useRef(null);
  const div1Ref = useRef(null);
  const [t, i18n] = useTranslation();
  const isRTL = i18n.language === "ar";
  const [expandedItems, setExpandedItems] = useState([]);
  const [expandedClrs, setExpandedClrs] = useState([]);
  const [autopilotTooltipOpen, setAutopiloTooltipOpen] = useState(false);
  const previousDivRef = useRef(null);
  const [autopilotWidth, setAutopilotWidth] = useState(0);
  const [autopilotSection, setAutopilotSection] = useState(true);
  const [autopilotTooltipSection, setAutopilotTooltipSection] = useState(false);
  const [autopilotError, setAutopilotError] = useState(false);
  const [tooltipContent, setTooltipContent] = useState({
    section: "",
    desc: "",
  });

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
  const toggleExpandItem = (index) => {
    setExpandedItems((prevExpandedItems) => {
      if (prevExpandedItems.includes(index)) {
        return prevExpandedItems.filter((item) => item !== index);
      } else {
        return [...prevExpandedItems, index];
      }
    });
  };

  const toggleExpandedClrs = (index) => {
    setExpandedClrs((prevExpandedCLr) => {
      if (prevExpandedCLr.includes(index)) {
        return prevExpandedCLr.filter((item) => item !== index);
      } else {
        return [...prevExpandedCLr, index];
      }
    });
  };

  const handleMouseEnterTooltip = (section) => {
    const desc = t(`tooltips.${section}`);
    setTooltipContent({ section: section, desc: desc });
  };

  const handleMouseLeaveTooltip = () => {
    setTooltipContent({ section: "", desc: "" });
  };

  useEffect(() => {
    if (Object.keys(autopilotData).length !== 0) {
      const typingDelay = 0.1; // Adjust typing speed as needed
      let currentIndex = -1;

      let intervalId;

      const typeNextCharacter = () => {
        setDisplayedData((prevData) => {
          if (autopilotData?.["Reasoning"]?.[currentIndex]) {
            return prevData + autopilotData?.["Reasoning"]?.[currentIndex];
          }
          return prevData;
        });
        currentIndex++;

        if (currentIndex === autopilotData?.["Reasoning"]?.length) {
          clearInterval(intervalId);
        }
      };

      intervalId = setInterval(typeNextCharacter, typingDelay);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [autopilotData]);

  useEffect(() => {
    if (CompareProducts.length >= 3 && autopilotOn) {
      setIsHidden(true);
    } else {
      const { current: parentDiv } = parentDivRef;
      const { current: div1 } = div1Ref;
      const handleResize = () => {
        if (CompareProducts.length < 5) {
          setIsHidden(false);
        } else {
          setIsHidden(true);
        }
      };

      handleResize();
    }
  }, [autopilotOn]);

  // Function to calculate the width of the previous div
  const calculatePreviousDivWidth = () => {
    if (previousDivRef.current) {
      const flw = window.innerWidth;
      let max;
      let previousDivWidth;

      if (flw < 425) {
        previousDivWidth =
          (previousDivRef.current.offsetWidth / CompareProducts.length) *
          CompareProducts.length;
      } else if (flw < 768) {
        previousDivWidth =
          (previousDivRef.current.offsetWidth / CompareProducts.length) *
          CompareProducts.length;
      } else {
        previousDivWidth =
          (previousDivRef.current.offsetWidth / CompareProducts.length) *
          CompareProducts.length;
      }
      // Use the width value as needed
      return previousDivWidth - 50;
    }
  };

  const handleAutopilotToggle = () => {
    if (CompareProducts.length > 1 && CompareProducts.length < 4) {
      setAutopilotOn(!autopilotOn);
      setAutopilotData({});
      setDisplayedData("");
    } else {
      setAutopilotError(true);
      setTimeout(() => {
        setAutopilotError(false);
      }, 1000);
    }

    //error message here
  };
  useEffect(() => {
    if (autopilotOn) {
      sendProductsToEndpoint();
    }
  }, [autopilotOn]);
  const sendProductsToEndpoint = () => {
    if (autopilotOn) {
      setAutopilotData({});
      setDisplayedData("");
      if (CompareProducts.length > 1 && CompareProducts.length <= 3) {
        const baseURL =
          import.meta.env.MODE === "production"
            ? import.meta.env.VITE_BASE_URL_PRODUCTION
            : import.meta.env.VITE_BASE_URL_STAGING;
        let ids = "";
        for (let i = 0; i < CompareProducts.length; i++) {
          const storedLanguage = localStorage.getItem("language");
          if (!storedLanguage || JSON.parse(storedLanguage).isoCode === "en") {
            ids += `&ids=${CompareProducts[i]?.[t("detailsPage.product")].id}`;
          } else {
            ids += `&ids=${
              CompareProducts[i]?.[t("detailsPage.product")].english_id
            }`;
          }
        }
        console.log(ids);
        const url = baseURL + "/products/compare?hostname=acme.com" + ids;

        const headers = {
          accept: "application/json",
          "content-type": "application/json",
        };
        axios
          .get(url, { headers })
          .then((response) => {
            console.log(
              "dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
            );
            console.log(response.data);
            setAutopilotData(() => response.data);
          })
          .catch((err) => console.error(err));
      } else {
        setAutopilotOn(false);
        setAutopilotData({});
        setDisplayedData("");
      }
    }
  };

  function isProductIncluded(productId, elements) {
    const storedLanguage = localStorage.getItem("language"); // Retrieve the stored language from local storage
    if (!storedLanguage || JSON.parse(storedLanguage)?.isoCode === "en") {
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
  function handelCompareClick(productId, category) {
    setOpenRecent(false);
    setOpen(false);
    console.log(CompareProducts);
    setCompare(true);

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
          let prIds = toggle(productId, productsId);
          setProductsId(prIds);
        }
      }
    } else {
      fetchProduct(productId, true);
      let prIds = toggle(productId, productsId);
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

  const updateProducts = (products, AllProperties) => {
    const addMissingProperties = (product, properties) => {
      Object.entries(properties).forEach(([key, value]) => {
        if (!product.hasOwnProperty(key)) {
          product[key] = value;
        } else if (
          typeof product[key] === "object" &&
          typeof value === "object"
        ) {
          addMissingProperties(product[key], value);
        } else if (
          typeof product[key] === "object" &&
          typeof value !== "object"
        ) {
          // Handle case where product[key] is an object but value is not
          return;
        } else if (
          typeof product[key] !== "object" &&
          typeof value === "object"
        ) {
          // Handle case where product[key] is not an object but value is
          product[key] = value;
        }
      });
    };

    const rearrangeProperties = (product, properties) => {
      let orderedProduct = {};
      Object.keys(properties).forEach((key) => {
        if (product.hasOwnProperty(key)) {
          orderedProduct[key] = product[key];
        }
      });
      return orderedProduct;
    };

    const newArr = products.map((product) => {
      addMissingProperties(product, AllProperties);
      return rearrangeProperties(product, AllProperties);
    });
    return newArr;
  };

  const concatenateValues = (array, path) => {
    const keys = path.split(".");
    let values = array.map((obj) => {
      let nestedObj = { ...obj };
      for (const key of keys) {
        nestedObj = nestedObj[key];
        if (!nestedObj) {
          break;
        }
      }
      return nestedObj || "***";
    });
    return values.join("§§");
  };

  // Recursive function to handle nested objects
  const processObject = (obj, array, path = "") => {
    let objj = { ...obj };
    for (const key in objj) {
      const currentPath = path ? `${path}.${key}` : key;
      if (typeof objj[key] === "object" && !Array.isArray(objj[key])) {
        objj[key] = processObject(objj[key], array, currentPath);
      } else {
        objj[key] = concatenateValues(array, currentPath);
      }
    }
    return objj;
  };

  useEffect(() => {
    if (CompareProducts.length > 0) {
      let update = updateProducts(CompareProducts, properties);
      setCProducts(update);
      if (properties) {
        let obbb = processObject(properties, CompareProducts);
        setProductsObj(obbb);
      }
      sendProductsToEndpoint();
      console.log(CompareProducts);
      const wdth = calculatePreviousDivWidth();
      setAutopilotWidth(wdth);
    } else {
      setProductsObj({});

      setCProducts([]);
    }

    const { current: parentDiv } = parentDivRef;
    const { current: div1 } = div1Ref;

    const handleResize = () => {
      if (CompareProducts.length < 5) {
        setIsHidden(false);
      } else {
        setIsHidden(true);
      }
    };

    handleResize(); // Check initial width
    if (CompareProducts.length >= 3 && autopilotOn) {
      setIsHidden(true);
    }
  }, [CompareProducts]);

  useEffect(() => {
    if (CompareProducts.length > 0) {
      let update = updateProducts(CompareProducts, properties);
      setCProducts(update);
      if (properties) {
        let obbb = processObject(properties, CompareProducts);
        setProductsObj(obbb);
      }
      const wdth = calculatePreviousDivWidth();
      setAutopilotWidth(wdth);
    } else {
      setProductsObj({});
      setCProducts([]);
    }
  }, [properties]);

  const slideIn = useSpring({
    from: { opacity: 0, transform: "translateY(80%)" },
    to: { opacity: 1, transform: "translateY(0%)" },
    config: { duration: 200 }, // Set the animation duration
  });

  useEffect(() => {
    const wdth = calculatePreviousDivWidth();
    setAutopilotWidth(wdth);

    const { current: parentDiv } = parentDivRef;
    const { current: div1 } = div1Ref;

    const handleResize = () => {
      if (CompareProducts.length < 5) {
        setIsHidden(false);
      } else {
        setIsHidden(true);
      }
    };
    handleResize(); // Check initial width
  }, [cProducts]);

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

  function handelclick(page) {
    if (page === "search") {
      setCompare(true);
      setMyData([]);
      setCurrentPage("search");
      localStorage.setItem("widgetCurrentPage", "search");
    } else {
      setOpenRecent(!openRecent);
    }
  }
  //
  //

  const renderProperties = (value, parentKey = "", index) => {
    return Object.entries(value).map(([key, value1], index2) => {
      const sectionKey = parentKey ? `${parentKey}.${key}` : key;

      if (typeof value1 === "object") {
        const isSectionCollapsed = collapsedSections[sectionKey];
        return (
          <div key={index2} className="">
            <div
              id={key}
              onClick={(e) => toggleSection(sectionKey)}
              className={`flex justify-between    py-4 items-center  `}
            >
              <h3 className={` font-semibold text-[11px] h-[16.5px]`}>
                {removeUnderscoreAndHyphen(key)}{" "}
              </h3>
            </div>
            {!isSectionCollapsed && renderProperties(value1, sectionKey, index)}
          </div>
        );
      } else {
        if (key === "Color" || key === "Color Options" || key === "Colors") {
          const itemsColors = value1.split("§§");
          return (
            <div
              key={index}
              className={`flex items-center  px-2 py-4 border-b-2 border-gray-color ${
                isRTL ? " pr-0 " : " pl-0"
              }  `}
            >
              <div className="flex items-center   w-full">
                <p className="text-[#91A8BF] capitalize  text-xs font-normal w-[60px] sm:w-[170px]  ">
                  {" "}
                  {removeUnderscoreAndHyphen(key)}
                </p>

                {itemsColors.map((itemcolors, index) => {
                  const colors = itemcolors.split(",");

                  const storagelanguage = JSON.parse(
                    localStorage.getItem("language")
                  )?.isoCode;
                  if (colors.length > 3) {
                    return (
                      <div
                        className={`w-[75px] mx-5 sm:w-[144px] flex justify-center`}
                      >
                        <div className="flex  items-center  flex-col  justify-center  gap-3  ">
                          {!expandedClrs.includes(index)
                            ? colors.slice(0, 2).map((color, index3) => (
                                <p
                                  key={index3}
                                  className={` w-8 font-normal text-[12px]   text-center hyphens-auto 	hpnes`}
                                  lang={storagelanguage || "en"}
                                >
                                  {" "}
                                  {removeUnderscoreAndHyphen(color)}{" "}
                                </p>
                              ))
                            : colors.map((color, index3) => (
                                <p
                                  key={index3}
                                  className={` w-8 font-normal text-[12px]   text-center hyphens-auto 	hpnes`}
                                  lang={storagelanguage || "en"}
                                >
                                  {" "}
                                  {removeUnderscoreAndHyphen(color)}{" "}
                                </p>
                              ))}

                          <button
                            onClick={() => toggleExpandedClrs(index)}
                            className="text-[#91A8BF] font-normal text-[13px] pl-2  hover:underline hover:text-[#6f7e8e]"
                          >
                            {expandedItems.includes(index)
                              ? `(${t("buttons.lessBtn")})`
                              : `(${t("buttons.moreBtn")})`}
                          </button>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div
                      className={`w-[75px] mx-5 sm:w-[144px] flex justify-center`}
                    >
                      <div className="flex  items-center  flex-col  justify-center  gap-3  ">
                        {colors.map((color, index3) => (
                          <p
                            key={index3}
                            className={` w-8 font-normal text-[12px]   text-center hyphens-auto 	hpnes`}
                            lang={storagelanguage || "en"}
                          >
                            {" "}
                            {removeUnderscoreAndHyphen(color)}{" "}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }
        const valuess = value1.split("§§");
        const storedLanguage = JSON.parse(
          localStorage.getItem("language")
        )?.isoCode;

        return (
          <div
            key={index2}
            className={`   min-h-[112px] ${
              isRTL ? " pr-0 " : " pl-0"
            }  py-4 border-b-2 border-gray-color ${
              index2 === 0 ? "border-t-2 border-gray-color" : ""
            }  `}
          >
            <div className={`flex items-center w-full`}>
              <p
                className={` ${
                  key.toLowerCase().length < 4 ? "uppercase" : "capitalize"
                }     w-[75px] sm:w-[170px]  text-[#91A8BF] text-xs font-normal flex items-center  h-[70px]  my-auto`}
              >
                {removeUnderscoreAndHyphen(key)}
              </p>
              {valuess.map((valuee, index) => {
                if (valuee.length > 85) {
                  const keyIndex = "" + index2 + index;
                  return (
                    <div
                      className={`w-[92px] sm:w-36 flex items-center justify-center    mx-5`}
                    >
                      <p
                        id={key}
                        className={`w-[80px] sm:w-36 font-normal   overflow-y-auto pr-1 text-center py-2  text-xs hyphens-auto break-words	hpnes`}
                        lang={storedLanguage || "en"}
                      >
                        {!expandedItems.includes(Number(keyIndex))
                          ? removeUnderscoreAndHyphen(valuee).slice(0, 80)
                          : removeUnderscoreAndHyphen(valuee) + "  "}

                        <button
                          onClick={() => toggleExpandItem(Number(keyIndex))}
                          className="text-[#91A8BF] font-normal text-[13px] pl-2  hover:underline hover:text-[#6f7e8e]"
                        >
                          {expandedItems.includes(Number(keyIndex))
                            ? `(${t("buttons.lessBtn")})`
                            : `(${t("buttons.moreBtn")})`}
                        </button>
                      </p>
                    </div>
                  );
                }
                return (
                  <div
                    className={`w-[92px] sm:w-36 flex items-center justify-center   mx-5`}
                  >
                    <p
                      id={key}
                      className={`w-[80px] sm:w-36 font-normal   overflow-y-auto pr-1 text-center py-2  text-xs hyphens-auto break-words	hpnes`}
                      lang={storedLanguage || "en"}
                    >
                      {removeUnderscoreAndHyphen(valuee)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
    });
  };

  //
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
      className={`w-full h-screen bg-white overflow-x-hidden ${
        isRTL ? "rtl" : "ltr"
      }`}
      ref={parentDivRef}
    >
      <div className="fixed top-0 z-[5003] w-full bg-white">
        <div className={`border-b-2  border-gray-color  gap-2 py-4  px-3`}>
          <div
            className={`container mx-auto flex items-center justify-between  `}
          >
            <div className=" sm:ml-7 flex items-center justify-start">
              <button
                onClick={(e) => {
                  navigateToHome();
                  setCompare(false);
                  setactive("home");
                }}
              >
                {" "}
                <img
                  src="./images/arrow-left 1.svg"
                  alt="arrow go back"
                  className={`${isRTL ? "rotate-180" : ""}`}
                />
              </button>
              {logo != "" && (
                <img src={logo} alt="logo" className={`max-h-[25px]   ml-3 `} />
              )}
            </div>

            <LanguageDrop />
          </div>
        </div>
        {
          <div className="mt-3  container ml-auto mr-auto  ">
            <div className="mr-auto ml-1 relative  w-fit flex items-center gap-2">
              <button
                type="button"
                role="switch"
                aria-checked="false"
                data-state={autopilotOn}
                value="on"
                className="w-[57px] h-7 px-1 rounded-full duration-150 relative bg-gray-200"
                onClick={handleAutopilotToggle}
                style={{
                  cursor:
                    CompareProducts.length > 1 && CompareProducts.length <= 3
                      ? "pointer"
                      : "not-allowed",
                  background: autopilotOn && settings.themeColor,
                }}
              >
                <span
                  className={`duration-300  transition-all  rounded-full absolute h-6 w-6 top-[56%] ${
                    !autopilotOn
                      ? isRTL
                        ? "translate-x-[1px]"
                        : "translate-x-[26px]"
                      : isRTL
                      ? "-translate-x-[26px]"
                      : "translate-x-[1px]"
                  } -translate-y-1/2 text-white text-[14px] flex justify-center items-center  `}
                >
                  AI
                </span>
                <span
                  className={`w-[23px] h-[23px] flex  duration-300  transition-all justify-center items-center rounded-full bg-white shadow-inner  absolute top-1/2 ${
                    !autopilotOn ? "-translate-x-[1px]" : "translate-x-[26px]"
                  } -translate-y-1/2 left-1`}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 27 11"
                    fill="black"
                    xmlns="http://www.w3.org/2000/svg"
                    className="brightness-50 pt-[1px]"
                  >
                    <path
                      d="M0 7.83051V0H4.18222V7.83051H6.21183V9.32203H8.36444V7.83051H10.394V0H12.4852V7.83051H10.394V9.32203H8.36444V10.9379H4.18222V9.32203H2.02961V7.83051H0Z"
                      fill="black"
                    />
                    <path
                      d="M16.7288 0H26.9998V1.49153H18.7584V4.59887H24.9702V6.15254H26.9998V9.32203H24.9702V11H14.5762V9.32203H24.9702V6.15254H16.7288V4.59887H14.5762V1.49153H16.7288V0Z"
                      fill="black"
                    />
                  </svg>
                </span>
              </button>

              {autopilotTooltipOpen && (
                <div
                  className={`absolute w-fit   z-[80004] ${
                    isRTL
                      ? "-right-[73px] sm:-right-[103px] top-9"
                      : " -top-1 left-20 pl-4"
                  }  `}
                >
                  <div className="relative bg-[#242b2ee7] text-[10px] p-2 text-white rounded-md">
                    <p className="w-[140px] sm:w-[170px]">
                      {t("tooltips.autopilotButton")}
                    </p>
                    <div
                      className={`absolute border-[7px] border-transparent ${
                        isRTL
                          ? "border-b-[#242b2ee7] -top-[12.5px] left-[5.6px] "
                          : "border-r-[#242b2ee7] top-[11px] -left-[12.4px] "
                      }`}
                    ></div>
                  </div>
                </div>
              )}

              <span
                onMouseEnter={() => {
                  setAutopiloTooltipOpen(true);
                }}
                onMouseLeave={() => {
                  setAutopiloTooltipOpen(false);
                }}
                className="bg-slate-300 hover:bg-slate-400 rounded-full w-[15px]  h-[15px] flex items-center justify-center  cursor-pointer  "
              >
                <img
                  src="./images/question-mark.png"
                  className="w-[15px] h-[15px]"
                  alt=""
                />
              </span>
            </div>
          </div>
        }
      </div>

      {error && (
        <div className="fixed z-[999999999] top-[32%] left-1/2  text-sm sm:text-base text-center -translate-x-1/2 bg-red-200 px-4 py-1 rounded-md mb-3 w-fit mx-auto">
          {t("detailsPage.interCategoryErrorMessage")}
        </div>
      )}
      {error1 && (
        <div className="fixed z-[999999999] top-[32%] left-1/2 text-sm sm:text-base text-center -translate-x-1/2 bg-red-200 px-4 py-1 rounded-md mb-3 w-fit mx-auto">
          {t("detailsPage.duplicateProductErrorMessage")}
        </div>
      )}
      {autopilotError && (
        <div className="fixed z-[999999999] top-[32%] left-1/2 text-sm sm:text-base text-center  -translate-x-1/2 bg-red-200 px-4 py-1 rounded-md mb-3 w-fit mx-auto">
          {t("detailsPage.autopilotErrorMessage")}
        </div>
      )}

      <div
        className={`flex w-full ${
          autopilotOn
            ? "  overflow-y-hidden"
            : "h-full pb-10 overflow-y-auto"
        }  overflow-x-auto   `}
      >
        {/* <div className=" z-[99] bg-black">
          ssssss
          7Zz
          7Zz
          7Zz
          7Zz
          7Zz
          7Zzz
          7Zzz
          zzzz
          zzzzz
          zzzz
          zaa

          zzzz
          ss
          ss
          HJHKJJ
          <br />
          mkjhgfdfghjkl GGGGGG
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          ggh
        </div> */}

        <div
          ref={div1Ref}
          className={`flex mt-[100px] ${
            autopilotOn
              ? " overflow-y-hidden"
              : "mb-[38px] overflow-y-auto"
          }  w-full`}
        >
          <div className="">
            {cProducts.length !== 0 && (
              <div
                ref={previousDivRef}
                className={`px-5 flex  items-center h-[190px] sm:h-fit `}
              >
                {!autopilotOn && cProducts.length !== 0 && (
                  <div className="w-[75px] sm:w-[170px] h-16 my-auto"></div>
                )}
                {cProducts.length !== 0 &&
                  cProducts.map((item, index) => {
                    return (
                      <div
                        key={index}
                        style={{ borderColor: settings.themeColor }}
                        className={`w-[145px] ${autopilotOn ?"ml-6":""}  -ml-3 mt-2  ${
                          autopilotOn &&
                          autopilotData &&
                          autopilotData?.["Model"] ===
                            item?.[t("detailsPage.product")]?.[
                              t("detailsPage.model")
                            ]
                            ? "border-[3.7px] border-gray"
                            : ""
                        }  sm:mx-5  px-1   pt-0 mb-5 sm:w-36  flex flex-col gap-3 items-center justify-start   h-[170px]   `}
                      >
                        <div
                          className={` ${
                            isRTL
                              ? "mr-auto justify-start"
                              : " ml-auto justify-end"
                          } mb-1 flex  items-start`}
                        >
                          {autopilotOn &&
                            autopilotData &&
                            autopilotData?.["Model"] ===
                              item?.[t("detailsPage.product")]?.[
                                t("detailsPage.model")
                              ] && (
                              <p
                                style={{ background: settings.themeColor }}
                                className={`text-[8px] w-[95px]   p-1 text-center  text-white bg-gray-200 rounded-b-md ${
                                  isRTL ? "mr-2" : "mr-2"
                                } uppercase`}
                              >
                                Recommended
                              </p>
                            )}
                          <svg
                            onClick={(e) => {
                              const newArray = cProducts.filter(
                                (itemm, index1) => index1 !== index
                              );
                              if (newArray.length === 0) {
                                setCompareProducts([]);
                              } else {
                                setCompareProducts(newArray);
                              }
                              const wdth = calculatePreviousDivWidth();

                              const storedLanguage =
                                localStorage.getItem("language"); // Retrieve the stored language from local storage
                              let prIds;
                              if (
                                !storedLanguage ||
                                JSON.parse(storedLanguage)?.isoCode === "en"
                              ) {
                                prIds = toggle(
                                  item?.[t("detailsPage.product")]?.id,
                                  productsId
                                );
                              } else {
                                prIds = toggle(
                                  item?.[t("detailsPage.product")]?.english_id,
                                  productsId
                                );
                              }
                              setProductsId(prIds);
                              setAutopilotWidth(wdth);
                            }}
                            className={` cursor-pointer   mt-1 ${
                              isRTL ? " mr-2" : ""
                            }`}
                            width="15px"
                            height="15px"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7Z"
                              fill="#C4D1DD"
                            />
                            <path
                              d="M4 7H10"
                              stroke="white"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            />
                          </svg>
                        </div>
                        <img
                          src={
                            Object.keys(item).length !== 0 ? render(item) : ""
                          }
                          alt=""
                          className="h-16"
                        />
                        <div className="flex flex-col  items-center text-center  w-full">
                          <p className="font-bold text-xs ">
                            {item &&
                              item?.[t("detailsPage.product")] &&
                              item?.[t("detailsPage.product")]?.[
                                t("detailsPage.brand")
                              ]}
                          </p>
                          <p className="font-normal text-xs  w-24 sm:w-36">
                            {item &&
                              item?.[t("detailsPage.product")] &&
                              item?.[t("detailsPage.product")]?.[
                                t("detailsPage.model")
                              ]
                                .split(" ")
                                .slice(1)
                                .join(" ")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* {autopilotOn && (
              <>
                <div className="">
                  <div className={`border-t-2 border-gray-color`}>
                    <div
                      onClick={() => setAutopilotSection(!autopilotSection)}
                      id={"autopilot"}
                      className={` flex  h-fit sm:gap-1 items-center justify-start pb-4 pt-3 relative   `}
                    >
                      <h2 className="  capitalize flex gap-1 items-center justify-start font-bold text-base sm:text-lg h-14 px-2 mr-2  ">
                        {t("comparisonPage.autopilotHeading")}
                      </h2>
                      {autopilotTooltipSection && (
                        <div
                          className={`absolute   ${
                            isRTL
                              ? "right-52 top-6 "
                              : "top-3 pl-7 left-44 sm:left-[200px]"
                          }`}
                        >
                          <div className="relative bg-[#242b2ee7] text-[10px] p-2 text-white rounded-md">
                            <p className="w-[140px] sm:w-[170px]">
                              {t("tooltips.autopilot")}
                            </p>
                            <div
                              className={`absolute border-[7px] border-transparent  ${
                                isRTL
                                  ? "border-l-[#242b2ee7] top-[9px] -right-[12.5px] "
                                  : "border-r-[#242b2ee7] top-[22px] -left-[12.5px]"
                              }`}
                            ></div>
                          </div>
                        </div>
                      )}

                      <span
                        onMouseEnter={() => {
                          setAutopilotTooltipSection(true);
                        }}
                        onMouseLeave={() => {
                          setAutopilotTooltipSection(false);
                        }}
                        className="bg-slate-300 hover:bg-slate-400  rounded-full w-[15px]   h-[15px] flex items-center justify-center  cursor-pointer ml-[-10px]  "
                      >
                        <img
                          src="./images/question-mark.png"
                          className="w-[15px] h-[15px]"
                          alt=""
                        />
                      </span>
                    </div>
                  </div>

                 
                </div>
              </>
            )} */}
            {!autopilotOn &&
              Object.entries(productsObj).length !== 0 &&
              Object.entries(productsObj).map(([section, value], index) => {
                if (
                  section === t("detailsPage.product") ||
                  section === t("detailsPage.image") ||
                  section === t("detailsPage.date") ||
                  section === "_id"
                ) {
                  return "";
                } else {
                  return (
                    <div
                      key={index}
                      className={` ${isRTL ? " pr-5" : " pl-5"} ${
                        section === "key_aspects"
                          ? "border-t-2 border-gray-color"
                          : ""
                      }`}
                    >
                      <div
                        onClick={(e) => toggleSection(section)}
                        id={section}
                        className={`w-fit relative flex items-center  gap-1  `}
                      >
                        <h2
                          style={{ color: settings.themeColor }}
                          className={` w-fit uppercase  flex items-center font-semibold text-[12px] pb-[24px] pt-[20px]  ${
                            isRTL ? " pr-0" : " pl-0 sm:mr-0 mr-1"
                          }   `}
                        >
                          {removeUnderscoreAndHyphen(section)}
                        </h2>
                        <div
                          onMouseEnter={() =>
                            handleMouseEnterTooltip(
                              removeUnderscoreAndHyphen(section.toLowerCase())
                            )
                          }
                          onMouseLeave={handleMouseLeaveTooltip}
                          className={` bg-slate-300 hover:bg-slate-400 rounded-full w-[15px]  h-[15px] flex items-center justify-center  cursor-pointer mb-[3px] ${
                            isRTL ? " mr-1" : " ml-1"
                          } `}
                        >
                          <img
                            src="./images/question-mark.png"
                            className="w-[15px] h-[15px]"
                            alt=""
                          />

                          {tooltipContent.section ===
                            removeUnderscoreAndHyphen(section.toLowerCase()) &&
                            tooltipContent.desc && (
                              <div
                                className={`absolute   ${
                                  isRTL
                                    ? " top-[15px] right-[115%]"
                                    : " top-[15px] left-full"
                                }   ml-2 z-[80004]`}
                              >
                                <div className="relative bg-[#242b2ee7] text-[10px] p-2 text-white rounded-md">
                                  <p className=" max-w-[150px] whitespace-wrap ">
                                    {tooltipContent.desc}
                                  </p>
                                  <div
                                    className={`absolute border-[7px] border-transparent      ${
                                      isRTL
                                        ? " top-[8px] -right-3 border-l-[#242b2ee7]"
                                        : "border-r-[#242b2ee7]  top-[8px] -left-3"
                                    } `}
                                  ></div>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                      {!collapsedSections[section] &&
                        renderProperties(value, section, index)}
                    </div>
                  );
                }
              })}
          </div>
          <div
            className={`flex justify-center items-center top-1/2 w-fit h-fit sticky ${
              autopilotOn ? "ml-3" : "mx-auto"
            } -translate-y-1/2 min-w-[150px]  z-[5002] ${
              isHidden ? "hidden" : ""
            }`}
          >
            <animated.div
              style={slideIn}
              className="relative flex flex-col items-center gap- 2 z-[5002] "
            >
              <button
                className={`cursor-pointer  `}
                onClick={(e) => {
                  setOpen(!open);
                  setOpenRecent(false);
                }}
              >
                <div
                  style={{
                    background: open ? "#242b2ee7" : settings.themeColor,
                  }}
                  className={`transition rounded-full w-12 h-12 flex flex-col items-center justify-center`}
                >
                  <img
                    className={` transition-transform ${
                      open ? " rotate-45" : ""
                    } `}
                    src="./images/Plus.svg"
                    alt=""
                  />
                </div>
              </button>
              <p className="text-[#91A8BF] text-center text-xs font-normal sm:min-h-[24px] min-h-[40px]">
                {!open && !openRecent ? t("comparisonPage.description") : ""}
              </p>
              {open && !openRecent && (
                <div className=" z-[500009999] absolute bg-white -bottom-[50%]  sm:-bottom-[88%] w-[130px] sm:w-[180px] shdw rounded-[10px]">
                  <div className="relative flex items-center justify-center ">
                    <div className=" absolute border-[10px] border-transparent border-b-white -top-[19px] left-1/2 -translate-x-1/2">
                      {" "}
                    </div>
                    <div
                      onClick={(e) => handelclick("search")}
                      className=" basis-1/2 flex flex-col items-center gap-[6px] pl-1 pr-3 sm:pl-6 sm:pr-[15px] py-3 sm:py-4 cursor-pointer"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_35_17451)">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M23.2296 20.5679L17.3085 14.6119C18.5611 12.7786 19.0872 10.5407 18.7835 8.33745C18.4798 6.13415 17.3682 4.12457 15.667 2.70307C13.9658 1.28156 11.7977 0.550787 9.58824 0.654176C7.37881 0.757565 5.28757 1.68765 3.72494 3.26188C2.16231 4.83612 1.24113 6.94083 1.14218 9.16297C1.04324 11.3851 1.77367 13.5642 3.19013 15.2726C4.60659 16.981 6.6068 18.0953 8.7982 18.3969C10.9896 18.6984 13.214 18.1655 15.0347 16.9026L20.9545 22.8586C21.2566 23.162 21.6661 23.3323 22.093 23.3321C22.5199 23.3318 22.9293 23.161 23.231 22.8573C23.5327 22.5535 23.702 22.1417 23.7018 21.7123C23.7015 21.283 23.5317 20.8713 23.2296 20.5679ZM4.3831 9.57459C4.38257 8.64279 4.61054 7.72524 5.04682 6.9032C5.48309 6.08116 6.1142 5.37999 6.88426 4.8618C7.65432 4.34361 8.53957 4.02438 9.4616 3.93239C10.3836 3.84041 11.314 3.97851 12.1702 4.33445C13.0265 4.69039 13.7823 5.25318 14.3707 5.973C14.9591 6.69283 15.3618 7.54746 15.5434 8.4612C15.7249 9.37495 15.6796 10.3196 15.4114 11.2115C15.1432 12.1034 14.6605 12.9151 14.0059 13.5746C13.2183 14.3671 12.2147 14.9068 11.122 15.1255C10.0293 15.3441 8.89664 15.2319 7.8674 14.8029C6.83816 14.374 5.95858 13.6476 5.34 12.7157C4.72141 11.7838 4.39164 10.6884 4.39238 9.56791L4.3831 9.57459Z"
                            fill={settings.themeColor}
                            stroke="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_35_17451">
                            <rect
                              width="24"
                              height="24"
                              fill="white"
                              transform="translate(0.5)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      <p className="font-semibold text-[9px] sm:text-[11px]  text-center ">
                        {t("navigationMenu.search")}
                      </p>
                    </div>
                    <div className="bg-gray-color w-[2px] h-10"></div>
                    <div
                      onClick={(e) => handelclick("recent")}
                      className="  basis-1/2 flex flex-col items-center relative gap-[6px] pl-3 pr-1  sm:pr-6 sm:pl-[15px] py-3 sm:py-4 cursor-pointer"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.9401 2C9.37644 2.00731 6.91355 2.99891 5.06006 4.77V3C5.06006 2.73478 4.9547 2.48043 4.76717 2.29289C4.57963 2.10536 4.32528 2 4.06006 2C3.79484 2 3.54049 2.10536 3.35295 2.29289C3.16542 2.48043 3.06006 2.73478 3.06006 3V7.5C3.06006 7.76522 3.16542 8.01957 3.35295 8.20711C3.54049 8.39464 3.79484 8.5 4.06006 8.5H8.56006C8.82528 8.5 9.07963 8.39464 9.26717 8.20711C9.4547 8.01957 9.56006 7.76522 9.56006 7.5C9.56006 7.23478 9.4547 6.98043 9.26717 6.79289C9.07963 6.60536 8.82528 6.5 8.56006 6.5H6.16006C7.07177 5.53701 8.20856 4.81576 9.46819 4.40114C10.7278 3.98651 12.0707 3.89152 13.3762 4.1247C14.6816 4.35788 15.9086 4.91193 16.9468 5.73699C17.985 6.56205 18.8018 7.63226 19.3238 8.85133C19.8457 10.0704 20.0564 11.4001 19.9369 12.7208C19.8175 14.0415 19.3716 15.3118 18.6393 16.4174C17.9071 17.5231 16.9115 18.4293 15.7421 19.0547C14.5727 19.68 13.2662 20.0049 11.9401 20C11.6748 20 11.4205 20.1054 11.233 20.2929C11.0454 20.4804 10.9401 20.7348 10.9401 21C10.9401 21.2652 11.0454 21.5196 11.233 21.7071C11.4205 21.8946 11.6748 22 11.9401 22C14.5922 22 17.1358 20.9464 19.0111 19.0711C20.8865 17.1957 21.9401 14.6522 21.9401 12C21.9401 9.34784 20.8865 6.8043 19.0111 4.92893C17.1358 3.05357 14.5922 2 11.9401 2ZM11.9401 8C11.6748 8 11.4205 8.10536 11.233 8.29289C11.0454 8.48043 10.9401 8.73478 10.9401 9V12C10.9401 12.2652 11.0454 12.5196 11.233 12.7071C11.4205 12.8946 11.6748 13 11.9401 13H13.9401C14.2053 13 14.4596 12.8946 14.6472 12.7071C14.8347 12.5196 14.9401 12.2652 14.9401 12C14.9401 11.7348 14.8347 11.4804 14.6472 11.2929C14.4596 11.1054 14.2053 11 13.9401 11H12.9401V9C12.9401 8.73478 12.8347 8.48043 12.6472 8.29289C12.4596 8.10536 12.2053 8 11.9401 8Z"
                          fill={settings.themeColor}
                        />
                      </svg>

                      <p className="font-semibold text-[9px] sm:text-[11px] text-center ">
                        {t("comparisonPage.recent")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {openRecent && (
                <div className="absolute sm:top-[70%] z-[99999999]  top-[40%]   scale-75 sm:scale-100 -left-16    bg-white w-52  shd rounded-2xl">
                  <div className="flex justify-start border-b-2 border-gray-color bg-white w-full p-2 rounded-t-2xl">
                    <img
                      src="./images/arrow-left 1.svg"
                      alt="arrow"
                      className={`${isRTL ? "rotate-180" : ""} cursor-pointer `}
                      onClick={() => setOpenRecent(false)}
                    />
                    <p className="text-sm ml-1">
                      <span className="font-bold text-base">
                        {recentCompareProducts.length + " "}
                      </span>
                      {[t("comparisonPage.recentDropdownText")]}
                    </p>
                  </div>

                  <div className="bg-white overflow-y-auto   max-h-44 rounded-b-2xl ">
                    {recentCompareProducts.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-evenly hover:bg-gray-color rounded-sm items-center"
                      >
                        <div className=" px-1 py-2">
                          <p className="text-sm w-[150px]">{item.model}</p>
                        </div>
                        <div
                          onClick={() =>
                            handelCompareClick(item.id, item.category)
                          }
                          style={{ background: settings.themeColor }}
                          className=" w-[23px] h-[23px] rounded-full cursor-pointer flex items-center justify-center  "
                        >
                          <img
                            src="./images/Plus.svg"
                            alt=""
                            className="w-[17px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </animated.div>
          </div>
        </div>

        {(open || openRecent) && (
          <div
            className="overlay w-full h-full fixed top-0 right-0  z-[5000]"
            onClick={() => {
              setOpen(false);
              setOpenRecent(false);
            }}
          ></div>
        )}
      </div>
      <div className="">
        {autopilotOn && (
          <div className="">
            <div className={`border-t-2 border-gray-color`}>
              <div
                id={"autopilot"}
                className={` flex  h-fit sm:gap-1 items-center justify-start pb-4 pt-3 relative   `}
              >
                <h2 className="capitalize flex gap-1 items-center justify-start font-bold text-base sm:text-lg h-14 px-2   ">
                  {t("comparisonPage.autopilotHeading")}
                </h2>
                {autopilotTooltipSection && (
                  <div
                    className={`absolute   ${
                      isRTL
                        ? "right-52 top-6 "
                        : "top-3 pl-7 left-[189px] sm:left-[200px]"
                    }`}
                  >
                    <div className="relative bg-[#242b2ee7] text-[10px] p-2 text-white rounded-md">
                      <p className="w-[140px] sm:w-[170px]">
                        {t("tooltips.autopilot")}
                      </p>
                      <div
                        className={`absolute border-[7px] border-transparent  ${
                          isRTL
                            ? "border-l-[#242b2ee7] top-[9px] -right-[12.5px] "
                            : "border-r-[#242b2ee7] top-[22px] -left-[12.5px]"
                        }`}
                      ></div>
                    </div>
                  </div>
                )}

                <span
                  onMouseEnter={() => {
                    setAutopilotTooltipSection(true);
                  }}
                  onMouseLeave={() => {
                    setAutopilotTooltipSection(false);
                  }}
                  className="bg-slate-300 hover:bg-slate-400  rounded-full w-[15px]   h-[15px] flex items-center justify-center  cursor-pointer   "
                >
                  <img
                    src="./images/question-mark.png"
                    className="w-[15px] h-[15px]"
                    alt=""
                  />
                </span>
              </div>
            </div>
          </div>
        )}

        {autopilotSection && autopilotOn && (
          <div dir="ltr" className="sm:ml-auto ml-2 h-fit sm:mr-10 w-full">
            {Object.keys(autopilotData).length !== 0 ? (
              <div
                dir="ltr"
                className="pl-2 relative text-xs sm:text-sm mb-28 inline-block "
              >
                <div className="flex items-center">
                  <p className="inline-block">
                    {displayedData}
                    <span
                      style={{ background: settings.themeColor }}
                      className="inline w-[18px] h-[18px] p-[2px] rounded-full ml-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="7"
                        height="7"
                        viewBox="0 0 27 11"
                        fill="white"
                        className="inline m-auto w-[15px] h-[15px]"
                      >
                        <path
                          d="M0 7.83051V0H4.18222V7.83051H6.21183V9.32203H8.36444V7.83051H10.394V0H12.4852V7.83051H10.394V9.32203H8.36444V10.9379H4.18222V9.32203H2.02961V7.83051H0Z"
                          fill="white"
                        />
                        <path
                          d="M16.7288 0H26.9998V1.49153H18.7584V4.59887H24.9702V6.15254H26.9998V9.32203H24.9702V11H14.5762V9.32203H24.9702V6.15254H16.7288V4.59887H14.5762V1.49153H16.7288V0Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="transition-all min-h-[100px] pl-2 mb-5">
                <p className="skeleton skeleton-parag mb-2 w-[99%]"></p>
                <p className="skeleton skeleton-parag mb-2 w-[99%]"></p>
                <p className="skeleton skeleton-parag mb-2 w-[99%]"></p>
                <p className="skeleton skeleton-parag mb-2 w-[99%]"></p>
                <p className="skeleton skeleton-parag mb-2 w-[79%]"></p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full z-20 border-t-gray-color border-[1px]">
        <Footer img={settings.innerPageLogo} />
      </div>
    </div>
  );
};

export default Compare;
