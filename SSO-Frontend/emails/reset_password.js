export default (t, {reset_token}) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style type="text/css">
        /* cyrillic-ext */
        @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 400;
            src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu72xKKTU1Kvnz.woff2) format('woff2');
            unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
        }
        /* cyrillic */
        @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 400;
            src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu5mxKKTU1Kvnz.woff2) format('woff2');
            unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }
        /* greek-ext */
        @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 400;
            src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7mxKKTU1Kvnz.woff2) format('woff2');
            unicode-range: U+1F00-1FFF;
        }
        /* greek */
        @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 400;
            src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4WxKKTU1Kvnz.woff2) format('woff2');
            unicode-range: U+0370-03FF;
        }
        /* vietnamese */
        @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 400;
            src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7WxKKTU1Kvnz.woff2) format('woff2');
            unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
        }
        /* latin-ext */
        @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 400;
            src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKKTU1Kvnz.woff2) format('woff2');
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }
        /* latin */
        @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 400;
            src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2) format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Roboto', sans-serif;
            line-height: 1.5;
            color: #ffffff;
            background-color: #07183a;
        }

        .container {
            padding: 60px;
            text-align: center;
        }

        .logo {
            margin-bottom: 60px;
        }

        .title {
            font-size: 60px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .caption {
            font-size: 18px;
            margin-bottom: 50px;
        }

        .content {
            max-width: 600px;
            padding: 40px;
            margin-left: auto;
            margin-right: auto;
            background-color: #f6f6f6;
            color: #000000;
        }

        .content > b {
            font-size: 18px;
            font-weight: bold;
        }

        .social {
            margin: 20px;
        }

        .footer {
            max-width: 420px;
            margin-left: auto;
            margin-right: auto;
            color: #bbbbbb;
            font-size: 10px;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="logo">
        <img width="100" src="${process.env.URL}/static/email/logo.png" alt="handy"/>
    </div>
    <div class="title">
        ${t(`Welcome to handy.`)}
    </div>
    <div class="caption">
        ${t(`Enjoy handy services in over 1700 hotels around the globe`)}
    </div>
    <div class="content">
        <b>${t('Hi!')}</b>
        <br/><br/><br/>
        ${t(`Thank you for signing up for handy membership. With handy membership you can enjoy services including free local and international calls, roaming internet, city guides and much more.`)}
        <br/><br/><br/>
        ${t(`Your login in details:`)}
        <br/>
        <a href="${process.env.URL}/reset_password?reset_token=${reset_token}">Reset Password</a
        <br/><br/><br/>
        ${t(`You can continue to setup your profile on the handy membership section or on our membership website, so you can enjoy a more customized handy experience during your travel!`)}
    </div>
    <div class="social">
        <img width="50" src="${process.env.URL}/static/emails/facebook.png" alt="facebook"/>
        <img width="50" src="${process.env.URL}/static/emails/web.png" alt="web"/>
    </div>
    <div class="footer">
        ${t(`Copyright © 2018 handy, All rights reserved.`)} 
        ${t(`handy is trademarks or registered trademarks of Tink Labs Limited with headquarters located at  1/F , 101 King's Road, North Point, Hong Kong`)}
    </div>
</div>
</body>
</html>
`;
