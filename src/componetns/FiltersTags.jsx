import React, { useContext } from "react";
import { UserContext } from "../Pages/UserContext";
import { useTranslation } from "react-i18next";

const FiltersTags = () => {
  const { apliedFilters, setApliedFilters, settings, setCategory } =
    useContext(UserContext);
  function applyOpacityToColor(color, opacity) {
    const hexColor = color.startsWith("#") ? color.substring(1) : color;

    const red = parseInt(hexColor.substring(0, 2), 16);
    const green = parseInt(hexColor.substring(2, 4), 16);
    const blue = parseInt(hexColor.substring(4, 6), 16);

    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
  }
  const [t, i18n] = useTranslation();
  const isRTL = i18n.language === "ar";

  const removeApliedFilter = (keyToRemove) => {
    let newFilters = { ...apliedFilters };
    delete newFilters[keyToRemove];
    if (keyToRemove === "Product.Category") {
      setCategory(t("searchPage.deviceTypeDropdown").toLowerCase());
    }
    setApliedFilters(newFilters);
  };

  let lightCol = applyOpacityToColor(settings.themeColor, 0.25);
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
  return (
    <>
      {Object.keys(apliedFilters).length !== 0 && (
        <button
          style={{ color: settings.themeColor }}
          className={`flex items-center ml-auto  hover:underline  w-fit hover:opacity-80 text-black text-sm font-medium my-2 `}
          onClick={() => {
            setCategory(t("searchPage.deviceTypeDropdown").toLowerCase());
            setApliedFilters({});
          }}
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4  ${isRTL?'ml-1':'mr-1'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg> */}
          <p>{t("searchPage.deleteBtn")}</p>
        </button>
      )}
      <div dir="ltr" className="flex justify-start items-center flex-wrap gap-2">
        {Object.entries(apliedFilters).map(([key, value], index) => {
          if(key.split('.').pop() === 'Weight_g'){
            console.log('valueeeeeeeeeee',value);
          }

          return (
            <div
              key={index}
              className="p-2 bg-sky-400 bg-opacity-25 rounded-full flex items-center space-x-2 font-semibold text-sky-400"
              style={{
                color: settings.themeColor,
                backgroundColor: lightCol,
              }}
            >
              <p className="text-xs pt-[1px]">
                {removeUnderscoreAndHyphen(key.split(".").pop())}:
                {[
                  "Height_in",
                  "Height_mm",
                  "Thickness_in",
                  "Thickness_mm",
                  "Weight_g",
                  "Weight_oz",
                  "Width_in",
                  "Width_mm",
                ].includes(key.split(".").pop())
                  ? value
                  : value.join(" OR ")}
              </p>
              <button
                className="bg-sky-400 rounded-full w-5 h-5 flex justify-center items-center hover:scale-105 duration-150"
                style={{ backgroundColor: lightCol }}
                onClick={() => removeApliedFilter(key)}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white w-2 h-2"
                >
                  <path
                    d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FiltersTags;
