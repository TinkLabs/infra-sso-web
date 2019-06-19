import React, { Component } from 'react'
import { translate } from 'react-i18next'
import isEmpty from 'validator/lib/isEmpty'
import axios from 'axios'
import { Formik } from 'formik'
import ResetTokenNotExistError from '../../errors/ResetTokenNotExistError'
import { Container, Content, Footer, Header } from '../components/Layout'
import Alert from '../components/Alert'
import Input from '../components/Input'
import Button from '../components/Button'
import '../global.less'
import styles from './styles.less'

class ResetPasswordPage extends Component {
  state = {
    submitted: false
  }

  componentDidMount() {
    this.makeMixpanelTrack('SSO Screen View', {
      category: 'forgot-password',
      screen_name: 'sso_forgot-password_index'
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

  _validate = values => {
    const { t } = this.props

    let errors = {}

    if (isEmpty(values.password)) {
      errors.password = t(`Incorrect password.`)
    }

    if (
      !isEmpty(values.password) &&
      values.password !== values.confirm_password
    ) {
      errors.confirm_password = t(`Password do not match.`)
    }

    return errors
  }

  _onSubmit = (values, { setSubmitting, setErrors }) => {
    const { t } = this.props

    setSubmitting(true)
    axios
      .post('/member/reset_password', values)
      .then(() => {
        this.setState({ submitted: true })
      })
      .catch(({ response: { data: { message, name } } }) => {
        if (name === 'ResetTokenNotExistError') {
          setErrors({ form: t(`Reset Password Link is expired.`) })
        } else {
          setErrors({ form: message })
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
          {!submitted && <span>{t(`Reset Password`)}</span>}
          {submitted && <span>{t(`Password reset successfully`)}</span>}
        </Header>
        {!submitted && (
          <Content>
            <div className={styles.remark}>
              {t(
                `Please enter your new password to reset and access your account:`
              )}
            </div>
            <div className={styles.form}>
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
            </div>
          </Content>
        )}
        {submitted && (
          <Content>
            {t(`Your password for handy member has been successfully reset.`)}
          </Content>
        )}
        {!submitted && (
          <Footer>
            <Button type="submit" disabled={isSubmitting}>
              {t(`Reset Password`)}
            </Button>
          </Footer>
        )}
      </Container>
    )
  }

  static getInitialProps({ query }) {
    return { query }
  }

  render() {
    return (
      <Formik
        initialValues={{
          ...this.props.query,
          password: '',
          confirm_password: ''
        }}
        validate={this._validate}
        onSubmit={this._onSubmit}
        render={this._render}
      />
    )
  }
}

export default translate()(ResetPasswordPage)
