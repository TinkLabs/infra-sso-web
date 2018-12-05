import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18nConfig from './i18n.config';


const options = {
    ...i18nConfig,
    debug: false,
};


// for browser use xhr backend to load translations and browser lng detector
if (process.browser) {
    i18n
        .use(XHR)
        .use(LanguageDetector)
}


// initialize if not already initialized
if (!i18n.isInitialized) {
    i18n.init(options);
}


// a simple helper to getInitialProps passed on loaded i18n data
i18n.getInitialProps = (req, namespaces) => {
    if (!namespaces) {
        namespaces = i18n.options.defaultNS;
    }

    if (typeof namespaces === 'string') {
        namespaces = [namespaces];
    }

    req.i18n.toJSON = () => null; // do not serialize i18next instance and send to client

    const initialI18nStore = {};
    req.i18n.languages.forEach((l) => {
        initialI18nStore[l] = {};
        namespaces.forEach((ns) => {
            initialI18nStore[l][ns] = (req.i18n.services.resourceStore.data[l] || {})[ns] || {}
        })
    });

    return {
        i18n: req.i18n, // use the instance on req - fixed language on request (avoid issues in race conditions with lngs of different users)
        initialI18nStore,
        initialLanguage: req.i18n.language,
    }
};


export default i18n;