import express from 'express';
import wrapAsync from 'express-wrap-async';
import {Op} from 'sequelize';
import moment from 'moment';
import {OAuthClient, Member} from '../../models';


export default function (app, server) {
    const router = express.Router();


    // GET /
    router.get('/', wrapAsync(async function (req, res) {
        const client_id = req.query.appid;

        if (client_id) {
            // const client = await OAuthClient.find({where: {client_id}});

            // if (client && client.grants.indexOf('authorization_code') !== -1) {
                return app.render(req, res, '/', req.query);
            // }
        }

        return app.render404(req, res);
        // return app.render(req, res, '/', req.query);
    }));


    // GET /authorize
    router.get('/authorize', wrapAsync(async function (req, res) {
        // const client_id = req.query.client_id;

        // if (client_id) {
        //     const client = await OAuthClient.find({where: {client_id}});

        //     if (client && client.grants.indexOf('authorization_code') !== -1) {
        //         return app.render(req, res, '/authorize', req.query);
        //     }
        // }

        // return app.render404(req, res);
        return app.render(req, res, '/authorize', req.query);
    }));


    // GET /reset_password
    router.get('/reset_password', wrapAsync(async function (req, res) {
        const reset_token = req.query.reset_token;

        if (reset_token) {
            const member = await Member.findByResetToken(reset_token);

            if (member) {
                return app.render(req, res, '/reset_password', req.query);
            }
        }

        return app.render404(req, res);
    }));


    return router;
}
