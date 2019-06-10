import React, { Component } from 'react'
import { translate } from 'react-i18next'
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

class ForgotPasswordPage extends Component {
  state = {
    submitted: 0,
    passwordType: 'password',
    passwordIconType: '/static/icons/secret.png',
    confirmPasswordType: 'password',
    confirmPasswordIconType: '/static/icons/secret.png',

    andriodVersion: ''
  }

  static getInitialProps({ query }) {
    const clientId = query.appid

    const request_domain_url = process.env.SERVERURI
    return { clientId, request_domain_url }
  }

  componentDidMount() {
    this.makeMixpanelTrack('SSO Screen View', {
      category: 'forgot-password',
      screen_name: 'sso_forgot-password_index'
    })

    const romVersion = localStorage.getItem('ROM_VERSION') || ''
    this.setState({
      andriodVersion: romVersion
    })
  }

  makeMixpanelTrack = (trackEvent, otherOptions = {}) => {
    if (window.mixpanel) {
      window.mixpanel.track(trackEvent, {
        section: 'sso',
        subcategory: 'index',
        ...otherOptions
      })
    }
  }

  // updateToken 只能使用一次，故直接跳回邮箱输入状态。
  handleBackPage = () => {
    switch (this.state.submitted) {
      case 0:
        window.location.href = `/authorize?appid=${this.props.clientId}`
        break
      case 1:
      case 2:
        this.setState({
          submitted: 0
        })
        break
      default:
        window.location.href = `/authorize?appid=${this.props.clientId}`
        break
    }
  }

  _validate = values => {
    const { t } = this.props

    let errors = {}

    if (!isEmail(values.email)) {
      errors.email = t(`Invalid email address.`)
    }

    if (this.state.submitted >= 1) {
      if (values.code.length === 4) {
      } else {
        errors.code = t(`Please enter an valid code`)
      }
    }
    if (this.state.submitted >= 2) {
      if (isEmpty(values.password)) {
        errors.password = t(`Incorrect password.`)
      }

      if (isEmpty(values.confirm_password)) {
        errors.confirm_password = t(`Please enter the confirm password`)
      }

      if (
        !isEmpty(values.password) &&
        !isEmpty(values.confirm_password) &&
        values.password !== values.confirm_password
      ) {
        errors.confirm_password = t(`Password do not match`)
      }
    }

    return errors
  }

