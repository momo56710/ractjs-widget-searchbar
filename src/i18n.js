import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationAR from './Dictionary/ar.json'; // Arabic
import translationEN from './Dictionary/en.json'; //English
import translationSP from './Dictionary/sp.json'; //Spanish
import translationFR from './Dictionary/fr.json'; //Frensh
import translationIT from './Dictionary/it.json'; // Italian
import translationDE from './Dictionary/de.json'; // German
import translationPL from './Dictionary/pl.json'; // Polish
import translationRU from './Dictionary/ru.json'; // Russian
import translationTR from './Dictionary/tr.json'; // Turkish
import translationPT from './Dictionary/pt.json'; // Turkish
const storedLanguage = localStorage.getItem('language'); // Retrieve the stored language from local storage

const resources = {

  en: {
    translation: translationEN
  },
  es: {
    translation: translationSP
  } ,
  fr: {
    translation: translationFR
  },
  it: {
     translation:translationIT
    },
  de: {
     translation:translationDE
    },
  pl: {
     translation:translationPL
    },
  ru: {
     translation:translationRU
    },
  tr: {
     translation:translationTR
    },
  ar: {
     translation:translationAR
    },
    pt: {
        translation:translationPT
       }
};

i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng:  JSON.parse(storedLanguage)?.isoCode || "en", 

    interpolation: {
      escapeValue: false 
    }
  });

  export default i18n;