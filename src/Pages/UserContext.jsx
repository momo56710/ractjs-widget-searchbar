import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const fullParentHostname = window.location.ancestorOrigins[0];

  // Remove "http://" or "https://" from the hostname
  const startIndex = fullParentHostname?.indexOf("//") + 2;
  const cleanParentHostname = fullParentHostname?.substring(startIndex);

  const [t, i18n] = useTranslation();
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(window.localStorage.getItem("recentSearches")) || []
  );

  const [recentCompareProducts, setRecentCompareProducts] = useState(
    JSON.parse(window.localStorage.getItem("RecentCompareProducts")) || []
  );
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("widgetCurrentPage") || "home"
  );
  const [filtersPage, setFiltersPage] = useState(false);
  const [filters, setFilters] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [apliedFilters, setApliedFilters] = useState({});
  const [totalResult, setTotalResult] = useState(0);
  const [myData, setMyData] = useState([]);
  const [myProduct, setMyProduct] = useState({});
  const [CompareProducts, setCompareProducts] = useState([]);
  const [displayedData, setDisplayedData] = useState("");
  const [category, setCategory] = useState(
    t("searchPage.deviceTypeDropdown").toLowerCase()
  );
  const [brand, setBrand] = useState([]);
  const [Allbrand, setAllBrand] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [key, setKey] = useState("");
  const [compare, setCompare] = useState(false);
  const [active, setactive] = useState(
    localStorage.getItem("widgetCurrentPage") || "home"
  );
  const [properties, setProperties] = useState({});
  const [skl, setSkl] = useState(false);
  const [totalpagesLoaded, setTotalPagesLoaded] = useState(0);
  const [totalpages, setTotalPages] = useState(0);
  const [autopilotOn, setAutopilotOn] = useState(false);
  const [autopilotData, setAutopilotData] = useState({});
  const [productsId, setProductsId] = useState([]);
  const [langparms, setLangParms] = useState({ productId: "", version: 0 });
  const [currentLang, setCurrentLang] = useState(
    JSON.parse(localStorage.getItem("language"))?.name || "english"
  );
  const [settings, setSettings] = useState({
    welcomePrimary: "",
    welcomeSecondary: "",
    trustedDomain: "",
    organisationName: "",
    themeColor: "",
    defaultLanguage: "",
    deviceTypes: [""],
    innerPageLogo: "",
    homePageLogo: "",
    activePlan: "",
  });
  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const cancelAdvance = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel("Component unmounted");
    }
  };
  useEffect(() => {
    if (Object.keys(apliedFilters).length !== 0) {
      fetchDataAdvance(apliedFilters);
    } else {
      setMyData([]);
      setTotalResult(0);
    }

    return () => {
      cancelAdvance();
    };
  }, [apliedFilters]);

  let source;

  async function fetchDataAdvance(apliedFilters, page = 0, b = true) {
    const baseURL =
      import.meta.env.MODE === "production"
        ? import.meta.env.VITE_BASE_URL_PRODUCTION
        : import.meta.env.VITE_BASE_URL_STAGING;

    const url =
      baseURL +
      `/products/advanced?hostname=acme.com&search=${keyword}&page=${page}`;

    const filters = {};
    const facets = {};

    // Categorize attributes into filters and facets based on your logic
    for (const attribute in apliedFilters) {
      if (
        [
          "Design.Body.Height_in",
          "Design.Body.Thickness_in",
          "Design.Body.Weight_oz",
          "Design.Body.Width_in",
          "Design.Body.Height_mm",
          "Design.Body.Thickness_mm",
          "Design.Body.Weight_g",
          "Design.Body.Width_mm",
        ].includes(attribute)
      ) {
        filters[attribute] = apliedFilters[attribute][0];
      } else {
        facets[attribute] = apliedFilters[attribute];
      }
    }

    const data = JSON.stringify({
      filters,
      facets,
    });

    const headers = {
      "Content-Type": "application/json",
    };

    if (cancelTokenSource) {
      cancelTokenSource.cancel("Request canceled due to filter change");
    }

    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    try {
      const response = await axios.post(url, data, {
        headers,
        cancelToken: source.token,
      });

      let newData = response.data.data;
      console.log("data.data", newData);
      setTotalResult(newData.total_results);

      if (Object.keys(apliedFilters).length !== 0) {
        setMyData((prevData) =>
          Array.isArray(prevData)
            ? [...prevData, ...newData?.items]
            : [...newData?.items]
        );

        if (b) {
          setTotalPages(newData?.total_pages);
          setTotalPagesLoaded(1);
          console.log("doneeeeeeee", totalpages, totalpagesLoaded);
        } else {
          setTotalPagesLoaded((prev) => prev + 1);
        }
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else if (error.response && error.response.status === 400) {
        console.log("No products found");
        setTotalResult(0);
        setMyData([]);
      } else {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    const fetchSettings = async () => {
      const baseURL =
        import.meta.env.MODE === "production"
          ? import.meta.env.VITE_BASE_URL_PRODUCTION
          : import.meta.env.VITE_BASE_URL_STAGING;

      const url = baseURL + "/settings";
      try {
        const response = await axios.get(url, {
          params: {
            hostname: "acme.com",
          },
        });

        setSettings(response.data.data.res);
      } catch (error) {}
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (compare && Object.keys(myProduct).length > 0) {
      let recentcproducts = recentCompareProducts;
      let prod = {};
      prod["model"] =
        myProduct?.items[0]?.[t("detailsPage.product")]?.[
          t("detailsPage.model")
        ];
      prod["brand"] =
        myProduct?.items[0]?.[t("detailsPage.product")]?.[
          t("detailsPage.brand")
        ];
      const storedLanguage = localStorage.getItem("language"); // Retrieve the stored language from local storage
      if (!storedLanguage || JSON.parse(storedLanguage)?.isoCode === "en") {
        prod["id"] = myProduct.items[0]?.[t("detailsPage.product")]?.id;
      } else {
        prod["id"] = myProduct.items[0]?.[t("detailsPage.product")]?.english_id;
      }
      prod["category"] = myProduct?.category;
      recentcproducts = recentcproducts.filter((item) => item.id !== prod.id);
      recentcproducts.unshift(prod);
      setRecentCompareProducts(recentcproducts);
      window.localStorage.setItem(
        "RecentCompareProducts",
        JSON.stringify(recentcproducts)
      );
    }
    console.log(myProduct);
  }, [myProduct]);

  useEffect(() => {
    if (category !== t("searchPage.deviceTypeDropdown").toLowerCase()) {
      setSkl(false);
      const baseURL =
        import.meta.env.MODE === "production"
          ? import.meta.env.VITE_BASE_URL_PRODUCTION
          : import.meta.env.VITE_BASE_URL_STAGING;
      const url = baseURL + `/brands?hostname=acme.com&category=` + category;

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
    }
    console.log("mudata", myData);
    if (
      Object.keys(myData).length !== 0 &&
      category !== t("searchPage.deviceTypeDropdown").toLowerCase()
    ) {
      const modifiedArray = myData;
      const filteredArray = modifiedArray?.filter(
        (item) => item.product.category === category
      );
      setMyData([...filteredArray]);
    }
  }, [category]);

  useEffect(() => {
    if (myData.length !== 0 && brand.length !== 0) {
      setSkl(false);
      const modifiedArray = myData;
      const filteredArray = modifiedArray?.filter((item) =>
        brand.includes(item.product.brand)
      );
      setMyData([...filteredArray]);
    }
  }, [brand]);

  useEffect(() => {
    if (CompareProducts.length > 0) {
      const ssr = allProperties(CompareProducts);
      setProperties(ssr);
    }
    console.log(CompareProducts);
  }, [CompareProducts]);

  function render(item) {
    const productCategory =
      item?.[t("detailsPage.product")]?.[t("detailsPage.category")];
    let imageSrc = "";
    let frontImageExists = "";
    let backImageExists = "";
    if (item?.[t("detailsPage.image")]) {
      if (
        item?.[t("detailsPage.image")]?.[t("detailsPage.front")] &&
        item?.[t("detailsPage.image")]?.[t("detailsPage.front")] !== null
      )
        frontImageExists =
          item?.[t("detailsPage.image")]?.[t("detailsPage.front")]; // Set to true if the front image exists
      if (
        item?.[t("detailsPage.image")]?.[t("detailsPage.back")] &&
        item?.[t("detailsPage.image")]?.[t("detailsPage.back")] !== null
      )
        backImageExists =
          item?.[t("detailsPage.image")]?.[t("detailsPage.back")]; // Set to true if the back image exists
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
  let source1;
  const fetchData = async (keyy, page = 0, b = true) => {
    const baseURL =
      import.meta.env.MODE === "production"
        ? import.meta.env.VITE_BASE_URL_PRODUCTION
        : import.meta.env.VITE_BASE_URL_STAGING;

    const url = `${baseURL}/products?hostname=acme.com&search=${keyy}&page=${page}`;

    const headers = {
      accept: "application/json",
      "content-type": "application/json",
    };

    let catg;
    if (
      category.toLowerCase() ===
      t("searchPage.deviceTypeDropdown").toLowerCase()
    ) {
      catg = "";
    } else {
      catg = category;
    }
    source1 = axios.CancelToken.source();

    const data = JSON.stringify({ category: catg });

    try {
      const response = await axios.post(url, data, {
        headers,
        cancelToken: source1.token, // Set the cancel token
      });

      let newData = response.data.data;

      if (Object.keys(newData).length !== 0 && brand.length !== 0) {
        const modifiedArray = newData.items;
        let filteredArray;

        filteredArray = modifiedArray.filter((item) =>
          brand.includes(item.product.brand)
        );
        newData.items = filteredArray;
      }

      if (
        Object.keys(newData).length !== 0 &&
        category !== t("searchPage.deviceTypeDropdown").toLowerCase()
      ) {
        let modifiedArray = newData.items;
        let filteredArray;

        filteredArray = modifiedArray.filter(
          (item) => item.product.category === category
        );
        newData.items = filteredArray;
      }
      setTotalResult(newData.total_results);

      setMyData((prevData) =>
        Array.isArray(prevData)
          ? [...prevData, ...newData?.items]
          : [...newData?.items]
      );
      if (b) {
        setTotalPages(response.data.data.total_pages);
        setTotalPagesLoaded(1);
      } else {
        setTotalPagesLoaded((prev) => prev + 1);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        // Request was cancelled, handle accordingly
        console.log("Request was cancelled:", error.message);
      } else {
        console.error(error);
        setTotalResult(0);
      }
    }
  };
  const cancelRequest = () => {
    source1?.cancel("Request cancelled due to active state change");
  };

  useEffect(() => {
    // Fetch remaining pages of data
    if (totalpages > 0 && totalpagesLoaded < totalpages) {
      if (Object.keys(apliedFilters).length !== 0) {
        fetchDataAdvance(key, totalpagesLoaded, false);
      } else {
        if (keyword === key) {
          fetchData(key, totalpagesLoaded, false);
        }
      }
    }
  }, [totalpagesLoaded]);

  const fetchProduct = (productId, b) => {
    let lang;

    const storedLanguage = localStorage.getItem("language"); // Retrieve the stored language from local storage
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
      "&keepCasing=true" +
      "&lang=" +
      lang;

    const headers = {
      accept: "application/json",
      "content-type": "application/json",
    };
    axios
      .get(url, { headers })
      .then((response) => {
        if (b) {
          setCompareProducts((prev) => [...prev, response.data.data.items[0]]);
          setMyProduct(response.data.data);
        } else {
          setMyProduct(response.data.data);
        }
      })
      .catch((err) => console.error(err));
  };

  const onSearch = (existingSearches) => {
    setRecentSearches(existingSearches);
  };

  useEffect(() => {
    // Retrieve the current page value from localStorage
    const storedPage = localStorage.getItem("widgetCurrentPage");
    if (storedPage) {
      setCurrentPage(storedPage);
    }
  }, []);

  useEffect(() => {
    // Store the current page value in localStorage
    localStorage.setItem("widgetCurrentPage", currentPage);
  }, [currentPage]);

  const navigateToSearch = () => {
    setMyData([]);
    setFiltersPage(false);
    setApliedFilters({});
    setCurrentPage("search");
    localStorage.setItem("widgetCurrentPage", currentPage);
  };
  const getFilters = () => {
    const baseURL =
      import.meta.env.MODE === "production"
        ? import.meta.env.VITE_BASE_URL_PRODUCTION
        : import.meta.env.VITE_BASE_URL_STAGING;
    const hostname = "acme.com";
    const url = baseURL + "/filters?hostname=" + hostname;
    const headers = {
      accept: "application/json",
      "content-type": "application/json",
    };
    axios
      .get(url, { headers })
      .then((response) => {
        console.log('filters original' ,response.data.data);
        setFilters(response.data.data);
      })
      .catch((err) => console.error(err));
  };
  const navigateToSearchFilters = () => {
    if (category !== t("searchPage.deviceTypeDropdown").toLowerCase()) {
      setApliedFilters((prev) => {
        const updatedFilters = { ...prev };
        updatedFilters["Product.Category"] = [category];
        return updatedFilters;
      });
    }

    setFiltersPage(true);
    getFilters();
    cancelRequest();
  };
  const CancelSearchFilters = () => {
    setFiltersPage(false);
    setMyData([]);
    setApliedFilters({});
    setCategory(t("searchPage.deviceTypeDropdown").toLowerCase());
  };
  const [Resulterror, setResultError] = useState(false);

  const SeeSearchFilters = () => {
    if (totalResult === undefined || totalResult === 0) {
      setResultError(true);
      setTimeout(() => setResultError(false), 1000);
    } else {
      setFiltersPage(false);
    }
  };

  const navigateToCompare = () => {
    setFiltersPage(false);
    setCompare(true);
    if (
      (active === "search" && currentPage === "search") ||
      (active === "compare" && currentPage === "search")
    ) {
      cancelRequest();
    }
    setactive("compare");
    setSkl(false);
    setCurrentPage("compare");
  };

  const navigateToProduct = (productId) => {
    setCurrentPage("product");
    cancelAdvance();
    if (active === "search") {
      cancelRequest();
    }

    fetchProduct(productId, false);
    setFiltersPage(false);
  };

  const navigateToHome = () => {
    setFiltersPage(false);
    setCompare(false);
    if (active === "search") {
      cancelRequest();
    }
    setCategory(t("searchPage.deviceTypeDropdown").toLowerCase());
    setactive("home");
    setCurrentPage("home");
  };
  const flattenObject = (obj, prefix = "") => {
    return Object.keys(obj).reduce((acc, key) => {
      const propName = `${prefix}${key}`;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        Object.assign(acc, flattenObject(obj[key], `${propName}.`));
      } else {
        acc[propName] = "";
      }
      return acc;
    }, {});
  };

  const mergeProperties = (properties) => {
    const merged = {};
    properties.forEach((obj) => {
      for (const key in obj) {
        if (merged.hasOwnProperty(key)) {
          if (typeof obj[key] === "object" && typeof merged[key] === "object") {
            merged[key] = mergeProperties([merged[key], obj[key]]);
          } else {
            merged[key] = obj[key];
          }
        } else {
          merged[key] = obj[key];
        }
      }
    });
    return merged;
  };

  const getUniqueProperties = (compareproducts) => {
    const propertiesw = [];

    compareproducts.forEach((product) => {
      const flattenedProduct = flattenObject(product, "");
      propertiesw.push(flattenedProduct);
    });

    return mergeProperties(propertiesw);
  };
  const allProperties = (products) => {
    const mergedProduct = {};

    products.forEach((product) => {
      mergeProductProperties(mergedProduct, product);
    });

    return mergedProduct;
  };

  const mergeProductProperties = (target, source) => {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === "object" && source[key] !== null) {
          if (!target.hasOwnProperty(key)) {
            target[key] = {};
          }
          mergeProductProperties(target[key], source[key]);
        } else {
          target[key] = ""; // Set an empty string to indicate the existence of the property
        }
      }
    }
  };

  return (
    <UserContext.Provider
      value={{
        filters,
        filtersPage,
        CancelSearchFilters,
        navigateToSearchFilters,
        productsId,
        setProductsId,
        autopilotData,
        setAutopilotData,
        autopilotOn,
        setAutopilotOn,
        currentLang,
        setLangParms,
        langparms,
        setCurrentLang,
        setTotalPages,
        setKey,
        active,
        setactive,
        skl,
        setSkl,
        allProperties,
        getUniqueProperties,
        settings,
        Allbrand,
        setRecentCompareProducts,
        recentCompareProducts,
        setProperties,
        properties,
        fetchProduct,
        CompareProducts,
        setCompareProducts,
        render,
        myProduct,
        setMyProduct,
        brand,
        setBrand,
        compare,
        setCompare,
        currentPage,
        navigateToSearch,
        navigateToCompare,
        navigateToHome,
        navigateToProduct,
        setCurrentPage,
        onSearch,
        recentSearches,
        setRecentSearches,
        fetchData,
        category,
        setCategory,
        myData,
        setMyData,
        keyword,
        setKeyword,
        filterOpen,
        setFilterOpen,
        apliedFilters,
        setApliedFilters,
        fetchDataAdvance,
        totalResult,
        SeeSearchFilters,
        totalpagesLoaded,
        setTotalPagesLoaded,
        Resulterror,
        cleanParentHostname,
        setAllBrand,
        setTotalResult,
        displayedData,
        setDisplayedData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