  _onSubmit = (values, { setSubmitting, setErrors }) => {
    const { t } = this.props

    values.appid = this.props.clientId // this just for demo.
    values.value = values.email
    values.verificationType = 'email'
    values.useType = '2'

    if (this.state.submitted === 0) {
      setSubmitting(true)

      axios
        .post(
          this.props.request_domain_url + '/v1/service/sendVerificationCode',
          values
        )
        .then(({ data: { retCode, retMsg, data } }) => {
          if (retCode !== '200') {
            setErrors({ form: retMsg })
          } else {
            this.setState({ submitted: 1 }, () => {
              this.makeMixpanelTrack('SSO Screen View', {
                category: 'verify-password-reset-code',
                screen_name: 'sso-verify-password-reset-code-index'
              })
            })
            setSubmitting(false)
          }
        })
        .catch(({ response: { data: { retCode, retMsg } } }) => {
          // console.log(retCode)
          if (retCode === '202004') {
            setErrors({ email: t(`Email is not registered`) })
          } else if (retCode === '203041') {
            setErrors({
              password: t(
                `Failed to send verification code email when sending verification code`
              )
            })
          } else if (retCode === '207002') {
            setErrors({ form: t(`No APP ID ,please call customer services`) })
          } else if (retCode === '203012') {
            setErrors({
              email: t(
                `The email is not existed when sending verification code, please register firstly`
              )
            })
          } else {
            setErrors({ form: retMsg })
          }
        })
        .finally(() => {
          setSubmitting(false)
        })
    }

    //verify code
    if (this.state.submitted === 1) {
      setSubmitting(true)
      values.type = '1'
      values.username = values.email
      values.verificationCode = values.code
      axios
        .post(this.props.request_domain_url + '/v1/user/updatePwdToken', values)
        .then(({ data: { retCode, retMsg, data } }) => {
          if (retCode !== '200') {
            setErrors({ code: retMsg })
          } else {
            values.updatePwdToken = data.updatePwdToken

            this.setState({ submitted: 2 }, () => {
              this.makeMixpanelTrack('SSO Screen View', {
                category: 'reset-password',
                screen_name: 'sso-reset-password-index'
              })
              this._setTouched({
                fields: { password: false, confirm_password: false }
              })
            })
            setSubmitting(false)
          }
        })
        .catch(({ response: { data: { retCode, retMsg } } }) => {
          if (retCode === '202009') {
            setErrors({ code: t(`Please enter an valid code`) })
          } else if (retCode === '207002') {
            setErrors({ form: t(`No APP ID ,please call customer services`) })
          } else if (retCode === '202004') {
            setErrors({ code: t(`Email is not registered.`) })
          } else if (retCode === '202005') {
            setErrors({
              code: t(
                `oldPassword is invalid, please fill in the correct oldPassword`
              )
            })
          } else if (retCode === '202006') {
            setErrors({
              code: t(
                `Sorry, This newPassword no change, please fill in the newPassword`
              )
            })
          } else if (retCode === '202009') {
            setErrors({ code: t(`Sorry, verification code verified failed`) })
          } else if (retCode === '202012') {
            setErrors({
              code: t(
                `you has not set security problem，please select other type`
              )
            })
          } else if (retCode === '202007') {
            setErrors({
              code: t(
                `The phone type Temporarily not supported , please correct type`
              )
            })
          } else if (retCode === '202008') {
            setErrors({ code: t(`The type incorrect , please correct type`) })
          } else {
            setErrors({ form: retMsg })
          }
        })
        .finally(() => {
          setSubmitting(false)
        })
    }
    //reset password
    if (this.state.submitted === 2) {
      setSubmitting(true)
      values.newPassword = values.password
      axios
        .post(this.props.request_domain_url + '/v1/user/resetPwd', values)
        .then(({ data: { retCode, retMsg, data } }) => {
          //return app.render(req, res, '/', req.query);
          // window.location = '/authorize';
          if (retCode !== '200') {
            setErrors({ password: retMsg })
            setErrors({ confirm_password: retMsg })
          } else {
            this.makeMixpanelTrack('SSO Screen View', {
              category: 'password-reset-success',
              screen_name: 'sso-password-reset-success-index'
            })

            this.setState({ submitted: 3 })
          }
        })
        .catch(({ response: { data: { retCode, retMsg } } }) => {
          if (retCode === '207002') {
            setErrors({ form: t(`No APP ID ,please call customer services`) })
          } else if (retCode === '202004') {
            setErrors({ form: t(`Email is not registered`) })
          } else if (retCode === '200012') {
            setErrors({ password: t(`Your password must be at least 8 characters`) })
            setErrors({
              confirm_password: t(`Your password must be at least 8 characters`)
            })
          } else if (retCode === '202014') {
            setErrors({
              password: t(
                `Sorry, new password MUST contain the letter and digits.`
              )
            })
          } else {
            setErrors({ form: retMsg })
          }
        })
        .finally(() => {
          setSubmitting(false)
        })
    }
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
    isSubmitting,
    setTouched
  }) => {
    const { t } = this.props

    const { passwordType } = this.state
    const { passwordIconType } = this.state
    const { confirmPasswordType } = this.state
    const { confirmPasswordIconType } = this.state

    if (errors.form) {
      return <Alert>{errors.form}</Alert>
    }

    this._setTouched = setTouched

    const { submitted } = this.state

    return (
      <Container component="form" onSubmit={handleSubmit}>
        {[0, 1].includes(submitted) ? this.renderBackArrow() : null}
        <Header>
          {submitted === 0 && <span>{t(`Forgot Password`)}</span>}
          {submitted === 1 && (
            <span>{t(`Reset password Code has been sent`)}</span>
          )}
          {submitted === 2 && (
            <span>{t(`Please input your new Password`)}</span>
          )}
          {submitted === 3 && (
              <div className="forget-pw-logo-wrapper">
                <span className="logo icon icon-general_check_circle_24px"></span>
              </div>
          )}
          {submitted === 3 && <span>{t(`Your password has been reset `)}</span>}
        </Header>
        <Content>
          {submitted === 0 && (
            <div className={styles.remark}>
              {t(
                `Continue to receive a password reset code.`
              )}
            </div>
          )}
          {submitted === 1 && (
            <div className={styles.remark}>
              {t(`Please input the reset password Code which received`)}
            </div>
          )}
          {submitted === 2 && (
            <div className={styles.remark}>
              {t(
                `After reset your password ,you will be redirect to Login page and login again`
              )}
            </div>
          )}
          {submitted === 3 && (
            <div className={styles.remark}>
              {t(
                `Your password for hi member has been successfully reset. Please sign in with new password to continue using handy, or visit My Account to edit your personal profile`
              )}
            </div>
          )}

          <div className={styles.form}>
            {submitted === 0 && (
              <Input
                type="text"
                name="email"
                placeholder={t(`email address`)}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                append={
                  <img className={styles.icon} src="/static/icons/email.png" />
                }
                error={touched.email && errors.email}
                autoComplete="off"
              />
            )}

            {submitted === 1 && (
              <Input
                type="text"
                name="code"
                placeholder={t(`Verification Code`)}
                value={values.code}
                onChange={handleChange}
                onBlur={handleBlur}
                append={
                  <img className={styles.icon} src="/static/icons/email.png" />
                }
                error={touched.code && errors.code}
              />
            )}

            {submitted === 2 && (
              <Input
                type={passwordType}
                name="password"
                placeholder={t(`Password`)}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
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
            )}
            {submitted === 2 && (
              <Input
                type={confirmPasswordType}
                name="confirm_password"
                placeholder={t(`Confirm Password`)}
                value={values.confirm_password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoFocus={false}
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
            )}
          </div>
        </Content>
        {/*{submitted===3 && <Content>*/}
        {/*{t(`An e-mail with the reset password link has been sent to:`)}*/}
        {/*<br/><br/><br/><br/>*/}
        {/*{values.email}*/}
        {/*<br/><br/><br/><br/>*/}
        {/*{t(`Please check your email for further reset password instructions. The reset password link will expire in 24 hours for security reasons.`)}*/}
        {/*<br/><br/><br/><br/>*/}
        {/*</Content>}*/}
        {submitted === 0 && (
          <Footer className="forget-pw-get-code">
            <Button type="submit" disabled={isSubmitting}
              className="btn btn-navy btn-m btn-contained">
              {t(`SEND ME THE CODE`)}
            </Button>
          </Footer>
        )}
        {submitted === 1 && (
          <Footer className="forget-pw-submit-code">
            <Button type="submit" disabled={isSubmitting}
              className="btn btn-navy btn-m btn-contained">
              {t(`VERIFY ME THE CODE`)}
            </Button>
          </Footer>
        )}
        {submitted === 2 && (
          <Footer className="forget-pw-submit-code">
            <Button type="submit" disabled={isSubmitting}
              className="btn btn-navy btn-m btn-contained">
              {t(`RESET PASSWORD`)}
            </Button>
          </Footer>
        )}
        {submitted === 3 && (
          <Footer className="toBottom">
            <Button type="button" href={`/authorize?appid=` + values.appid}
              className="btn btn-navy btn-m btn-contained">
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
          email: '',
          code: '',
          password: '',
          confirm_password: ''
        }}
        isInitialValid={false}
        validate={this._validate}
        onSubmit={this._onSubmit}
        render={this._render}
      />
    )
  }
}

export default translate()(ForgotPasswordPage)
