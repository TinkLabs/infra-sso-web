// import {forEach} from 'lodash/collection';
// import Sequelize from 'sequelize';


// const sequelize = new Sequelize({
//     database: process.env.DB_DATABASE,
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: 'mysql',
//     operatorsAliases: false,
//     timezone: process.env.TZ,
// });


// const models = {
//     Member: sequelize.import(__dirname + '/Member'),
//     OAuthClient: sequelize.import(__dirname + '/OAuthClient'),
//     OAuthRevokedJwt: sequelize.import(__dirname + '/OAuthRevokedJwt'),
// };


// forEach(models, function (model) {
//     if ('associate' in model) {
//         model.associate(models);
//     }
// });


// export {Sequelize, sequelize};
// export const Member = models.Member;
// export const OAuthClient = models.OAuthClient;
// export const OAuthRevokedJwt = models.OAuthRevokedJwt;
