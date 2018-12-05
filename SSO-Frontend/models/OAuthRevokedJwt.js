// export default function (sequelize, DataTypes) {
//     return sequelize.define('OAuthRevokedJwt', {
//         id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true,
//         },
//         hash: {
//             type: DataTypes.STRING,
//         },
//         jwt: {
//             type: DataTypes.STRING,
//         },
//         expiresAt: {
//             type: DataTypes.INTEGER,
//             field: 'expires_at',
//         },
//     }, {
//         tableName: 'oauth_revoked_jwts',
//         timestamps: false,
//     });
// };
