import React, {Component} from 'react';
import {translate} from 'react-i18next';
import axios from 'axios';
import '../global.less';
import {Container, Content} from '../components/Layout';
import Alert from '../components/Alert';


class FacebookLoginPage extends Component {
    static getInitialProps({query}) {
        return {
            query,
            state: query.state.split('|'),
            redirectUri: `${process.env.URL}/facebook_login`,
        };
    }

    state = {
        error: null,
    };

    componentDidMount() {
        if (process.browser) {
            const {query: {code}, state: [clientId], redirectUri} = this.props;

            axios
                .post('/oauth/authorize', {
                    client_id: clientId,
                    response_type: 'code',
                    facebook: {
                        code: code,
                        redirect_uri: redirectUri,
                    },
                })
                .then(({data: {location}}) => {
                    window.location.replace(location);
                })
                .catch(({response: {data: {message}}}) => {
                    this.setState({error: message});
                });
        }
    }

    render() {
        const {error} = this.state;

        return (
            <Container>
                <Content>
                    {error && <Alert>{error}</Alert>}
                </Content>
            </Container>
        );
    }
}


export default translate()(FacebookLoginPage);
