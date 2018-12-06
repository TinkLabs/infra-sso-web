import React, {Component} from 'react';
import {Trans, translate} from 'react-i18next';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import axios from 'axios';
import {Formik} from 'formik';
import {Container, Content, Footer, Header} from '../components/Layout';
import Alert from '../components/Alert';
import Input from '../components/Input';
import Button from '../components/Button';
import '../global.less';
import styles from './styles.less';


class AuthorizePage extends Component {
    static getInitialProps({query}) {
        const clientId = query.appid;;
        return {clientId,query};
    }

    _validate = (values) => {
        const {t} = this.props;

        let errors = {};

        if (!isEmail(values.email)) {
            errors.email = t(`Please enter an valid email.`);
        }

        if (isEmpty(values.password)) {
            errors.password = t(`Please enter the password.`);
        }

        return errors;
    };
    _onSubmit = (values, {setSubmitting, setErrors}) => {
        const {t} = this.props;

        setSubmitting(true);
        axios.post('https://sso-uat.handytravel.tech/v1/user/login', values)
            .then(({data: {data}}) => {
                window.location = `${process.env.URL}?jwt=`+data;
                //window.location = `http://10.0.2.176:4000/?jwt=`+data;
                //app.render(req, res, '/', req.query);
                //登录成功后
                //console.log(data);

                // this data should be the token .
                
            })
            .catch(({response: {data: {retCode, retMsg}}}) => {
                console.log(retCode);
                if (retCode === '201012') {
                    setErrors({password: t(`The password is not correct.`)});
                } else if (retCode === '207002') {
                    setErrors({password: t(`No APP ID ,please call customer services.`)});
                } else if (retCode === '201001') {
                    setErrors({password: t(`Sorry, the email is not existed, please register firstly.`)});
                } else if (retCode === '201013') {
                    setErrors({password: t(`Duplicated account, please contact the administrator`)});
                } else{
                    setErrors({form: retMsg});
                }
            })
            .finally(() => {
                setSubmitting(false);
            });
    };
    _render = ({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) => {
        const {t} = this.props;

        if (errors.form) {
            return (
                <Alert>{errors.form}</Alert>
            );
        }

        return (
            <Container component="form" onSubmit={handleSubmit}>
                <Header>
                    <Trans i18nKey="Sign in handy member">
                        Sign in <b>handy</b> member
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
                            placeholder="Email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            append={<img className={styles.icon} src="/static/icons/email.png"/>}
                            error={touched.email && errors.email}
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            append={<img className={styles.icon} src="/static/icons/password.png"/>}
                            prepend={<img className={styles.icon} src="/static/icons/secret.png"/>}
                            error={touched.password && errors.password}
                        />
                        <div className={styles.forgotPassword}>
                            <a href={`/forgot_password?appid=`+this.props.clientId}>{t(`Forgot password?`)}</a>
                        </div>
                    </div>
                </Content>
                <Footer>
                    <Button type="submit" disabled={isSubmitting}>{t(`SIGN IN`)}</Button>
                </Footer>
            </Container>
        );
    };

    render() {
        return (
            <Formik
                initialValues={{
                    ...this.props.query,
                    response_type: 'code',
                    email: '',
                    password: '',
                }}
                validate={this._validate}
                onSubmit={this._onSubmit}
                render={this._render}
            />
        );
    }
}


export default translate()(AuthorizePage);
