import React, { useContext, useState, useRef } from "react";
import { UserContext } from "../Pages/UserContext";
import { useTranslation } from "react-i18next";
import languages from "../languages";
import { useEffect } from "react";
import axios from "axios";

const LanguageDrop = ({ home }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [color, setColor] = useState("#91A8BF");
  const [language, setLanguage] = useState({
    name: "English",
    isoCode: "en",
    imageUrl: "./images/flags/britain-48.png",
  });
  const {
    setProperties,
    productsId,
    setAutopilotData,
    setAutopilotOn,
    CompareProducts,
    setCompareProducts,
    category,
    setCategory,
    settings,
    setCurrentLang,
    currentLang,
    setMyProduct,
    langparms,
    fetchProduct,
  } = useContext(UserContext);
  const [t, i18n] = useTranslation();
  const storedLanguage = localStorage.getItem("language"); // Retrieve the stored language from local storage
  const widgetCurrentPage = localStorage.getItem("widgetCurrentPage");
  const dropdownRef = useRef(null);
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    // Check if the dropdown is open and the ref is available
    if (open && dropdownRef.current) {
      // Set focus to the dropdown element when it opens
      dropdownRef.current.focus();
    }
  }, [open]);

  function handelClick() {
    setOpen(!open);
    setSearchQuery("");
  }
  const handleSearchClick = (e) => {
    e.stopPropagation(); // Prevent click event propagation
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  let filteredlanguages = languages.filter(
    (elm) => elm && elm.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const fetchProductCompare = (productId) => {
    const storedLanguage = localStorage.getItem("language"); // Retrieve the stored language from local storage
    let lang;
    if (!storedLanguage) {
      lang = "en";
    } else {
      lang = JSON.parse(storedLanguage)?.isoCode;
    }

    const baseURL =
      import.meta.env.MODE === "production"
        ? import.meta.env.VITE_BASE_URL_PRODUCTION
        : import.meta.env.VITE_BASE_URL_STAGING;

    const url =
      baseURL +
      "/products/" +
      productId +
      "?hostname=" +
      "acme.com" +
      "&lang=" +
      lang;

    const headers = {
      accept: "application/json",
      "content-type": "application/json",
    };
    axios
      .get(url, { headers })
      .then((response) => {
        setCompareProducts((prev) => [...prev, response.data.data.items[0]]);
      })
      .catch((err) => console.error(err));
  };
  function handelLanguageClick(elm) {
    setSearchQuery("");
    setCurrentLang(elm.name);
    setLanguage({ ...elm });
    setOpen(false);
    i18n.changeLanguage(elm.isoCode);
    localStorage.setItem(
      "language",
      JSON.stringify({
        isoCode: elm.isoCode,
        name: elm.name,
        imageUrl: elm.imageUrl,
      })
    );
    if (widgetCurrentPage === "product") {
      setMyProduct({});
      fetchProduct(langparms.productId, false);
    }
    if (
      ![
        "Smartphones",
        "Tablets",
        "Smartwatches",
        "Laptops",
        "Desktops",
        "Displays",
        "GPUs",
      ].includes(category)
    ) {
      setCategory(t("searchPage.deviceTypeDropdown").toLowerCase());
    }
    if (widgetCurrentPage === "compare") {
      setAutopilotData("");
      setAutopilotOn(false);
    }
    console.log("change language");

    if (CompareProducts.length > 0) {
      setCompareProducts([]);
      setProperties({});
      for (let i = 0; i < productsId.length; i++) {
        console.log(
          "iddddddddddddddddddddddddddddddddddddddddd    " + productsId[i]
        );
        fetchProductCompare(productsId[i]);
      }
    }
  }
  return (
    <div>
      <div
        className="flex gap-2 items-center cursor-pointer "
        onClick={handelClick}
      >
        <p
          className={` text-[#242B2E] decoration-[#505152] 
          z-[90] capitalize hover:underline  text-sm `}
        >
          {(storedLanguage && JSON.parse(storedLanguage).name) || currentLang}
        </p>
        <div
          style={{
            background: `url(${
              (storedLanguage && JSON.parse(storedLanguage).imageUrl) ||
              "./images/flags/britain-48.png"
            }) lightgray -2px -2px / 125% 125% no-repeat`,
          }}
          className="z-[90] rounded-full w-[18px]  h-[18px] border border-[#EEF2F6] flex items-center justify-center"
        >
          {/* <img
            src={
              (storedLanguage && JSON.parse(storedLanguage).imageUrl) ||
              "./images/flags/britain-48.png"
            }
            alt=""
            className="w-[100%] "
          /> */}
        </div>
      </div>

      {open && (
        <>
          <div
            className={`overlay bg-[#29282880] h-[20em] fixed top-  z-[100] right-0`}
            onClick={() => setOpen(false)}
          ></div>

          <div
            className={` bg-white w-[304px] h-[387px] dropshd absolute z-[199999] top-9 ${
              isRTL ? "left-0 language-drop-rtl" : "right-0 language-drop"
            } rounded-lg p-4 flex flex-col gap-4`}
          >
            <div className="flex items-center justify-between ">
              <div></div>
              <h3 className="text-[#242B2E] text-center text-xl font-bold ">
                {t("languageDropdown.title")}
              </h3>

              <img
                src="./images/Frame 3 (1).svg"
                alt=""
                className="cursor-pointer w-8 h-8"
                onClick={() => setOpen(false)}
              />
            </div>

            <div className="">
              <label htmlFor="input-group-search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 ${
                    isRTL ? "mr-[10px]" : "ml-[10px]"
                  } flex items-center  pointer-events-none w-[18px] h-[18px] top-3`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M17.8662 16.4259L13.4254 11.9589C14.3648 10.584 14.7594 8.90555 14.5316 7.25308C14.3038 5.60062 13.4701 4.09343 12.1942 3.0273C10.9183 1.96117 9.29223 1.41309 7.63515 1.49063C5.97807 1.56817 4.40965 2.26574 3.23768 3.44641C2.0657 4.62709 1.37482 6.20563 1.30061 7.87222C1.2264 9.53882 1.77422 11.1731 2.83657 12.4544C3.89892 13.7357 5.39907 14.5715 7.04262 14.7977C8.68617 15.0238 10.3544 14.6241 11.72 13.6769L16.1599 18.1439C16.3864 18.3715 16.6936 18.4992 17.0137 18.499C17.3339 18.4989 17.6409 18.3708 17.8672 18.1429C18.0935 17.9151 18.2205 17.6062 18.2203 17.2842C18.2201 16.9622 18.0927 16.6535 17.8662 16.4259ZM3.73129 8.18094C3.7309 7.48209 3.90188 6.79393 4.22908 6.1774C4.55629 5.56087 5.02962 5.03499 5.60717 4.64635C6.18471 4.25771 6.84865 4.01828 7.54017 3.9493C8.23169 3.88031 8.92944 3.98389 9.57166 4.25084C10.2139 4.5178 10.7807 4.93989 11.222 5.47975C11.6633 6.01962 11.9654 6.66059 12.1015 7.3459C12.2376 8.03121 12.2036 8.73971 12.0025 9.40865C11.8014 10.0776 11.4393 10.6863 10.9484 11.1809C10.3577 11.7753 9.60499 12.1801 8.78546 12.3441C7.96593 12.5081 7.11645 12.4239 6.34452 12.1022C5.57259 11.7805 4.9129 11.2357 4.44897 10.5368C3.98503 9.83788 3.7377 9.01626 3.73826 8.17594L3.73129 8.18094Z"
                      fill="#242B2E"
                      stroke="#F6F8FA"
                    />
                  </svg>
                </div>
                <input
                  ref={dropdownRef}
                  onClick={handleSearchClick}
                  onChange={handleSearchChange}
                  type="text"
                  id="input-group-search"
                  className={`bg-white outline-none border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full  p-2.5 placeholder:text-[#91A8BF] ${
                    isRTL ? "pr-9" : " pl-9"
                  }`}
                  value={searchQuery}
                  placeholder={t("languageDropdown.searchBarPlaceholder")}
                />
                {!(searchQuery === "") ? (
                  <div
                    onClick={() => setSearchQuery("")}
                    onMouseEnter={() => setColor("#778da3")}
                    onMouseLeave={() => setColor("#E0E0E0")}
                    className={` absolute ${
                      isRTL ? " left-1" : " right-1"
                    }  bottom-2 px-2 py-1 z-10 cursor-pointer`}
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
            </div>
            <div className="flex-grow flex flex-col justify-start  overflow-auto">
              {filteredlanguages.map((elm, index) => (
                <div key={index} className="py-2 border-b-2 border-gray-color">
                  <div
                    style={
                      currentLang === elm.name
                        ? { background: settings.themeColor, color: "white" }
                        : {}
                    }
                    onClick={() => {
                      handelLanguageClick(elm);
                    }}
                    className="flex justify-start gap-3 items-center p-2 rounded-md hover:bg-[#EEF2F6] cursor-pointer "
                  >
                    <div
                      style={{
                        background: `url(${elm.imageUrl}) lightgray -2.7px -2.9px / 120% 124% no-repeat`,
                      }}
                      className=" border-[#EEF2F6]  rounded-[30px] w-[30px]  h-[30px] border flex items-center justify-center"
                    ></div>
                    {/* <div className="rounded-full w-[25px]  h-[25px] border flex items-center justify-center">
                      {" "}
                      <img
                        src={elm.imageUrl}
                        className="w-full"
                      />
                    </div> */}
                    <p className="capitalize  text-base font-semibold  ">
                      {elm.name}
                    </p>
                  </div>
                </div>
              ))}
              {filteredlanguages.length === 0 && searchQuery !== "" && (
                <p className="p-2 text-center color-[#242B2E] text-base  font-semibold">
                  {t("languageDropdown.noItemMssg")}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageDrop;
