import React, {Component} from 'react';
import {Trans, translate} from 'react-i18next';
import {Container, Content, Footer} from './components/Layout';
import './global.less';
import styles from './styles.less';
import Button from './components/Button';
import Breakline from './components/Breakline';
import Alert from "./registerQ";




class IndexPage extends Component {
    static getInitialProps({query}) {
        const clientId = query.appid;
        const ssoError = query.ssoError;
        const jwt = query.jwt;

        //解决ios 中webview 后退时导致环境变量失效
        if(! process.env.SERVERURI || ! process.env.URL){
            location.reload();
        }

        const fbLoginUri = process.env.SERVERURI + `/v1/thirdParty/facebookLogin`
            + `?appid=`+clientId
            + `&redirect_uri=${encodeURIComponent(process.env.URL)}`
            ;
        const googleLoginUri = process.env.SERVERURI + `/v1/thirdParty/googleLogin`
        + `?appid=`+clientId
        + `&redirect_uri=${encodeURIComponent(process.env.URL)}`
        ;

        return {clientId, fbLoginUri,googleLoginUri,ssoError,jwt};
    }



    render() {
        const {t} = this.props;

        // if (this.props.ssoError) {
        //     window.history.clear()
        // }


        if(this.props.ssoError){
            //用户在fb授权页面时，点击了取消按钮。需要清除history信息
            if(this.props.ssoError === 'The code can\'t be empty, please fill the code'){

                return (
                    <Container>
                        <Content>
                            <div className={styles.logo}>
                                <img src="/static/logo.png"/>
                            </div>
                            <div className={styles.slogan}>
                                <Trans i18nKey="Become a hi member">
                                    Become a <i>hi</i> member
                                </Trans>
                                <div className={styles.caption}>
                                    {t(`and enjoy our premium features`)}
                                </div>
                            </div>
                            <div className={styles.buttons}>
                                <Button className={styles.facebook} href={this.props.fbLoginUri}>
                                    {t(`Sign in with Facebook`)}
                                </Button>
                                <Button className={styles.google} href={this.props.googleLoginUri}>
                                    {t(`Sign in with Google+`)}
                                </Button>
                                <Breakline>{t(`or`)}</Breakline>
                                <Button className={styles.email} href={`/register?appid=`+this.props.clientId}>
                                    {t(`Register using Email`)}
                                </Button>
                            </div>
                        </Content>
                        <Footer>
                            <div className={styles.signIn}>
                                {t(`Already have an account?`)}
                                <a href={`/authorize?appid=`+this.props.clientId}>{t(`SIGN IN`)}</a>
                            </div>
                        </Footer>
                    </Container>
                );
            }else {
                return (
                    <Container>
                        <Content>
                            <div className={styles.slogan}>
                                <div className={styles.caption}>
                                    {t(this.props.ssoError)}
                                </div>
                            </div>
                        </Content>
                        <Footer>
                            <Button type="button" href={`/index?appid=`+ this.props.clientId}>{t(`login again`)}</Button>
                        </Footer>


                    </Container>
                );
            }


        }

        if(this.props.jwt){
            return (
                <Container>
                    <Content>
                        <div className={styles.slogan}>
                            <div className={styles.caption}>
                                 {t(`loding......`)}
                            </div>
                        </div>
                    </Content>
                </Container>
            );
        }

        return (
            <Container>
                <Content>
                    <div className={styles.logo}>
                        <img src="/static/logo.png"/>
                    </div>
                    <div className={styles.slogan}>
                        <Trans i18nKey="Become a hi member">
                            Become a <i>hi</i> member
                        </Trans>
                        <div className={styles.caption}>
                            {t(`and enjoy our premium features`)}
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        <Button className={styles.facebook} href={this.props.fbLoginUri}>
                            {t(`Sign in with Facebook`)}
                        </Button>
                        <Button className={styles.google} href={this.props.googleLoginUri}>
                            {t(`Sign in with Google+`)}
                        </Button>
                        <Breakline>{t(`or`)}</Breakline>
                        <Button className={styles.email} href={`/register?appid=`+this.props.clientId}>
                            {t(`Register using Email`)}
                        </Button>
                    </div>
                </Content>
                <Footer>
                    <div className={styles.signIn}>
                        {t(`Already have an account?`)}
                        <a href={`/authorize?appid=`+this.props.clientId}>{t(`SIGN IN`)}</a>
                    </div>
                </Footer>
            </Container>
        );
    }
}


export default translate()(IndexPage);
