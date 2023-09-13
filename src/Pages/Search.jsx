import React, { Suspense, useContext, useEffect, useState } from "react";
import SearchBar from "../componetns/SearchBar";
import NavBar from "../componetns/NavBar";
import Footer from "../componetns/Footer";
import BrandFilter from "../componetns/BrandFilter";
import { UserContext } from "./UserContext";
import FilterDrop from "../componetns/FilterDrop";
import { useSpring, animated } from "react-spring";
import axios from "axios";
import { useTranslation } from "react-i18next";
import PropertyList from "../componetns/PropertyList";
import FiltersTags from "../componetns/FiltersTags";

const Search = () => {
  const [t, i18n] = useTranslation();

  const {
    navigateToSearchFilters,
    setAllBrand,
    cleanParentHostname,
    apliedFilters,
    productsId,
    filtersPage,
    filters,
    setProductsId,
    CancelSearchFilters,
    SeeSearchFilters,
    skl,
    settings,
    CompareProducts,
    fetchProduct,
    navigateToProduct,
    navigateToCompare,
    category,
    setCategory,
    myData,
    compare,
    totalResult,
    Resulterror,
  } = useContext(UserContext);

  useEffect(() => {
    window.plausible("Visit - Search - Inline Widget", {
      host: cleanParentHostname,
    });

    const baseURL =
      import.meta.env.MODE === "production"
        ? import.meta.env.VITE_BASE_URL_PRODUCTION
        : import.meta.env.VITE_BASE_URL_STAGING;
    const url = baseURL + `/brands?hostname=acme.com`;

    const headers = {
      accept: "application/json",
      "content-type": "application/json",
    };

    axios
      .get(url, { headers })
      .then((response) => {
        setAllBrand(response.data.data.items);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (filtersPage) {
      window.plausible("Visit - Filters - Inline Widget", {
        host: cleanParentHostname,
      });
    }
  }, [filtersPage]);
  const [Error, setError] = useState(false);
  const [error1, setError1] = useState(false);
  const [filterTooltip, setFilterTooltip] = useState(false);
  const isRTL = i18n.language === "ar";

  function render(item) {
    const productCategory = item.product.category;
    let imageSrc = "";
    let frontImageExists = "";
    let backImageExists = "";
    if (item.thumbnail) {
      if (item.thumbnail.image_1 && item.thumbnail.image_1 !== null)
        frontImageExists = item.thumbnail.image_1; // Set to true if the front image exists
      if (item.thumbnail.image_2 && item.thumbnail.image_2 !== null)
        backImageExists = item.thumbnail.image_2; // Set to true if the back image exists
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
          console.log("fetch product deatails");
          navigateToCompare();
          let prIds = toggle(productId, productsId);
          setProductsId(prIds);
        }
      }
    } else {
      fetchProduct(productId, true);
      let prIds = toggle(productId, productsId);
      setProductsId(prIds);
      navigateToCompare();
    }
  }

  let catgs = [];
  if (settings.deviceTypes.includes("All")) {
    catgs = [
      "Smartphones",
      "Tablets",
      "Smartwatches",
      "Laptops",
      "Desktops",
      "Displays",
      "GPUs",
    ];
  } else {
    catgs = settings.deviceTypes;
  }
  const slideIn = useSpring({
    from: { opacity: 0, transform: "translateY(30%)" },
    to: { opacity: 1, transform: "translateY(0%)" },
    config: { duration: 200 }, // Set the animation duration
  });
  const slideIn1 = useSpring({
    from: { opacity: 0, transform: "translateY(80%)" },
    to: { opacity: 1, transform: "translateY(0%)" },
    config: { duration: 200 }, // Set the animation duration
  });
  const slideIn2 = useSpring({
    opacity: !filtersPage ? 0 : 1,
    transform: !filtersPage ? "translateY(10%)" : "translateY(0%)", // Corrected this line
    config: { duration: 200 }, // Set the animation duration
  });

  return (
    <animated.div className={`h-[90vh] p-3 pb-0  ${isRTL ? "rtl" : "ltr"} `}>
      {!filtersPage && (
        <>
          <div className="sticky top-0 bg-white z-50">
            <NavBar home={true} lang={false} search={true}/>
            <div
              style={slideIn}
              className="container  p-3 z-10"
            >
              
              {Error && (
                <div className="fixed z-[999999999] top-1/2 left-1/2 -translate-x-1/2 bg-red-200 px-7 py-1 rounded-md mb-3 w-fit mx-auto">
                  {t("detailsPage.interCategoryErrorMessage")}
                </div>
              )}
              {error1 && (
                <div className="fixed z-[999999999] top-[32%] left-1/2 -translate-x-1/2 bg-red-200 px-7 py-1 rounded-md mb-3 w-fit mx-auto">
                  {t("detailsPage.duplicateProductErrorMessage")}{" "}
                </div>
              )}

              <div className="border-b-2 sm:border-b-0 border-gray-color w-full ">
                {Object.keys(apliedFilters).length === 0 && (
                  <div
                    className={` py-3 mb-[2px] flex gap-3 items-center justify-start  mx-auto `}
                  >

                    <FilterDrop
                      title={"category"}
                      arr={catgs}
                      stt={category}
                      setstt={setCategory}
                    />

                    <BrandFilter />

                    <div className="relative">
                      <div
                        onMouseEnter={() => setFilterTooltip(true)}
                        onMouseLeave={() => setFilterTooltip(false)}
                        className={`bg-gray-color  px-2 py-[6px] sm:py-2 rounded-md  flex items-center justify-center gap-[2px] w-fit
        `}
                        onClick={()=>{setFilterTooltip(false) ; navigateToSearchFilters()}}
                      >
                        <p className="uppercase leading-[18px]	 text-[10px] sm:text-[12px] font-semibold cursor-pointer">
                          {t("searchPage.FilterTooltip")}
                        </p>

                        {filterTooltip && (
                          <div
                            className={`z-10 absolute top-10 ${
                              isRTL ? " right-2 " : " left-1"
                            } bg-white rounded-lg shadow  cursor-pointer  w-fit`}
                          >
                            {
                              <div className=" bg-[#242B2E] text-xs p-2  w-fit text-white rounded-md">
                                <p className="min-w-max">
                                  {t("searchPage.FilterTooltip")}
                                </p>
                                <div
                                  className={`absolute border-[7px] border-transparent border-b-[#242B2E] ${
                                    isRTL ? "right-2" : " left-3"
                                  } -top-[13px] `}
                                ></div>
                              </div>
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {Object.keys(apliedFilters).length !== 0 && (
                  <div className={` py-3 mb-[2px]  gap-3  w-[97%] mx-auto `}>
                    <FiltersTags />
                  </div>
                )}
              </div>
            </div>
          </div>
          {!skl && myData.length === 0 && (
            <div className=" top-9 w-[97%]  fixed    flex items-center justify-center">
              <animated.div style={slideIn1}>
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 25 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_35_17451)">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M23.2296 20.5679L17.3085 14.6119C18.5611 12.7786 19.0872 10.5407 18.7835 8.33745C18.4798 6.13415 17.3682 4.12457 15.667 2.70307C13.9658 1.28156 11.7977 0.550787 9.58824 0.654176C7.37881 0.757565 5.28757 1.68765 3.72494 3.26188C2.16231 4.83612 1.24113 6.94083 1.14218 9.16297C1.04324 11.3851 1.77367 13.5642 3.19013 15.2726C4.60659 16.981 6.6068 18.0953 8.7982 18.3969C10.9896 18.6984 13.214 18.1655 15.0347 16.9026L20.9545 22.8586C21.2566 23.162 21.6661 23.3323 22.093 23.3321C22.5199 23.3318 22.9293 23.161 23.231 22.8573C23.5327 22.5535 23.702 22.1417 23.7018 21.7123C23.7015 21.283 23.5317 20.8713 23.2296 20.5679ZM4.3831 9.57459C4.38257 8.64279 4.61054 7.72524 5.04682 6.9032C5.48309 6.08116 6.1142 5.37999 6.88426 4.8618C7.65432 4.34361 8.53957 4.02438 9.4616 3.93239C10.3836 3.84041 11.314 3.97851 12.1702 4.33445C13.0265 4.69039 13.7823 5.25318 14.3707 5.973C14.9591 6.69283 15.3618 7.54746 15.5434 8.4612C15.7249 9.37495 15.6796 10.3196 15.4114 11.2115C15.1432 12.1034 14.6605 12.9151 14.0059 13.5746C13.2183 14.3671 12.2147 14.9068 11.122 15.1255C10.0293 15.3441 8.89664 15.2319 7.8674 14.8029C6.83816 14.374 5.95858 13.6476 5.34 12.7157C4.72141 11.7838 4.39164 10.6884 4.39238 9.56791L4.3831 9.57459Z"
                      fill="rgb(215 219 222)"
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
              </animated.div>
            </div>
          )}

          <div className="overflow-y-auto container w-[97%] bg-white  p-3  pt-3  -mt-[21px] mx-auto pb-[105px]">
            {myData && myData.length > 0 ? (
              <>
                {myData.map((item, index) => (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="flex justify-between items-center h-[85px]  border-b-2 border-gray-color gap-[2px]"
                  >
                    <div className="flex  items-center py-4  gap-2 sm:gap-6">
                      <img
                        src={render(item)}
                        alt="product image"
                        className="w-[42px] h-[42px] object-contain "
                      />
                      <div className="">
                        <h2 className="font-semibold text-sm leading-[17px] mb-[3px]  w-[150px] sm:w-[270px] md:w-[400px]">
                          {item.product.model}
                        </h2>
                        <p className="font-normal text-[10px] text-[#505558] leading-3">
                          {item.product.version}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end h items-center h-[85px]  gap-3">
                      {!compare && (
                        <div
                          className="border border-[#DEE5EC] pl-[13px] pr-[9px]  py-[9px] rounded-md flex items-center justify-center  cursor-pointer"
                          onClick={() => navigateToProduct(item.product.id)}
                        >
                          <p className="text-[12px] font-semibold leading-[15px] mt-[1.2px] text-[#242B2E] mr-[1px] ">
                            {t("searchPage.seeSpecsButtonText")}
                          </p>
                          <img
                            src="./images/arrow-right.svg"
                            alt="arrow right"
                            className={` w-[15px] mt-[1px] ${
                              isRTL ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      )}
                      {compare && (
                        <div
                          onClick={() =>
                            handelCompareClick(
                              item.product.id,
                              item.product.category
                            )
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
                      )}
                    </div>
                  </div>
                ))}
                <div className=" container w-[97%] bg-white  flex items-center justify-center p-3    mx-[1px] sm:mx-auto pb-[105px]">
                  <div className="loder">
                    <span></span>
                    <span style={{ "--delay": "0.2s" }}></span>
                    <span style={{ "--delay": "0.4s" }}></span>
                  </div>{" "}
                </div>
              </>
            ) : (
              <div>
                {skl && (
                  <div>
                    <div className="flex justify-between items-center h-24   py-2 border-b-2 border-gray-color">
                      <div className="flex  items-center py-4  gap-2 sm:gap-6">
                        <div className=" w-14 h-14 skeleton"></div>

                        <div className="">
                          <h2 className="skeleton-title skeleton mb-2"></h2>
                          <p className="skeleton-version skeleton"></p>
                        </div>
                      </div>
                      <div className="flex justify-end items-center h-24  gap-3">
                        {!compare && (
                          <div className=" px-2 py-1 rounded-lg ml-2 sm:ml-0  w-[60px] sm:w-[70px] h-[29px] skeleton"></div>
                        )}
                        {compare && (
                          <div className=" w-[23px] h-[23px] rounded-full cursor-pointer flex items-center justify-center  ">
                            <img
                              src="./images/Plus.svg"
                              alt=""
                              className="w-[17px] h-[17px] skeleton"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center h-24   py-2 border-b-2 border-gray-color">
                      <div className="flex  items-center py-4  gap-2 sm:gap-6">
                        <div className=" w-14 h-14 skeleton"></div>

                        <div className="">
                          <h2 className="skeleton-title skeleton mb-2"></h2>
                          <p className="skeleton-version skeleton"></p>
                        </div>
                      </div>
                      <div className="flex justify-end items-center h-24  gap-3">
                        {!compare && (
                          <div className=" px-2 py-1 rounded-lg ml-2 sm:ml-0  w-[60px] sm:w-[70px] h-[29px] skeleton"></div>
                        )}
                        {compare && (
                          <div className=" w-[23px] h-[23px] rounded-full cursor-pointer flex items-center justify-center  ">
                            <img
                              src="./images/Plus.svg"
                              alt=""
                              className="w-[17px] h-[17px] skeleton"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center h-24   py-2 border-b-2 border-gray-color">
                      <div className="flex  items-center py-4  gap-2 sm:gap-6">
                        <div className=" w-14 h-14 skeleton"></div>

                        <div className="">
                          <h2 className="skeleton-title skeleton mb-2"></h2>
                          <p className="skeleton-version skeleton"></p>
                        </div>
                      </div>
                      <div className="flex justify-end items-center h-24  gap-3">
                        {!compare && (
                          <div className=" px-2 py-1 rounded-lg ml-2 sm:ml-0  w-[60px] sm:w-[70px] h-[29px] skeleton"></div>
                        )}
                        {compare && (
                          <div className=" w-[23px] h-[23px] rounded-full cursor-pointer flex items-center justify-center  ">
                            <img
                              src="./images/Plus.svg"
                              alt=""
                              className="w-[17px] h-[17px] skeleton"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center h-24   py-2 border-b-2 border-gray-color">
                      <div className="flex  items-center py-4  gap-2 sm:gap-6">
                        <div className=" w-14 h-14 skeleton"></div>

                        <div className="">
                          <h2 className="skeleton-title skeleton mb-2"></h2>
                          <p className="skeleton-version skeleton"></p>
                        </div>
                      </div>
                      <div className="flex justify-end items-center h-24  gap-3">
                        {!compare && (
                          <div className=" px-2 py-1 rounded-lg ml-2 sm:ml-0  w-[60px] sm:w-[70px] h-[29px] skeleton"></div>
                        )}
                        {compare && (
                          <div className=" w-[23px] h-[23px] rounded-full cursor-pointer flex items-center justify-center  ">
                            <img
                              src="./images/Plus.svg"
                              alt=""
                              className="w-[17px] h-[17px] skeleton"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
      {filtersPage && (
        <div className="flex-col  bg-white flex h-full">
          <div className=" bg-white z-50">
            <NavBar />
          </div>
          {Resulterror && (
            <div className="fixed z-[999999999] top-[32%] left-1/2 -translate-x-1/2 bg-red-200 px-7 py-1 rounded-md mb-3 w-fit mx-auto">
              {t("searchPage.noMatchingError")}
            </div>
          )}
          <animated.div
            style={slideIn2}
            className={`px-6 my-2 flex-grow  z-[999]  flex flex-col  ${
              category === t("searchPage.deviceTypeDropdown").toLowerCase()
                ? ""
                : "overflow-auto"
            }`}
          >
            <PropertyList properties={filters} />
          </animated.div>
          <animated.div
            style={slideIn2}
            className="my-4 px-6 flex space-x-4 z-[501] "
          >
            <button
              onClick={CancelSearchFilters}
              className="rounded-md p-2 w-full text-base text-black bg-slate-100 hover:brightness-95 "
            >
              {t("searchPage.cancelBtn")}
            </button>
            <button
              onClick={SeeSearchFilters}
              style={{ background: settings.themeColor }}
              className="rounded-md p-2 w-full bg-black text-base text-white hover:brightness-150  "
            >
              {t("searchPage.seeResultBtn")}
              {" (" + (totalResult !== undefined ? totalResult : "0") + ")"}
            </button>
          </animated.div>
         
        </div>
      )}
    
    </animated.div>
  );
};

export default Search;
