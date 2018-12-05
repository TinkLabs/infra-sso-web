// import express from 'express';
// import wrapAsync from 'express-wrap-async';
// import {Op} from 'sequelize';
// import md5 from 'md5';
// import createError from 'http-errors';
// import moment from 'moment';
// import {Member} from '../../models';
// import mailer from '../../utils/mailer';
// import InvalidInputError from '../../errors/InvalidInputError';
// import EmailNotExistError from '../../errors/EmailNotExistError';
// import EmailExistError from '../../errors/EmailExistError';
// import ResetTokenNotExistError from '../../errors/ResetTokenNotExistError';
// import createWelcomeEmail from '../../emails/welcome';
// import createResetPasswordEmail from '../../emails/reset_password';


// export default function (app, server) {
//     const router = express.Router();

//     // POST /member/register
//     router.post('/register', wrapAsync(async function (req, res) {
//         const type = 'email';
//         const {t, body: {email, password}} = req;

//         if (!email || !password) {
//             throw new InvalidInputError();
//         }

//         if (await Member.find({where: {type, email}})) {
//             throw new EmailExistError();
//         }

//         await Member.create({type, email, password});
//         await mailer.sendMail({
//             from: 'noreply@tinklabs.com',
//             to: email,
//             subject: t(`Welcome to handy`),
//             html: createWelcomeEmail(t, {email, password}),
//         });

//         res.json({success: true});
//     }));


//     // POST /member/forgot_password
//     router.post('/forgot_password', wrapAsync(async function (req, res) {
//         const type = 'email';
//         const {t, body: {email}} = req;

//         if (!email) {
//             throw new InvalidInputError();
//         }

//         const member = await Member.find({where: {type, email}});
//         if (!member) {
//             throw new EmailNotExistError();
//         }

//         const reset_token = md5(Math.random());
//         const reset_token_expiry = moment().add(3, 'hours');
//         member.reset_token = reset_token;
//         member.reset_token_expiry = reset_token_expiry;
//         await member.save();

//         await mailer.sendMail({
//             from: 'noreply@tinklabs.com',
//             to: email,
//             subject: t('Reset Password'),
//             html: createResetPasswordEmail(t, {reset_token}),
//         });

//         res.json({success: true});
//     }));


//     // POST /member/reset_password
//     router.post('/reset_password', wrapAsync(async function (req, res) {
//         const {body: {reset_token, password}} = req;

//         if (!reset_token || !password) {
//             throw new InvalidInputError();
//         }

//         const member = await Member.findByResetToken(reset_token);

//         if (!member) {
//             throw new ResetTokenNotExistError();
//         }

//         member.reset_token = null;
//         member.reset_token_expiry = null;
//         member.password = password;
//         await member.save();

//         res.json({success: true});
//     }));


//     // 404
//     router.use('*', (req, res) => {
//         throw createError(404);
//     });

//     return router;
// }
