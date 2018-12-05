import React, {Component} from 'react';
import {translate} from 'react-i18next';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import isLength from 'validator/lib/isLength';
import axios from 'axios';
import {Formik} from 'formik';
import {Container, Content, Footer, Header} from '../components/Layout';
import Alert from '../components/Alert';
import Input from '../components/Input';
import Button from '../components/Button';
import '../global.less';
import styles from './styles.less';


class ForgotPasswordPage extends Component {
    state = {
        submitted: 0,
    };
    static getInitialProps({query}) {
        const clientId = query.appid;
        return {clientId};
    }

    _validate = (values) => {
        const {t} = this.props;
      
        let errors = {};

        if (!isEmail(values.email)) {
            errors.email = t(`Please enter an valid email.`);
        }
       
        if(this.state.submitted>=1) {
            if (values.code.length===4) {}else{
                errors.code = t(`Please enter an valid code.`);
            }
        }
        if(this.state.submitted>=2) {
        
            if (isEmpty(values.password)) {
                errors.password = t(`Please enter the password.`);
            }
      
            if (!isEmpty(values.password) && values.password !== values.confirm_password) {
                errors.confirm_password = t(`Password do not match.`);
            }
        }       

       
        return errors;
    };

    _onSubmit = (values, {setSubmitting, setErrors}) => {
        const {t} = this.props;
        
        values.appid=this.props.clientId;// this just for demo.
        values.value=values.email;
        values.verificationType='email';
        values.userType='2';
        
        if(this.state.submitted===0) {
            setSubmitting(true);
            
            axios.post('https://sso-uat.handytravel.tech/v1/service/sendVerificationCode', values)
                .then(() => {
                    //return app.render(req, res, '/', req.query);
                    this.setState({submitted: 1});
                    setSubmitting(false);
                    
                })
                .catch(({response: {data: {retCode, retMsg}}}) => {
                    console.log(retCode);
                    if (retCode === '10000') {
                        setErrors({email: t(`Email is not registered.`)});
                    } else {
                        setErrors({form: retMsg});
                    }
                })
                .finally(() => {
                    setSubmitting(false);
                });
            }
            //verify code
        if(this.state.submitted===1) {
            setSubmitting(true);
            values.type='1';
            values.username=values.email;
            values.verificationCode=values.code;
            axios.post('https://sso-uat.handytravel.tech/v1/user/getUpdatePwdToken', values)
                .then(() => {
                    //return app.render(req, res, '/', req.query);
                    this.setState({submitted: 2});
                    setSubmitting(false);
                })
                .catch(({response: {data: {retCode, retMsg}}}) => {
                    if (retCode === '10000') {
                        setErrors({email: t(`Please enter an valid code.`)});
                    } else {
                        setErrors({form: retMsg});
                    }
                })
                .finally(() => {
                    setSubmitting(false);
                });
            }
        //reset password
        if(this.state.submitted===2) {
            setSubmitting(true);
            axios.post('http://10.0.2.20:8080/v1/user/verificationAccount', values)
                .then(() => {
                    //return app.render(req, res, '/', req.query);
                    window.location = '/authorize';
                    
                })
                .catch(({response: {data: {retCode, retMsg}}}) => {
                    if (retCode === '60001') {
                        setErrors({email: t(`Email is not submitted.`)});
                    } else {
                        setErrors({form: retMsg});
                    }
                })
                .finally(() => {
                    setSubmitting(false);
                });
            }

    };

    _render = ({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) => {
        const {t} = this.props;

        if (errors.form) {
            return (
                <Alert>{errors.form}</Alert>
            );
        }

        const {submitted} = this.state;

        return (
            <Container component="form" onSubmit={handleSubmit}>
                <Header>
                    {submitted===0 && <span>{t(`Forgot Password`)}</span>}
                    {submitted===1 && <span>{t(`Reset password Code  has been sent`)}</span>}
                    {submitted===2 && <span>{t(`Please input your new Password`)}</span>}
                </Header>
                <Content>
                    {submitted===0 && <div className={styles.remark}>
                        {t(`Please enter your email address to receive a reset password Code:`)}
                    </div>
                    }
                    {submitted===1 && <div className={styles.remark}>
                        {t(`Please input the reset password Code which received:`)}
                    </div>
                    }
                    {submitted===2 && <div className={styles.remark}>
                        {t(`After reset your password ,you will be redirect to Login page and login again.`)}
                    </div>
                    }

                    <div className={styles.form} >
                        {submitted===0 && <Input
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            append={<img className={styles.icon} src="/static/icons/email.png"/>}
                            error={touched.email && errors.email}
                            
                        />
                        }

                        {submitted===1 && <Input
                            type="text"
                            name="code"
                            placeholder="Verification Code"
                            value={values.code}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            append={<img className={styles.icon} src="/static/icons/email.png"/>}
                            error={touched.code && errors.code}
                        />}

                        {submitted===2 && <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            append={<img className={styles.icon} src="/static/icons/password.png"/>}
                            prepend={<img className={styles.icon} src="/static/icons/secret.png"/>}
                            error={touched.password && errors.password}
                        />}
                        {submitted===2 && <Input
                            type="password"
                            name="confirm_password"
                            placeholder="Confirm Password"
                            value={values.confirm_password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            append={<img className={styles.icon} src="/static/icons/password.png"/>}
                            prepend={<img className={styles.icon} src="/static/icons/secret.png"/>}
                            error={touched.confirm_password && errors.confirm_password}
                        />}

                    </div>

                </Content>
                {submitted===3 && <Content>
                    {t(`An e-mail with the reset password link has been sent to:`)}
                    <br/><br/><br/><br/>
                    {values.email}
                    <br/><br/><br/><br/>
                    {t(`Please check your email for further reset password instructions. The reset password link will expire in 24 hours for security reasons.`)}
                    <br/><br/><br/><br/>
                </Content>}
                {submitted===0 && <Footer>
                    <Button type="submit" disabled={isSubmitting}>{t(`SEND ME THE LINK`)}</Button>
                </Footer>}
                {submitted===1 && <Footer>
                    <Button type="submit" disabled={isSubmitting}>{t(`VERIFY ME THE CODE`)}</Button>
                </Footer>}
                {submitted===2 && <Footer>
                    <Button type="submit" disabled={isSubmitting}>{t(`RESET PASSWORD`)}</Button>
                </Footer>}
            </Container>
        );
    };

    render() {
        return (
            <Formik
                initialValues={{
                    email: '',
                    code: '',
                    password: '',
                    confirm_password: '',


                }}
                validate={this._validate}
                onSubmit={this._onSubmit}
                render={this._render}
            />
        );
    }
}


export default translate()(ForgotPasswordPage);
