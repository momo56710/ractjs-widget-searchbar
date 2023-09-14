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
import Recent from "../componetns/Recent";
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
    <animated.div
      className={`w-screen  ${isRTL ? "rtl" : "ltr"} `}
    >
      <NavBar home={true} lang={true} search={true} />
      <div className="h-[70vh] w-fit md:min-w-[35em] bg-white">
        {!filtersPage && (
          <>
            <div className="sticky top-0  z-50">
              <div style={slideIn} className="container  p-3 z-10">
                <Recent />
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
                          onClick={() => {
                            setFilterTooltip(false);
                            navigateToSearchFilters();
                          }}
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

            <div className="overflow-y-auto container w-[97%] h-[60%] bg-white  p-3  pt-3  -mt-[21px] mx-auto pb-[105px]">
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
          <div className="flex-col  bg-white flex h-full  md:w-[30em]">
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
      </div>
    </animated.div>
  );
};

export default Search;
