import Footer from "../componetns/Footer";
import SearchBar from "../componetns/SearchBar";
import NavBar from "../componetns/NavBar";
import Recent from "../componetns/Recent";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useTranslation } from "react-i18next";
import { useSpring, animated } from "react-spring";

const Home = () => {
  const { settings, cleanParentHostname } = useContext(UserContext);
  const [t, i18n] = useTranslation();
  const isRTL = i18n.language === "ar";
  const slideIn = useSpring({
    from: { opacity: 0, transform: "translateY(50%)" },
    to: { opacity: 1, transform: "translateX(0%)" },
    config: { duration: 200 }, // Set the animation duration
  });
  const slideIn1 = useSpring({
    from: { opacity: 0, transform: "translateY(50%)" },
    to: { opacity: 1, transform: "translateX(0%)" },
    config: { duration: 200 }, // Set the animation duration
  });

  useEffect(() => {
    window.plausible("Visit - Home - Inline Widget", {
      host: cleanParentHostname,
    });
  }, []);

  return (
    <div
      className={`overflow-y-auto bg-yellow-200 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div
        style={{ background: settings.themeColor }}
      
      >
        <div className="p-3 pb-0">
          <NavBar home={true} />
        </div>
        <animated.div
          style={isRTL ? slideIn : slideIn1}
          className={`container p-1 w-[97%] mx-auto`}
        >
          {settings.welcomeSecondary.length > 0 ? (
            <div className="bg-white rounded-lg p-5 py-4  w-full border-1  mt-5 sm:mt-7 shadow-sm border-gray-200 border ">
              <h4 className="font-bold text-xl mb-1 color-[#242B2E]">
                {settings.welcomePrimary}
              </h4>
              <p className="font-normal text-sm">{settings.welcomeSecondary}</p>
            </div>
          ) : (
            ""
          )}
        </animated.div>
      </div>

    
     
    </div>
  );
};

export default Home;
