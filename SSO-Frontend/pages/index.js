import React, {Component} from 'react';
import {Trans, translate} from 'react-i18next';
import {Container, Content, Footer} from './components/Layout';
import './global.less';
import styles from './styles.less';
import Button from './components/Button';
import Breakline from './components/Breakline';




class IndexPage extends Component {
    static getInitialProps({query}) {
        const clientId = query.appid;

        const fbLoginUri = process.env.SERVERURI + `/v1/thirdParty/facebookLogin`
            + `?appid=`+clientId
            + `&redirect_uri=${encodeURIComponent(process.env.URL)}`
            ;
        const googleLoginUri = process.env.SERVERURI + `/v1/thirdParty/googleLogin`
        + `?appid=`+clientId
        + `&redirect_uri=${encodeURIComponent(process.env.URL)}`
        ;

        return {clientId, fbLoginUri,googleLoginUri};
    }

    render() {
        const {t, clientId} = this.props;
        return (
            <Container>
                <Content>
                    <div className={styles.logo}>
                        <img src="/static/logo.png"/>
                    </div>
                    <div className={styles.slogan}>
                        <Trans i18nKey="Become handy member">
                            Become <b>handy</b> member
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
                        <Breakline>or</Breakline>
                        <Button className={styles.email} href={`/register?appid=`+this.props.clientId}>
                            {t(`Register using Email`)}
                        </Button>
                    </div>
                </Content>
                <Footer>
                    <div className={styles.signIn}>
                        Already have an account?
                        <a href={`/authorize?appid=`+this.props.clientId}>SIGN IN</a>
                    </div>
                </Footer>
            </Container>
        );
    }
}


export default translate()(IndexPage);
