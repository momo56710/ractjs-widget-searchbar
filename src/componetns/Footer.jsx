import React, { useContext } from "react";
import { UserContext } from "../Pages/UserContext";
import { useTranslation } from "react-i18next";

const Footer = ({ img }) => {
  const {
    navigateToHome,
    setCompare,
    setSkl,
    navigateToCompare,
    navigateToSearch,
    settings,
    setactive,
    active,
    cleanParentHostname,
  } = useContext(UserContext);

  const [t, i18n] = useTranslation();

  function handelClicks(page) {
    setSkl(false);
    if (page === "search") {
      setCompare(false);
      setactive("search");
      navigateToSearch();
    } else if (page === "compare") {
      navigateToCompare();
      setactive("compare");
    } else {
      navigateToHome();
      setactive("home");
    }
  }
  let colorr;
  if (active === "home") {
    colorr = settings.themeColor;
  } else {
    colorr = "inhirit";
  }
  let colorr1;
  if (active === "search") {
    colorr1 = settings.themeColor;
  } else {
    colorr1 = "inhirit";
  }
  let colorr2;
  if (active === "compare") {
    colorr2 = settings.themeColor;
  } else {
    colorr2 = "inhirit";
  }

  return (
    <>
      <div className="w-full  flex items-center justify-center  bg-white ">
        <div
          className={`basis-1/3 h-full w-full py-2  ${
            active === "home" ? `text-[${colorr}]` : ""
          } hover:opacity-75`}
        >
          <div
            style={{ color: colorr }}
            onClick={(e) => handelClicks("home")}
            className="flex  justify-center items-center gap-1 cursor-pointer "
          >
            <div
              className={`rounded-full w-6 h-6 transition-all  flex items-center justify-center`}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill={colorr}
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
              >
                <path
                  d="M7.07926 0.222253C7.31275 -0.007434 7.6873 -0.007434 7.92079 0.222253L14.6708 6.86227C14.907 7.09465 14.9101 7.47453 14.6778 7.71076C14.4454 7.947 14.0655 7.95012 13.8293 7.71773L13 6.90201V12.5C13 12.7761 12.7762 13 12.5 13H2.50002C2.22388 13 2.00002 12.7761 2.00002 12.5V6.90201L1.17079 7.71773C0.934558 7.95012 0.554672 7.947 0.32229 7.71076C0.0899079 7.47453 0.0930283 7.09465 0.32926 6.86227L7.07926 0.222253ZM7.50002 1.49163L12 5.91831V12H10V8.49999C10 8.22385 9.77617 7.99999 9.50002 7.99999H6.50002C6.22388 7.99999 6.00002 8.22385 6.00002 8.49999V12H3.00002V5.91831L7.50002 1.49163ZM7.00002 12H9.00002V8.99999H7.00002V12Z"
                  fill={colorr}
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>

            <p className={` text-[12px] `}>{t("navigationMenu.home")}</p>
          </div>
        </div>

        <div className={`basis-1/3 h-full w-full py-2  hover:opacity-75`}>
          <div
            style={{ color: colorr1 }}
            onClick={(e) => handelClicks("search")}
            className="flex  justify-center items-center gap-1 cursor-pointer "
          >
            <svg
              width="18"
              height="24"
              viewBox="0 0 25 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_35_17451)">
                <path
                  fill={colorr1}
                  clipRule="evenodd"
                  d="M23.2296 20.5679L17.3085 14.6119C18.5611 12.7786 19.0872 10.5407 18.7835 8.33745C18.4798 6.13415 17.3682 4.12457 15.667 2.70307C13.9658 1.28156 11.7977 0.550787 9.58824 0.654176C7.37881 0.757565 5.28757 1.68765 3.72494 3.26188C2.16231 4.83612 1.24113 6.94083 1.14218 9.16297C1.04324 11.3851 1.77367 13.5642 3.19013 15.2726C4.60659 16.981 6.6068 18.0953 8.7982 18.3969C10.9896 18.6984 13.214 18.1655 15.0347 16.9026L20.9545 22.8586C21.2566 23.162 21.6661 23.3323 22.093 23.3321C22.5199 23.3318 22.9293 23.161 23.231 22.8573C23.5327 22.5535 23.702 22.1417 23.7018 21.7123C23.7015 21.283 23.5317 20.8713 23.2296 20.5679ZM4.3831 9.57459C4.38257 8.64279 4.61054 7.72524 5.04682 6.9032C5.48309 6.08116 6.1142 5.37999 6.88426 4.8618C7.65432 4.34361 8.53957 4.02438 9.4616 3.93239C10.3836 3.84041 11.314 3.97851 12.1702 4.33445C13.0265 4.69039 13.7823 5.25318 14.3707 5.973C14.9591 6.69283 15.3618 7.54746 15.5434 8.4612C15.7249 9.37495 15.6796 10.3196 15.4114 11.2115C15.1432 12.1034 14.6605 12.9151 14.0059 13.5746C13.2183 14.3671 12.2147 14.9068 11.122 15.1255C10.0293 15.3441 8.89664 15.2319 7.8674 14.8029C6.83816 14.374 5.95858 13.6476 5.34 12.7157C4.72141 11.7838 4.39164 10.6884 4.39238 9.56791L4.3831 9.57459Z"
                  stroke="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_35_17451">
                  <rect
                    width="24"
                    height="24"
                    fill={colorr1}
                    transform="translate(0.5)"
                  />
                </clipPath>
              </defs>
            </svg>

            <p className=" text-[12px]">{t("navigationMenu.search")} </p>
          </div>
        </div>
        <div className={`basis-1/3 h-full w-full py-2  hover:opacity-75 `}>
          <div
            style={{ color: colorr2 }}
            onClick={(e) => handelClicks("compare")}
            className="flex  justify-center items-center gap-1 cursor-pointer "
          >
            <div
              className={`rounded-full w-6 h-6 transition-all  flex items-center justify-center`}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 27 11"
                fill={colorr2}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 7.83051V0H4.18222V7.83051H6.21183V9.32203H8.36444V7.83051H10.394V0H12.4852V7.83051H10.394V9.32203H8.36444V10.9379H4.18222V9.32203H2.02961V7.83051H0Z"
                  fill={colorr2}
                />
                <path
                  d="M16.7288 0H26.9998V1.49153H18.7584V4.59887H24.9702V6.15254H26.9998V9.32203H24.9702V11H14.5762V9.32203H24.9702V6.15254H16.7288V4.59887H14.5762V1.49153H16.7288V0Z"
                  fill={colorr2}
                />
              </svg>
            </div>

            <p className={` text-[12px] `}>{t("navigationMenu.compare")}</p>
          </div>
        </div>
      </div>

      {settings.activePlan === "free" && (
        <div className="w-full flex justify-center items-center gap-1 h-9 py-3 bg-white border-t-2 border-gray-color">
          <p className="font-semibold text-xs text-[#242B2E]">
            {t("footer.text")}
          </p>
          <a
            href={`https://widget.techspecs.io/?utm_source=${cleanParentHostname}&utm_medium=inline_widget&utm_content=powered_by_link`}
            target="_blank"
            className="cursor-pointer"
          >
            <svg
              width="90"
              height="18.1"
              viewBox="0 0 90 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.9773 12.2159V2.4013L11.4888 7.01851V16.8027L15.9773 12.2159Z"
                fill="#03A9F4"
              />
              <path
                d="M11.4885 2.40134L7 7.01855H11.4885V2.40134Z"
                fill="#37474F"
              />
              <path
                d="M15.9773 2.40134L11.4888 7.01855H18.4609L22.9494 2.40134H15.9773Z"
                fill="#03A9F4"
              />
              <path
                d="M15.9773 7.46343L11.4888 12.0503V7.01866H15.9773V7.46343Z"
                fill="#1976D2"
              />
              <path
                d="M29.098 6.03929H23.2739V7.33679H25.3745V13.0952H26.9775V7.33679H29.098"
                fill="#455A64"
              />
              <path
                d="M35.0075 10.1901V8.93415H31.6507V7.30576H35.3692V6.04968H30.0479V13.0952H35.4799V11.8392H31.6507V10.1901"
                fill="#455A64"
              />
              <path
                d="M36.3599 9.55209C36.3599 11.6193 37.9098 13.1782 39.9652 13.1782C40.9326 13.1782 41.9877 12.7091 42.7403 11.9489L41.8224 10.9503C41.3145 11.4497 40.6457 11.7567 40.0557 11.7567C38.8855 11.7567 38.0031 10.8001 38.0031 9.53139C38.0031 8.2804 38.8855 7.33701 40.0557 7.33701C40.6784 7.33701 41.3467 7.67513 41.8241 8.2258L42.7336 7.11759C42.0391 6.41905 41.0097 5.98802 40.0257 5.98802C37.9358 5.98802 36.3599 7.52028 36.3599 9.55209Z"
                fill="#455A64"
              />
              <path
                d="M50.0836 13.0952V6.04974H48.4806V9.02714H45.3802V6.04974H43.7773V13.0952H45.3802V10.2831H48.4806V13.0952"
                fill="#455A64"
              />
              <path
                d="M56.0409 6.64401L55.7049 7.40675C55.0819 6.97949 54.3503 6.80667 53.7967 6.80667C52.9068 6.80667 52.3235 7.1525 52.3235 7.7524C52.3235 9.58309 56.2188 8.62718 56.2091 11.2104C56.2091 12.4003 55.1906 13.1631 53.7077 13.1631C52.6994 13.1631 51.7106 12.7156 51.0581 12.0748L51.4141 11.3426C52.0566 11.9834 52.9366 12.3494 53.7177 12.3494C54.7161 12.3494 55.3391 11.9327 55.3391 11.251C55.3489 9.37969 51.4535 10.3765 51.4535 7.82366C51.4535 6.70501 52.4127 5.98293 53.846 5.98293C54.6469 5.98293 55.4675 6.24734 56.0409 6.64401Z"
                fill="#263238"
              />
              <path
                d="M58.622 10.1015H60.4019C61.6475 10.1015 62.3693 9.53201 62.3693 8.4235C62.3693 7.34535 61.6475 6.79628 60.4019 6.79628H58.622V10.1015ZM60.4314 6.01311C62.142 6.01311 63.1304 6.88778 63.1304 8.4031C63.1304 9.97938 62.142 10.8845 60.4314 10.8845H58.622V13.1323H57.8311V6.01311"
                fill="#263238"
              />
              <path
                d="M65.2368 6.79628V9.13533H68.7268V9.91842H65.2368V12.3593H69.2706V13.1323H64.4458V6.01311H69.142V6.79628"
                fill="#263238"
              />
              <path
                d="M76.3697 7.03L75.8951 7.65041C75.3612 7.09099 74.6098 6.75551 73.8486 6.75551C72.2864 6.75551 71.0308 7.99625 71.0308 9.56245C71.0308 11.1186 72.2864 12.3694 73.8486 12.3694C74.6098 12.3694 75.3514 12.044 75.8951 11.5152L76.3796 12.0744C75.6974 12.7356 74.768 13.1729 73.8089 13.1729C71.8119 13.1729 70.23 11.5761 70.23 9.56245C70.23 7.56908 71.8315 5.99258 73.8387 5.99258C74.7879 5.99258 75.7072 6.38944 76.3697 7.03Z"
                fill="#263238"
              />
              <path
                d="M82.0547 6.64401L81.7187 7.40675C81.0957 6.97949 80.3641 6.80667 79.8105 6.80667C78.9206 6.80667 78.3373 7.1525 78.3373 7.7524C78.3373 9.58309 82.2326 8.62718 82.2229 11.2104C82.2229 12.4003 81.2043 13.1631 79.7215 13.1631C78.713 13.1631 77.7242 12.7156 77.0718 12.0748L77.4277 11.3426C78.0704 11.9834 78.9503 12.3494 79.7313 12.3494C80.7298 12.3494 81.3528 11.9327 81.3528 11.251C81.3626 9.37969 77.4673 10.3765 77.4673 7.82366C77.4673 6.70501 78.4264 5.98293 79.8598 5.98293C80.6607 5.98293 81.4813 6.24734 82.0547 6.64401Z"
                fill="#263238"
              />
            </svg>
          </a>
        </div>
      )}
    </>
  );
};

export default Footer;
