// import fs from 'fs';
// import moment from 'moment';
// import jwt from 'jsonwebtoken';
// import md5 from 'md5';
// import {OAuthRevokedJwt} from '../models';


// const TYPE_DATE = 'DATE';


// const SUBJECT_TOKEN = 'TOKEN';
// const SUBJECT_AUTHORIZATION_CODE = 'AUTHORIZATION_CODE';


// const JWT_PRIVATE_KEY = (process.env.NODE_ENV === 'production') ? fs.readFileSync('./oauth-member') : process.env.JWT_SECRET;
// const JWT_PUBLIC_KEY = (process.env.NODE_ENV === 'production') ? fs.readFileSync('./oauth-member.pub') : process.env.JWT_SECRET;


// export function generateAccessToken(payload) {
//     return encodeJwt(payload, {subject: SUBJECT_TOKEN});
// }

// export function generateRefreshToken(payload) {
//     return encodeJwt(payload, {subject: SUBJECT_TOKEN});
// }

// export function generateAuthorizationCode(payload) {
//     return encodeJwt(payload, {subject: SUBJECT_AUTHORIZATION_CODE});
// }


// export function getAccessToken(token) {
//     return decodeJwt(token, {subject: SUBJECT_TOKEN});
// }

// export function getRefreshToken(token) {
//     return decodeJwt(token, {subject: SUBJECT_TOKEN});
// }

// export function getAuthorizationCode(code) {
//     return decodeJwt(code, {subject: SUBJECT_AUTHORIZATION_CODE});
// }


// export async function revokeJwt(jwt, expiresAt) {
//     const hash = md5(jwt);

//     if (await isHashRevoked(hash)) {
//         return false;
//     }

//     return OAuthRevokedJwt.create({
//         hash,
//         jwt,
//         expiresAt: moment(expiresAt).unix(),
//     });
// }


// export function isJwtRevoked(jwt) {
//     return isHashRevoked(md5(jwt));
// }

// export async function isHashRevoked(hash) {
//     return !!(await OAuthRevokedJwt.find({where: {hash}}));
// }


// async function decodeJwt(token, options) {
//     let payload = await verifyJwt(token, options);

//     for (const key in payload) {
//         const value = payload[key];

//         if (Array.isArray(value)) {
//             const [dataType, dataValue] = value;

//             switch (dataType) {
//                 case TYPE_DATE:
//                     payload[key] = moment.unix(dataValue).toDate();
//                     break;
//             }
//         }
//     }

//     return payload;
// }


// function encodeJwt(payload, options) {
//     for (const key in payload) {
//         const value = payload[key];

//         switch (true) {
//             case (key === 'client'):
//                 payload[key] = {id: value.id};
//                 break;
//             case (value instanceof Date):
//                 payload[key] = [TYPE_DATE, moment(value).unix()];
//                 break;
//         }
//     }

//     return signJwt(payload, options);
// }


// function signJwt(payload, options) {
//     return new Promise((resolve, reject) => {
//         jwt.sign(payload, JWT_PRIVATE_KEY, options, (error, token) => {
//             if (error) {
//                 return reject(error);
//             }

//             return resolve(token);
//         });
//     });
// }


// function verifyJwt(token, options) {
//     return new Promise((resolve, reject) => {
//         jwt.verify(token, JWT_PUBLIC_KEY, options, (error, payload) => {
//             if (error) {
//                 return reject(error);
//             }

//             return resolve(payload);
//         });
//     });
// }
