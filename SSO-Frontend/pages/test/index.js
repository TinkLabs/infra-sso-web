import React, {Component} from 'react';
import {translate} from 'react-i18next';
import axios from 'axios';
import qs from 'querystring';
import {Container, Content} from '../components/Layout/index';
import '../global.less';


class TestPage extends Component {
    static async getInitialProps({query}) {
        return {query};
    }

    state = {
        info: {},
    };

    componentDidMount() {
        axios
            .post(`/oauth/token`, qs.stringify({
                client_id: 'handy_test_app',
                client_secret: 'qwertyuiopasdfghjklzxcvbnm',
                grant_type: 'authorization_code',
                code: this.props.query.code,
                redirect_uri: 'http://localhost:4000/test',
            }))
            .then(({data: {accessToken}}) => {
                return axios.post(`/oauth/verify`, qs.stringify({
                    access_token: accessToken,
                }))
            })
            .then(({data: {info}}) => {
                this.setState({info});
            });
    }

    render() {
        const {t} = this.props;

        return (
            <Container>
                <Content>
                    ID: {this.state.info.id}<br/>
                    Email: {this.state.info.email}<br/>
                </Content>
            </Container>
        );
    }
}


export default translate()(TestPage);
