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
      className={`overflow-y-auto   ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div
        style={{ background: settings.themeColor }}
      
      >
        <div>
          <NavBar home={true} lang={true}/>
        </div>
       
      </div>

    
     
    </div>
  );
};

export default Home;
