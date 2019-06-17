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
import Breakline from '../components/Breakline'
import '../global.less'
import styles from './styles.less'

class RegisterQPage extends Component {
  state = {
    submitted: false
  }

  static getInitialProps({ query }) {
    const clientId = query.appid
    const fbLoginUri =
      process.env.SERVERURI +
      `/v1/thirdParty/facebookLogin` +
      `?appid=` +
      clientId +
      `&redirect_uri=${encodeURIComponent(`${process.env.URL}`)}`
    const googleLoginUri =
      process.env.SERVERURI +
      `/v1/thirdParty/googleLogin` +
      `?appid=` +
      clientId +
      `&redirect_uri=${encodeURIComponent(`${process.env.URL}`)}`
    const request_domain_url = process.env.SERVERURI
    return { clientId, fbLoginUri, googleLoginUri, request_domain_url }
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

    if (
      !isEmpty(values.password) &&
      values.password !== values.confirm_password
    ) {
      errors.confirm_password = t(`Password doesn't match.`)
    }

    if (!values.accept_tnc) {
      errors.accept_tnc = t(`Please accept terms and conditions.`)
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
          setErrors({ email: t(`Email has  been used.`) })
        } else if (retCode === '207002') {
          setErrors({ form: t(`No APP ID ,please call customer services`) })
        } else if (retCode === '200012') {
          setErrors({ password: t(`Your password must be at least 8 characters`) })
        } else if (retCode === '200001') {
          setErrors({
            password: t(`The Email length is at least 8 when registering`)
          })
        } else if (retCode === '200002') {
          setErrors({
            password: t(
              `Sorry, the email exceeds the length 64 when registering.`
            )
          })
        } else if (retCode === '200013') {
          setErrors({
            password: t(
              `Your password must contain letters and numbers`
            )
          })
        } else if (retCode === '200051') {
          setErrors({
            password: t(`Failed to send the email when registering.`)
          })
        } else if (retCode === '200022') {
          setErrors({ email: t(`Invalid email when registering.`) })
        } else {
          setErrors({ form: retMsg })
        }
      })
      .finally(() => {
        setSubmitting(false)
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

    if (errors.form) {
      return <Alert>{errors.form}</Alert>
    }

    const { submitted } = this.state

    return (
      <Container component="form" onSubmit={handleSubmit}>
        <Header>
          {!submitted && (
            <Trans i18nKey="Register handy member">
              Register <b>handy</b> member
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
              {t(`and enjoy our premium features`)}
            </div>

            <div className={styles.remark2}>
              {t(`Sign in with social media:`)}
            </div>
            <div className={styles.buttons}>
              <Button
                type="button"
                className={styles.facebook}
                href={this.props.fbLoginUri}
              />
              <Button
                type="button"
                className={styles.google}
                href={this.props.googleLoginUri}
              />
            </div>

            <Breakline>Or register with Email</Breakline>

            <div className={styles.form}>
              <Input
                type="text"
                name="email"
                placeholder="Email address"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                append={
                  <img className={styles.icon} src="/static/icons/email.png" />
                }
                error={touched.email && errors.email}
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
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
                  <img className={styles.icon} src="/static/icons/secret.png" />
                }
                error={touched.password && errors.password}
              />
              <Input
                ref={node => {
                  this.password = node
                }}
                type="password"
                name="confirm_password"
                placeholder="Re-enter password"
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
                  <img className={styles.icon} src="/static/icons/secret.png" />
                }
                error={touched.confirm_password && errors.confirm_password}
              />
              <Checkbox
                name="accept_tnc"
                onChange={handleChange}
                checked={values.accept_tnc}
                error={touched.accept_tnc && errors.accept_tnc}
              >
                {t(
                  `By signing up, I agree to the Terms & Conditions and Privacy Policy.`
                )}
              </Checkbox>
            </div>
          </Content>
        )}
        {submitted && (
          <Content>
            {t(`Now you can access our premium features and get exclusive travel offers..`)}
            {t(
              `You may now continue what you were doing, or visit the My Account page to customize your profile..`
            )}
          </Content>
        )}
        {!submitted ? (
          <Footer>
            <Button type="submit" disabled={isSubmitting}>
              {t(`CREATE ACCOUNT`)}
            </Button>
          </Footer>
        ) : (
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
          jwt: '',
          email: '',
          password: '',
          confirm_password: '',
          accept_tnc: false
        }}
        validate={this._validate}
        onSubmit={this._onSubmit}
        render={this._render}
      />
    )
  }
}

export default translate()(RegisterQPage)
