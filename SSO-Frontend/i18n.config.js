module.exports = {
  load: 'currentOnly',
  fallbackLng: 'zh-HK',
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
    'ko'
  ],
  nsSeparator: false,
  keySeparator: false,
  interpolation: {
    escapeValue: false // not needed for react!!
  },
  // detection: {
  //   order: ['querystring' /*'session', 'path', 'session', 'querystring1', */, 'cookie'],
  //   // lookupQuerystring1: 'locale',
  //   lookupQuerystring: 'lng'
  // },
  /*全局解决加载的时候显示原英文的问题*/
  react: {
    wait: true
  }
}
