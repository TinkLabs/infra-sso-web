// import OAuthServer, {InvalidGrantError, InvalidRequestError} from 'oauth2-server';
// import oauthModel from './model';
// import {Member} from '../models';
// import {getAccessToken, getProfile} from '../utils/facebook';


// export default new OAuthServer({
//     model: oauthModel,
//     allowEmptyState: true,
//     authenticateHandler: {
//         handle: authenticateHandler,
//     },
// });


// async function authenticateHandler(request) {
//     const {username, password, facebook} = request.body;

//     if (username && password) {
//         const user = await Member.findOne({where: {email: username}});

//         if (user && await user.verifyPassword(password)) {
//             return user;
//         }

//         throw new InvalidGrantError('Invalid grant: user credentials are invalid');
//     }

//     if (facebook) {
//         const {code, redirect_uri} = facebook;

//         if (code && redirect_uri) {
//             const accessToken = await getAccessToken(code, redirect_uri);
//             const profile = await getProfile(accessToken);

//             if (profile) {
//                 let user = await Member.findOne({where: {type: 'facebook', social_user_id: profile.id}});

//                 if (!user) {
//                     user = await Member.create({
//                         type: 'facebook',
//                         social_user_id: profile.id,
//                         email: profile.email,
//                         first_name: profile.first_name,
//                         last_name: profile.last_name,
//                     });
//                 }

//                 return {
//                     id: user.id,
//                 };
//             }

//             throw new InvalidGrantError('Invalid grant: facebook credentials are invalid');
//         }
//     }

//     throw new InvalidRequestError('Missing parameter');
// }
