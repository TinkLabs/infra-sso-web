// import bcrypt from 'bcryptjs';
// import {Op} from 'sequelize';
// import moment from 'moment';


// export default function (sequelize, DataTypes) {
//     const Member = sequelize.define('Member', {
//         id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true,
//         },
//         type: {
//             type: DataTypes.STRING,
//         },
//         social_user_id: {
//             type: DataTypes.STRING,
//         },
//         last_device_user_id: {
//             type: DataTypes.INTEGER,
//         },
//         email: {
//             type: DataTypes.STRING,
//         },
//         password: {
//             type: DataTypes.STRING,
//             set(value) {
//                 this.setDataValue('password', bcrypt.hashSync(value, bcrypt.genSaltSync()));
//             },
//         },
//         salutation: {
//             type: DataTypes.STRING,
//         },
//         first_name: {
//             type: DataTypes.STRING,
//         },
//         last_name: {
//             type: DataTypes.STRING,
//         },
//         avatar_url: {
//             type: DataTypes.STRING,
//         },
//         birthday: {
//             type: DataTypes.DATE,
//         },
//         gender: {
//             type: DataTypes.STRING,
//         },
//         age: {
//             type: DataTypes.STRING,
//         },
//         bio: {
//             type: DataTypes.STRING,
//         },
//         nickname: {
//             type: DataTypes.STRING,
//         },
//         region: {
//             type: DataTypes.STRING,
//         },
//         billing_info_id: {
//             type: DataTypes.INTEGER,
//         },
//         address_id: {
//             type: DataTypes.INTEGER,
//         },
//         phone_number: {
//             type: DataTypes.STRING,
//         },
//         stripe_customer_id: {
//             type: DataTypes.STRING,
//         },
//         paydollar_member_id: {
//             type: DataTypes.STRING,
//         },
//         cc_type: {
//             type: DataTypes.STRING,
//         },
//         cc_name: {
//             type: DataTypes.STRING,
//         },
//         cc_number: {
//             type: DataTypes.STRING,
//         },
//         cc_expiry: {
//             type: DataTypes.STRING,
//         },
//         passcode: {
//             type: DataTypes.STRING,
//         },
//         request: {
//             type: DataTypes.STRING,
//         },
//         token: {
//             type: DataTypes.STRING,
//         },
//         reset_token: {
//             type: DataTypes.STRING,
//         },
//         reset_token_expiry: {
//             type: DataTypes.DATE,
//         },
//         created: {
//             type: DataTypes.DATE,
//         },
//         modified: {
//             type: DataTypes.DATE,
//         },
//         deleted_at: {
//             type: DataTypes.DATE,
//         },
//     }, {
//         timestamps: true,
//         paranoid: true,
//         createdAt: 'created',
//         updatedAt: 'modified',
//         deletedAt: 'deleted_at',
//         tableName: 'members',
//     });

//     Member.findByResetToken = function (reset_token) {
//         return Member.find({
//             where: {
//                 type: 'email',
//                 reset_token,
//                 reset_token_expiry: {
//                     [Op.gt]: moment(),
//                 },
//             },
//         });
//     };

//     Member.prototype.verifyPassword = function (password) {
//         return bcrypt.compare(password, this.password);
//     };

//     return Member;
// };
