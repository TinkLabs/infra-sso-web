// import express from 'express';
// import wrapAsync from 'express-wrap-async';
// import {pick} from 'lodash/object';
// import createError from 'http-errors';
// import moment from 'moment';
// import {Request, Response} from 'oauth2-server';
// import oauthServer from '../../oauth/server';
// import {Member} from '../../models/index';


// export default function (app, server) {
//     const router = express.Router();

//     // POST /oauth/authorize
//     router.post('/authorize', wrapAsync(async function (req, res) {
//         const request = new Request(req);
//         const response = new Response(res);
//         await oauthServer.authorize(request, response);

//         res.json({location: response.headers.location});
//     }));


//     // POST /oauth/token
//     router.post('/token', wrapAsync(async function (req, res) {
//         const request = new Request(req);
//         const response = new Response(res);
//         const {accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt, scope} = await oauthServer.token(request, response);

//         res.json({
//             accessToken,
//             accessTokenExpiresAt,
//             refreshToken,
//             refreshTokenExpiresAt,
//             scope,
//         });
//     }));


//     // POST /oauth/verify
//     router.post('/verify', wrapAsync(async function (req, res) {
//         const request = new Request(req);
//         const response = new Response(res);
//         const token = await oauthServer.authenticate(request, response);

//         const {user, scope, accessTokenExpiresAt} = token;
//         const member = await Member.findById(user.id);

//         if (!member) {
//             throw createError(404, 'Member not found.');
//         }

//         const info = pick(member, [
//             'id',
//             'email',
//             'salutation',
//             'first_name',
//             'last_name',
//             'avatar_url',
//             'birthday',
//             'gender',
//             'age',
//             'bio',
//             'nickname',
//             'region',
//             'phone_number',
//         ]);

//         res.json({
//             info,
//             token: {
//                 scope,
//                 expires_at: moment(accessTokenExpiresAt).unix(),
//             },
//         });
//     }));


//     // 404
//     router.use('*', (req, res) => {
//         throw createError(404);
//     });

//     return router;
// }