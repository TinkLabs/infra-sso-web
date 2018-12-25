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
