import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import isEmail from 'validator/lib/isEmail'
import isEmpty from 'validator/lib/isEmpty'
import axios from 'axios'
import { Formik } from 'formik'
import { Container, Content, Footer, Header } from '../components/Layout'
import Alert from '../components/Alert'
import Input from '../components/Input'
import Button from '../components/Button'
import '../global.less'
import styles from './styles.less'

class AuthorizePage extends Component {
  state = {
    passwordType: 'password',
    passwordIconType: '/static/icons/secret.png',

    andriodVersion: ''
  }

  static getInitialProps({ query }) {
    const clientId = query.appid
    const request_domain_url = process.env.SERVERURI
    return { clientId, query, request_domain_url }
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
        category: 'login',
        subcategory: 'index',
        screen_name: 'sso_login_index',
        ...otherOptions
      })
    }
  }

  handleBackPage = () => {
    window.location.href = `/index?appid=${this.props.clientId}`
  }

  _validate = values => {
    const { t } = this.props

    let errors = {}

    if (!isEmail(values.email)) {
      errors.email = t(`Invalid email address.`)
    }

    if (isEmpty(values.password)) {
      errors.password = t(`Incorrect password.`)
    }

    return errors
  }
  _onSubmit = (values, { setSubmitting, setErrors }) => {
    const { t } = this.props

    setSubmitting(true)

    const axiosInstance = axios.create()
    const handyId = localStorage.getItem('HANDY_ID')
    if (handyId) {
      axiosInstance.defaults.headers = {
        'Device-User-Id': localStorage.getItem('HANDY_ID')
      }
    }

    axiosInstance
      .post(this.props.request_domain_url + '/v2/user/login', values)
      .then(({ data: { retCode, retMsg, data } }) => {
        if (retCode !== '200') {
          setErrors({ form: retMsg })
        } else {
          if (data) {
            this.makeMixpanelTrack('SSO Complete', {
              sso_status: 'success',
              sso_method: 'email'
            })
            //登录成功后
            window.location.href = `?jwt=` + data.jwt
          } else {
            this.makeMixpanelTrack('SSO Complete', {
              sso_status: 'fail',
              fail_reason: retMsg || '',
              sso_method: 'email'
            })
            setErrors({ form: retMsg })
          }
        }
      })
      .catch(({ response: { data: { retCode, retMsg } } }) => {
        // console.log(retCode)
        this.makeMixpanelTrack('SSO Complete', {
          sso_status: 'fail',
          fail_reason: retMsg || '',
          sso_method: 'email'
        })
        if (retCode === '201012') {
          setErrors({ password: t(`The password is not correct`) })
        } else if (retCode === '207002') {
          setErrors({ form: t(`No APP ID ,please call customer services`) })
        } else if (retCode === '201001') {
          setErrors({
            email: t(`Sorry, the email is not existed, please register firstly`)
          })
        } else if (retCode === '201013') {
          setErrors({
            email: t(`Duplicated account, please contact the administrator`)
          })
        } else {
          setErrors({ form: retMsg })
        }
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  _onTogglePassword = (target, icon) => {
    this.setState(prev => {
      return {
        [target]: prev[target] === 'text' ? 'password' : 'text',

        [icon]:
          prev[icon] === '/static/icons/secret.png'
            ? '/static/icons/nosecret.png'
            : '/static/icons/secret.png'
      }
    })
  }

  renderBackArrow() {
    const romVersion = this.state.andriodVersion

    switch (romVersion) {
      case '7.7.0':
        return null
        break
      case '7.8.0':
        return (
          <div className={styles['back-row']}>
            <div
              className={styles['back-arrow']}
              onClick={this.handleBackPage}
            />
          </div>
        )
        break
      default:
        return null
        break
    }
  }

  _render = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
  }) => {
    const { t } = this.props
    const { passwordType } = this.state
    const { passwordIconType } = this.state

    if (errors.form) {
      return <Alert>{errors.form}</Alert>
    }

    return (
      <Container component="form" onSubmit={handleSubmit}>
        {this.renderBackArrow()}

        {/* <Header>
          <Trans i18nKey="hi member sign in">
            <div className={styles.header}>
              <i>hi</i> member sign in
            </div>
          </Trans>
        </Header> */}

        <Content>

          {/* <div className={styles.remark}>
            {t(`Please enter your email address and password:`)}
          </div> */}

          <div className={styles.form}>
            <Input
              type="text"
              name="email"
              placeholder={t('Email address')}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              append={
                <img className={styles.icon} src="/static/icons/email.png" />
              }
              error={touched.email && errors.email}
            />
            <Input
              type={passwordType}
              name="password"
              placeholder={t(`Password`)}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              append={
                <img className={styles.icon} src="/static/icons/password.png" />
              }
              prepend={
                <img
                  className={styles.icon}
                  onClick={() =>
                    this._onTogglePassword('passwordType', 'passwordIconType')
                  }
                  src={passwordIconType}
                />
              }
              error={touched.password && errors.password}
            />
            <div className={styles.forgotPassword}>
              <a href={`/forgot_password?appid=` + this.props.clientId}>
                {t(`Forgot password?`)}
              </a>
            </div>
          </div>
        </Content>
        <Footer>
          <Button type="submit" disabled={isSubmitting}
            className="btn btn-navy btn-m btn-contained">
            {' '}
            {t(`Continue`)}{' '}
          </Button>
        </Footer>
      </Container>
    )
  }

  render() {
    return (
      <Formik
        initialValues={{
          ...this.props.query,
          response_type: 'code',
          email: '',
          password: ''
        }}
        validate={this._validate}
        onSubmit={this._onSubmit}
        render={this._render}
      />
    )
  }
}

; `translate.setDefaults({
   wait: true,
 });`
export default translate()(AuthorizePage)
