import axios from 'axios';


const FB_GRAPH_URL = `https://graph.facebook.com/${process.env.FB_API_VERSION}`;


export async function getAccessToken(code, redirect_uri) {
    try {
        const {data} = await axios({
            url: `${FB_GRAPH_URL}/oauth/access_token`,
            params: {
                client_id: process.env.FB_APP_ID,
                client_secret: process.env.FB_APP_SECRET,
                redirect_uri,
                code,
            },
        });

        return data.access_token;
    } catch (error) {
        return null;
    }
}


export async function getProfile(access_token) {
    try {
        const {data} = await axios({
            url: `${FB_GRAPH_URL}/me`,
            params: {
                fields: 'id,email,first_name,last_name',
                access_token,
            },
        });

        return data;
    } catch (error) {
        return null;
    }
}

