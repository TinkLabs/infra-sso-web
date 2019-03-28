import React from 'react'
import App, { Container } from 'next/app'
import { I18nextProvider } from 'react-i18next'
import initialI18nInstance from '../i18n'

import mixpanel from 'mixpanel-browser'

export default class MyApp extends App {
  componentDidMount() {
    mixpanel.init('6c29862add298fba05d9fd796a51e441')
    // const userAgent = this.getBrowserInfo()

    if (window.Android) {
      // register mixpanle
      this.registerMixpanle()
    } else {
      document.addEventListener(
        'Android',
        function() {
          this.registerMixpanle()
        },
        false
      )
    }
  }

  registerMixpanle = () => {
    let globalProperties = window.Android.getGlobalProperties()
    alert('globalProperties: ' + globalProperties)

    if (globalProperties) {
      globalProperties = JSON.parse(globalProperties)

      const { device_user_id, rom_version } = globalProperties
      localStorage.setItem('HANDY_ID', device_user_id)

      // 获取 rom_version
      if (rom_version) {
        const romVersion = rom_version.substr(0, 5)
        localStorage.setItem('ROM_VERSION', romVersion)
      }

      mixpanel.register({
        ...globalProperties
      })
      mixpanel.identify(device_user_id)
    } else {
      globalProperties = {}
    }
    window.mixpanel = mixpanel
  }

  getBrowserInfo = () => {
    var agent = navigator.userAgent.toLowerCase()

    var regStr_ie = /msie [\d.]+;/gi
    var regStr_ff = /firefox\/[\d.]+/gi
    var regStr_chrome = /chrome\/[\d.]+/gi
    var regStr_saf = /safari\/[\d.]+/gi

    //IE
    if (agent.indexOf('msie') > 0) {
      return agent.match(regStr_ie)
    }

    //firefox
    if (agent.indexOf('firefox') > 0) {
      return agent.match(regStr_ff)
    }

    //Chrome
    if (agent.indexOf('chrome') > 0) {
      return agent.match(regStr_chrome)
    }

    //Safari
    if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
      return agent.match(regStr_saf)
    }
  }

  render() {
    const { Component, pageProps } = this.props
    const { i18n, initialI18nStore, initialLanguage } = pageProps || {}

    return (
      <Container>
        <I18nextProvider
          i18n={i18n || initialI18nInstance}
          initialI18nStore={initialI18nStore}
          initialLanguage={initialLanguage}
        >
          <Component {...pageProps} />
        </I18nextProvider>
      </Container>
    )
  }
}
