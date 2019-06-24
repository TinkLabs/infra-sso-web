import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { Container, Content, Footer } from './components/Layout'
import './global.less'
import styles from './styles.less'
import Button from './components/Button'
import Breakline from './components/Breakline'

import classNames from 'classnames';

class IndexPage extends Component {
  static getInitialProps({ query }) {
    const clientId = query.appid
    const ssoError = query.ssoError
    const type = query.type
    const jwt = query.jwt

    //解决ios 中webview 后退时导致环境变量失效
    // console.log(process.env.SERVERURI, '299999 process.env')
    if (!process.env.SERVERURI || !process.env.URL) {
      location.reload()
    }

    const fbLoginUri =
      process.env.SERVERURI +
      `/v1/thirdParty/facebookLogin` +
      `?appid=` +
      clientId +
      `&redirect_uri=${encodeURIComponent(process.env.URL)}`
    const googleLoginUri =
      process.env.SERVERURI +
      `/v1/thirdParty/googleLogin` +
      `?appid=` +
      clientId +
      `&redirect_uri=${encodeURIComponent(process.env.URL)}`
    // const wechatLoginUri = `https://open.weixin.qq.com/connect/qrconnect?appid=wx18e427845d4547fb&redirect_uri=http%3A%2F%2Fhi.com%3Bhandy.travel&response_type=code&scope=snsapi_login&state=a4bf4769cb4a7564e531d8a9f7cd0bc0#wechat_redirect`
    const wechatLoginUri =
      process.env.SERVERURI +
      `/v1/thirdParty/wechatLogin` +
      `?appid=` +
      clientId +
      `&redirect_uri=${encodeURIComponent(process.env.URL)}`

    return {
      clientId,
      fbLoginUri,
      googleLoginUri,
      ssoError,
      jwt,
      wechatLoginUri,
      type
    }
  }

  constructor() {
    super()

    this.state = {
      andriodVersion: ''
    }
  }

  componentDidMount() {

    this.makeMixpanelTrack('SSO Screen View')

    const romVersion = localStorage.getItem('ROM_VERSION') || ''

    this.setState({
      andriodVersion: romVersion
    })
  }

  makeMixpanelTrack = (trackEvent, otherOptions = {}) => {
    if (window.mixpanel) {
      window.mixpanel.track(trackEvent, {
        section: 'sso',
        category: 'index',
        subcategory: 'index',
        screen_name: 'sso_login_index',
        ...otherOptions
      })
    }
  }

  handleFaceBookSign = () => {
    this.makeMixpanelTrack('SSO Social Media Sign Up', {
      sso_method: 'facebook'
    })
    window.location.href = this.props.fbLoginUri
  }

  handleGoogleSign = () => {
    this.makeMixpanelTrack('SSO Social Media Sign Up', {
      sso_method: 'google'
    })
    window.location.href = this.props.googleLoginUri
  }

  handleQuitWebview = () => {
    window.Android.finish()
  }

  renderBackArrow() {
    const romVersion = this.state.andriodVersion
    switch (romVersion) {
      case '7.7.0':
        return null
        break
      case '7.8.0':
        return (
          <div
            className={styles['back-arrow']}
            onClick={this.handleQuitWebview}
          />
        )
        break
      default:
        return null
        break
    }
  }

  render() {
    const { t } = this.props

    // if (this.props.ssoError) {
    //     window.history.clear()
    // }

    if (this.props.ssoError) {
      //用户在fb授权页面时，点击了取消按钮。需要清除history信息
      switch (this.props.type) {
        case 'facebook':
          this.makeMixpanelTrack('SSO Complete', {
            sso_status: 'fail',
            fail_reason: this.props.ssoError,
            sso_method: 'facebook'
          })
          break
        case 'google':
          this.makeMixpanelTrack('SSO Complete', {
            sso_status: 'fail',
            fail_reason: this.props.ssoError,
            sso_method: 'google'
          })
          break
        default:
          break
      }

      if (
        this.props.ssoError === "The code can't be empty, please fill the code"
      ) {
        return (
          <Container>
            <Content>
              <div className={styles.logo}>
                <img src="/static/logo_hiinc.svg" />
              </div>
              <div className={styles.slogan} dangerouslySetInnerHTML={{__html: t('Become a hi member')}} />
              <div className={styles.buttons}>
                <Button
                  className={styles.facebook}
                  // href={this.props.fbLoginUri}
                  onClick={this.handleFaceBookSign}
                >
                  {t(`Continue with Facebook`)}
                </Button>
                <Button
                  className={styles.google}
                  // href={this.props.googleLoginUri}
                  onClick={this.handleGoogleSign}
                >
                  {t(`Continue with Google`)}
                </Button>
                {/*<Button className={styles.wechat} href={this.props.wechatLoginUri}>*/}
                {/*{t(`Sign in with Wechat`)}*/}
                {/*</Button>*/}
                <Breakline>{t(`or`)}</Breakline>
                <Button
                  // className={styles.email}
                  className={classNames([styles.email, 'btn btn-m btn-outlined'])}
                  href={`/register?appid=` + this.props.clientId}
                >
                  {t(`Register using Email`)}
                </Button>
              </div>
              <div>
                <div className={styles.signIn}>
                  {t(`Already have an account?`)}
                  <a href={`/authorize?appid=` + this.props.clientId}>
                    {t(`SIGN IN`)}
                  </a>
                </div>
              </div>
            </Content>
          </Container>
        )
      } else {
        return (
          <Container>
            <Content>
              <div className={styles.slogan}>
                <div className={styles.caption}>{t(this.props.ssoError)}</div>
              </div>
            </Content>
            <Footer>
              <Button
                type="button"
                href={`/index?appid=` + this.props.clientId}
              >
                {t(`login again`)}
              </Button>
            </Footer>
          </Container>
        )
      }
    }

    if (this.props.jwt) {
      return (
        <Container>
          <Content>
            <div className={styles.slogan}>
              {/* loding -> loading */}
              <div className={styles.caption}>{t(`loading......`)}</div>
            </div>
          </Content>
        </Container>
      )
    }

    return (
      <Container>
        {this.renderBackArrow()}
        <Content>
          <div className={styles.logo}>
            <img src="/static/logo_hiinc.svg" />
          </div>
          <div className={styles.slogan} dangerouslySetInnerHTML={{__html: t('Become a hi member')}} />
          <div className={styles.buttons}>
            <Button
              className={styles.facebook}
              // href={this.props.fbLoginUri}
              onClick={this.handleFaceBookSign}
            >
              {t(`Continue with Facebook`)}
            </Button>
            <Button
              className={styles.google}
              // href={this.props.googleLoginUri}
              onClick={this.handleGoogleSign}
            >
              {t(`Continue with Google`)}
            </Button>
            {/*<Button className={styles.wechat} href={this.props.wechatLoginUri}>*/}
            {/*{t(`Sign in with Wechat`)}*/}
            {/*</Button>*/}
            <Breakline>{t(`or`)}</Breakline>
            <Button
              className={classNames([styles.email, 'btn btn-m btn-outlined'])}
              href={`/register?appid=` + this.props.clientId}
            >
              {t(`Register using Email`)}
            </Button>
          </div>
          <div>
            <div className={styles.signIn}>
              {t(`Already have an account?`)}
              <a href={`/authorize?appid=` + this.props.clientId}>
                {t(`SIGN IN`)}
              </a>
            </div>
          </div>
        </Content>
      </Container>
    )
  }
}

export default translate()(IndexPage)
