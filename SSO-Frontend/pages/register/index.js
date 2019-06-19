import React, { Component } from 'react'
import { translate, Trans } from 'react-i18next'
import { Formik } from 'formik'
import axios from 'axios'
import isEmail from 'validator/lib/isEmail'
import isEmpty from 'validator/lib/isEmpty'
import { Container, Content, Footer, Header } from '../components/Layout'
import Alert from '../components/Alert'
import Input from '../components/Input'
import Button from '../components/Button'
import Checkbox from '../components/Checkbox'
import CountrySelect from '../components/Select'
import '../global.less'
import styles from './styles.less'

import country from './country.json'

const countryCode = Object.keys(country)
// const countryList = []
// countryCode.forEach(item => {
//   countryList.push({
//     value: item,
//     label: country[item]
//   })
// })

const PAGE_FOR770 = ['112233', '563359', '855612']

class RegisterPage extends Component {
  static getInitialProps({ query }) {
    const clientId = query.appid
    const request_domain_url = process.env.SERVERURI
    return { clientId, request_domain_url }
  }

  constructor(props) {
    super(props)

    const countryList = []
    countryCode.forEach(item => {
      countryList.push({
        value: item,
        label: this.props.t(item)
      })
    })

    this.state = {
      passwordType: 'password',
      passwordIconType: '/static/icons/secret.png',
      confirmPasswordType: 'password',
      confirmPasswordIconType: '/static/icons/secret.png',
      submitted: false,
      countryList,

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
        category: 'sign-up',
        subcategory: 'index',
        screen_name: 'sso_sign-up_index',
        ...otherOptions
      })
    }
  }

  handleLinkSucc = jwtStr => {
    const succUrl = `?jwt=${jwtStr}`
    // alert('1: ' + jwtStr + '2: ' + succUrl)
    window.location.href = succUrl
  }

  handleBackPage = () => {
    window.location.href = `/index?appid=${this.props.clientId}`
  }

  _validate = values => {
    const { t } = this.props

    let errors = {}

    if (PAGE_FOR770.includes(this.props.clientId)) {
      if (isEmpty(values.firstName)) {
        errors.firstName = t('Please enter the first name')
      }

      if (isEmpty(values.lastName)) {
        errors.lastName = t('Please enter the last name')
      }

      if (isEmpty(values.country)) {
        errors.country = t(`Please choose a country`)
      }
    }

    if (!isEmail(values.email)) {
      errors.email = t(`Invalid email address.`)
    }

    if (isEmpty(values.password)) {
      errors.password = t(`Incorrect password.`)
    }

    if (
      !isEmpty(values.password) &&
      values.password !== values.confirm_password
    ) {
      errors.confirm_password = t(`Passwords don't match.`)
    }

    if (!values.accept_tnc) {
      errors.accept_tnc = t(`Please accept terms and conditions`)
    }

    return errors
  }

  _onSubmit = (values, { setSubmitting, setErrors }) => {
    const { t } = this.props
    values.appid = this.props.clientId
    setSubmitting(true)

    const postData = Object.assign({}, values)

    if (PAGE_FOR770.includes(this.props.clientId)) {
      let cityCode
      this.state.countryList.forEach(item => {
        if (item.label === values.country) {
          cityCode = item.value
        }
      })

      postData.profile = {
        firstName: values.firstName,
        lastName: values.lastName,
        country: cityCode
      }

      delete postData.firstName
      delete postData.lastName
      delete postData.country
    }

    const axiosInstance = axios.create()
    const handyId = localStorage.getItem('HANDY_ID')
    if (handyId) {
      axiosInstance.defaults.headers = {
        'Device-User-Id': localStorage.getItem('HANDY_ID')
      }
    }

    axiosInstance
      .post(this.props.request_domain_url + `/v1/user/quickRegister`, postData)
      .then(({ data: { retCode, retMsg, data } }) => {
        if (retCode !== '200') {
          setErrors({ form: retMsg })
        } else {
          if (data) {
            this.makeMixpanelTrack('SSO Complete', {
              sso_status: 'success',
              sso_method: 'email'
            })
            //注册成功后
            this.setState({ submitted: true })
            values.jwt = data
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
        this.makeMixpanelTrack('SSO Complete', {
          sso_status: 'fail',
          fail_reason: retMsg || '',
          sso_method: 'email'
        })
        setSubmitting(false)
        if (retCode === '200023') {
          setErrors({ email: t(`Email has  been used`) })
        } else if (retCode === '207002') {
          setErrors({ form: t(`No APP ID ,please call customer services`) })
        } else if (retCode === '200012') {
          setErrors({ password: t(`Your password must be at least 8 characters`) })
        } else if (retCode === '200001') {
          setErrors({
            email: t(`The Email length is at least 8 when registering`)
          })
        } else if (retCode === '200002') {
          setErrors({
            email: t(`Sorry, the email exceeds the length 64 when registering`)
          })
        } else if (retCode === '200013') {
          setErrors({
            password: t(
              `Passwords must contain letters & digits.`
            )
          })
        } else if (retCode === '200051') {
          setErrors({ form: t(`Failed to send the email when registering`) })
        } else if (retCode === '200003') {
          setErrors({
            email: t(
              `The username only can contains the letters, numbers when registering`
            )
          })
        } else if (retCode === '200022') {
          setErrors({ email: t(`Invalid email when registering`) })
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
    setFieldValue,
    handleSubmit,
    isSubmitting
  }) => {
    const { t } = this.props
    const { passwordType } = this.state
    const { passwordIconType } = this.state
    const { confirmPasswordType } = this.state
    const { confirmPasswordIconType } = this.state

    if (errors.form) {
      return <Alert>{errors.form}</Alert>
    }

    const { submitted, countryList } = this.state

    return (
      <Container component="form" onSubmit={handleSubmit}>
        {this.renderBackArrow()}
        <Header>
          {!submitted && (
            <Trans i18nKey="Create an account">

              {/* i18nKey="Create an account" */}

              <div className={styles.header}>
                Register for <i>hi</i> membership
              </div>
            </Trans>
          )}
          {submitted && (
            <div className={styles.logo}>
              <img src="/static/logo_hiinc.svg" />
            </div>
          )}
          {submitted && (
            <Trans i18nKey="Thank you for joining hi">
              Thank you for becoming a <b>hi</b> member!
            </Trans>
          )}
        </Header>
        {!submitted && (
          <Content>
            <div className={styles.remark}>
              {t(`Become a hi member and get access to premium features.`)}
            </div>
            <div className={styles.form}>
              {PAGE_FOR770.includes(this.props.clientId) ? (
                <Input
                  type="text"
                  name="firstName"
                  placeholder={t(`first name`)}
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoCapitalize="off"
                  autoCorrect="off"
                  append={
                    <img className={styles.icon} src="/static/icons/user.png" />
                  }
                  autoComplete="off"
                  error={touched.firstName && errors.firstName}
                />
              ) : null}
              {PAGE_FOR770.includes(this.props.clientId) ? (
                <Input
                  type="text"
                  name="lastName"
                  placeholder={t(`last name`)}
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  append={
                    <img className={styles.icon} src="/static/icons/user.png" />
                  }
                  error={touched.lastName && errors.lastName}
                />
              ) : null}
              <Input
                type="text"
                name="email"
                placeholder={t("Email address")}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
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
                autoComplete="off"
                append={
                  <img
                    className={styles.icon}
                    src="/static/icons/password.png"
                  />
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
              <Input
                type={confirmPasswordType}
                name="confirm_password"
                placeholder={t(`Re-enter password`)}
                value={values.confirm_password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                append={
                  <img
                    className={styles.icon}
                    src="/static/icons/password.png"
                  />
                }
                prepend={
                  <img
                    className={styles.icon}
                    onClick={() =>
                      this._onTogglePassword(
                        'confirmPasswordType',
                        'confirmPasswordIconType'
                      )
                    }
                    src={confirmPasswordIconType}
                  />
                }
                error={touched.confirm_password && errors.confirm_password}
              />
              {PAGE_FOR770.includes(this.props.clientId) ? (
                <div style={{ marginBottom: '32px' }}>
                  <CountrySelect
                    value={values.country}
                    countryList={countryList}
                    placeholder={t(`country of origin`)}
                    notFound={t(`no country data`)}
                    onChange={setFieldValue}
                    onBlur={handleBlur}
                    append={
                      <img
                        className={styles.icon}
                        src="/static/icons/globe.png"
                      />
                    }
                    prepend={
                      <img
                        className={styles.icon}
                        src="/static/icons/noun_dropdown.png"
                      />
                    }
                    error={touched.country && errors.country}
                  />
                </div>
              ) : null}
              <div style={{ position: 'relative' }}>
                <Checkbox
                  name="accept_tnc"
                  onChange={handleChange}
                  checked={values.accept_tnc}
                  error={touched.accept_tnc && errors.accept_tnc}
                />
                <div className={styles.privacyTips}>
                <Trans i18nKey="By signing up, I agree to the Terms & Conditions">
                  By signing up, I agree to the 
                  <a
                    style={{
                      color: '#c19a53',
                      textDecoration: 'underline',
                      display: 'contents'
                    }}
                    href="https://www.hiinc.com/terms-and-privacy-policy"
                  >
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a
                    style={{
                      color: '#c19a53',
                      textDecoration: 'underline'
                    }}
                    href="https://www.hiinc.com/terms-and-privacy-policy"
                  >
                    Privacy Policy
                  </a>
                </Trans>
                  {/* {t(`By signing up, I agree to the `)}{' '}
                  <a
                    style={{
                      color: '#c19a53',
                      textDecoration: 'underline',
                      display: 'contents'
                    }}
                    href="https://www.hiinc.com/terms-and-privacy-policy"
                  >
                    {t(`Terms & Conditions`)}
                  </a>{' '}
                  {t(`and`)}{' '}
                  <a
                    style={{
                      color: '#c19a53',
                      textDecoration: 'underline'
                    }}
                    href="https://www.hiinc.com/terms-and-privacy-policy"
                  >
                    {t(`Privacy Policy`)}
                  </a> */}
                </div>
              </div>
            </div>
          </Content>
        )}
        {submitted && (
          // <Content>
            // <div className={styles.slogan} dangerouslySetInnerHTML={{__html: t('Become a hi member')}} />
            <div dangerouslySetInnerHTML={{__html: t(`Now you can access our premium features and get exclusive travel offers.`)}} />
          // </Content>
        )}
        {!submitted && (
          <Footer className="register-submit">
            <Button type="submit" disabled={isSubmitting}>
              {t(`Create Account`)}
            </Button>
          </Footer>
        )}
        {submitted && (
          <Footer className="toBottom">
            {/* <Button type="button" href={`?jwt=` + values.jwt} */}
            <Button
              type="button"
              onClick={() => this.handleLinkSucc(values.jwt)}
            >
              {t(`COMPLETE`)}
            </Button>
          </Footer>
        )}
      </Container>
    )
  }

  render() {
    return (
      <Formik
        initialValues={{
          appid: '',
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirm_password: '',
          country: '',
          accept_tnc: false,
          jwt: ''
        }}
        validate={this._validate}
        onSubmit={this._onSubmit}
        render={this._render}
      />
    )
  }
}

export default translate()(RegisterPage)
