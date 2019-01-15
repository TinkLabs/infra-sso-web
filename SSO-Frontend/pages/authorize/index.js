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
    passwordIconType: '/static/icons/secret.png'
  }

  static getInitialProps({ query }) {
    const clientId = query.appid
    const request_domain_url = process.env.SERVERURI
    return { clientId, query, request_domain_url }
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

    return errors
  }
  _onSubmit = (values, { setSubmitting, setErrors }) => {
    const { t } = this.props

    setSubmitting(true)

    const axiosInstance = axios.create()
    const handyId = localStorage.getItem('HANDY_ID')
    if (handyId) {
      axiosInstance.defaults.headers = {
        'Devcie-User-Id': localStorage.getItem('HANDY_ID')
      }
    }

    axiosInstance
      .post(this.props.request_domain_url + '/v1/user/login', values)
      .then(({ data: { retCode, retMsg, data } }) => {
        if (retCode !== '200') {
          setErrors({ form: retMsg })
        } else {
          if (data) {
            //登录成功后
            window.location = `?jwt=` + data
          } else {
            setErrors({ form: retMsg })
          }
        }
      })
      .catch(({ response: { data: { retCode, retMsg } } }) => {
        console.log(retCode)
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
        <Header>
          <Trans i18nKey="hi member sign in">
            <div className={styles.header}>
              <i>hi</i> member sign in
            </div>
          </Trans>
        </Header>
        <Content>
          <div className={styles.remark}>
            {t(`Please enter your email address and password:`)}
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
          <Button type="submit" disabled={isSubmitting}>
            {' '}
            {t(`SIGN IN`)}{' '}
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

;`translate.setDefaults({
   wait: true,
 });`
export default translate()(AuthorizePage)
