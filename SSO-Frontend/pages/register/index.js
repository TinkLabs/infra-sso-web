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
import '../global.less'
import styles from './styles.less'

class RegisterPage extends Component {
  state = {
    passwordType: 'password',
    passwordIconType: '/static/icons/secret.png',
    confirmPasswordType: 'password',
    confirmPasswordIconType: '/static/icons/secret.png',
    submitted: false
  }
  static getInitialProps({ query }) {
    const clientId = query.appid
    const request_domain_url = process.env.SERVERURI
    return { clientId, request_domain_url }
  }

  _validate = values => {
    const { t } = this.props

    let errors = {}

    if (!isEmail(values.email)) {
      errors.email = t(`Please enter an valid email`)
    }

    if (isEmpty(values.password)) {
      errors.password = t(`Please enter the password`)
    }

    if (
      !isEmpty(values.password) &&
      values.password !== values.confirm_password
    ) {
      errors.confirm_password = t(`Password do not match`)
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

    axios
      .post(this.props.request_domain_url + `/v1/user/quickRegister`, values)
      .then(({ data: { retCode, retMsg, data } }) => {
        if (retCode !== '200') {
          setErrors({ form: retMsg })
        } else {
          if (data) {
            //注册成功后
            this.setState({ submitted: true })
            values.jwt = data
          } else {
            setErrors({ form: retMsg })
          }
        }
      })
      .catch(({ response: { data: { retCode, retMsg } } }) => {
        if (retCode === '200023') {
          setErrors({ email: t(`Email has  been used`) })
        } else if (retCode === '207002') {
          setErrors({ form: t(`No APP ID ,please call customer services`) })
        } else if (retCode === '200012') {
          setErrors({ password: t(`Password length is at least at 8`) })
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
              `Password is too simple, it MUST contain the uppercase and lowercase letters, numbers when registering`
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
    const { confirmPasswordType } = this.state
    const { confirmPasswordIconType } = this.state

    if (errors.form) {
      return <Alert>{errors.form}</Alert>
    }

    const { submitted } = this.state

    return (
      <Container component="form" onSubmit={handleSubmit}>
        <Header>
          {!submitted && (
            <Trans i18nKey="Register for hi membership">
              <div className={styles.header}>
                Register for <i>hi</i> membership
              </div>
            </Trans>
          )}
          {submitted && (
            <Trans i18nKey="Thank you for joining handy member!">
              Thank you for joining <b>handy</b> member!
            </Trans>
          )}
        </Header>
        {!submitted && (
          <Content>
            <div className={styles.remark}>
              {t(`Please enter your email address and set your password:`)}
            </div>
            <div className={styles.form}>
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
              />
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
              <Input
                type={confirmPasswordType}
                name="confirm_password"
                placeholder={t(`Confirm Password`)}
                value={values.confirm_password}
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
              <div style={{ display: 'flex' }}>
                <Checkbox
                  name="accept_tnc"
                  onChange={handleChange}
                  checked={values.accept_tnc}
                  error={touched.accept_tnc && errors.accept_tnc}
                />
                <div>
                  {t(`By signing up, I agree to handy’s`)}{' '}
                  <a
                    style={{
                      color: '#cba052',
                      textDecoration: 'none',
                      display: 'contents'
                    }}
                    href="https://www.handy.travel/handy-device-terms-and-policy"
                  >
                    {t(`Terms & Conditions`)}
                  </a>{' '}
                  {t(`and`)}{' '}
                  <a
                    style={{ color: '#cba052', textDecoration: 'none' }}
                    href="https://www.handy.travel/handy-device-terms-and-policy"
                  >
                    {t(`Privacy Policy`)}
                  </a>
                </div>
              </div>
            </div>
          </Content>
        )}
        {submitted && (
          <Content>
            {t(`Now you can access our premium features`)}
            {t(
              `You can continue on what you were doing, or visit My Account page to customise your profile`
            )}
          </Content>
        )}
        {!submitted && (
          <Footer>
            <Button type="submit" disabled={isSubmitting}>
              {t(`CREATE ACCOUNT`)}
            </Button>
          </Footer>
        )}
        {submitted && (
          <Footer>
            <Button type="button" href={`?jwt=` + values.jwt}>
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
          email: '',
          password: '',
          confirm_password: '',
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
