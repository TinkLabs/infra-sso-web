module.exports = {
    load: 'currentOnly',
    fallbackLng: 'en-US',
    lngs: [
        'en-US',
        'zh-TW',
        'zh-CN',
        'ja',
        'it',
        'de',
        'fr',
        'th',
        'pl',
        'es',
        'pt-BR',
        'pt-PT',
        'ru',
        'hu',
        'ar',
        'ko',
    ],
    nsSeparator: false,
    keySeparator: false,
    interpolation: {
        escapeValue: false, // not needed for react!!
    },
    /*全局解决加载的时候显示原英文的问题*/
    react: {
        wait: true,
    },
};