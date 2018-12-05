// import {generateAccessToken, generateAuthorizationCode, generateRefreshToken, getAccessToken, getAuthorizationCode, getRefreshToken, isJwtRevoked, revokeJwt} from './helpers';
// import {Member, OAuthClient} from '../models';


// export default {
//     async getAccessToken(accessToken) {
//         if (await isJwtRevoked(accessToken)) {
//             return false;
//         }

//         const payload = await getAccessToken(accessToken);

//         return {accessToken, ...payload};
//     },

//     async getRefreshToken(refreshToken) {
//         if (await isJwtRevoked(refreshToken)) {
//             return false;
//         }

//         const payload = await getRefreshToken(refreshToken);

//         return {refreshToken, ...payload};
//     },

//     async getAuthorizationCode(code) {
//         if (await isJwtRevoked(code)) {
//             return false;
//         }

//         const payload = await getAuthorizationCode(code);

//         return {code, ...payload};
//     },

//     async getClient(clientId, clientSecret) {
//         const client = await OAuthClient.find({
//             where: clientSecret !== null ? {clientId, clientSecret} : {clientId},
//         });

//         if (!client) {
//             return false;
//         }

//         return {
//             id: client.clientId,
//             redirectUris: client.redirectUris,
//             grants: client.grants,
//             accessTokenLifetime: client.accessTokenLifetime,
//             refreshTokenLifetime: client.refreshTokenLifetime,
//         };
//     },

//     async getUser(username, password) {
//         const user = await Member.findOne({where: {email: username}});

//         if (!user || !(await user.verifyPassword(password))) {
//             return false;
//         }

//         return {
//             id: user.id,
//         };
//     },

//     async saveToken(token, client, user) {
//         const {accessTokenExpiresAt, refreshTokenExpiresAt, scope} = token;
//         const accessToken = await generateAccessToken({client, user, scope, accessTokenExpiresAt});
//         const refreshToken = await generateRefreshToken({client, user, scope, refreshTokenExpiresAt});

//         return {
//             accessToken,
//             accessTokenExpiresAt,
//             refreshToken,
//             refreshTokenExpiresAt,
//             scope,
//             client,
//             user,
//         };
//     },

//     async saveAuthorizationCode(code, client, user) {
//         const {redirectUri, scope, expiresAt} = code;
//         const authorizationCode = await generateAuthorizationCode({client, user, redirectUri, scope, expiresAt});

//         return {
//             authorizationCode,
//             expiresAt,
//             redirectUri,
//             scope,
//             client,
//             user,
//         };
//     },

//     async revokeToken({refreshToken, refreshTokenExpiresAt}) {
//         return revokeJwt(refreshToken, refreshTokenExpiresAt);

//     },

//     async revokeAuthorizationCode({code, expiresAt}) {
//         return revokeJwt(code, expiresAt);
//     },

//     async validateScope(user, client, scope) {
//         return scope || 'info';
//     },

//     async verifyScope(token, scope) {
//         if (!token || !token.scope) {
//             return false;
//         }

//         const tokenScopes = token.scope.split(' ');
//         const requiredScopes = scope.split(' ');

//         return requiredScopes.every((requiredScope) => tokenScopes.indexOf(requiredScope) !== -1);
//     },
// }
