// import {arrayGetterSetter} from './helpers';


// export default function (sequelize, DataTypes) {
//     return sequelize.define('OAuthClient', {
//         id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true,
//         },
//         clientId: {
//             type: DataTypes.STRING,
//             field: 'client_id',
//         },
//         clientSecret: {
//             type: DataTypes.STRING,
//             field: 'client_secret',
//         },
//         redirectUris: {
//             type: DataTypes.STRING,
//             field: 'redirect_uris',
//             ...arrayGetterSetter('redirectUris'),
//         },
//         grants: {
//             type: DataTypes.STRING,
//             ...arrayGetterSetter('grants'),
//         },
//         accessTokenLifetime: {
//             type: DataTypes.INTEGER,
//             field: 'access_token_lifetime',
//         },
//         refreshTokenLifetime: {
//             type: DataTypes.INTEGER,
//             field: 'refresh_token_lifetime',
//         },
//         updatedAt: {
//             type: DataTypes.DATE,
//             field: 'updated_at',
//         },
//         createdAt: {
//             type: DataTypes.DATE,
//             field: 'created_at',
//         },
//     }, {
//         tableName: 'oauth_clients',
//         timestamps: true,
//     });
// };
