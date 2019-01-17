import React from 'react'
import App, { Container } from 'next/app'
import { I18nextProvider } from 'react-i18next'
import initialI18nInstance from '../i18n'

import mixpanel from 'mixpanel-browser'

export default class MyApp extends App {
  componentDidMount() {
    mixpanel.init('6c29862add298fba05d9fd796a51e441')

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
    if (globalProperties) {
      globalProperties = JSON.parse(globalProperties)

      mixpanel.register({
        ...globalProperties
      })
    } else {
      globalProperties = {}
    }
    window.mixpanel = mixpanel
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
