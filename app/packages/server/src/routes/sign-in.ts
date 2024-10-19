import {Request, Router} from 'express';
import prisma from "../db/prisma.js";

import {getSignedInUser, getUserData, TypedResponse} from "../common.js";
import bcrypt from 'bcryptjs';
import {BaseResponseData, ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';
import {
    SignInCheckResponseData, SignInFacebookRequest, SignInGoogleRequest,
    SignInRequest, SignInResponseData,
    validateSignInRequest
} from '@elr0berto/robert-learns-shared/api/sign-in';
import {logWithRequest} from "../logger.js";
import passport from "passport";


const signIn = Router();

signIn.post('/sign-in-check', async (req, res : TypedResponse<SignInCheckResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);
        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            userData: user === null ? null : getUserData(user),
        });
    } catch (ex) {
        console.error('/sign-in/check caught ex', ex);
        next(ex);
        return;
    }
});

signIn.post('/', async (req: Request<unknown, unknown, SignInRequest>, res : TypedResponse<SignInResponseData>, next) => {
    try {
        const errors = validateSignInRequest(req.body);

        if (errors.length !== 0) {
            logWithRequest('error', req, 'Sign in request validation failed', {errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join(', '),
                userData: null,
            });
        }

        const u1 = await prisma.user.findFirst({
            where: {
                OR: [
                    {username: req.body.username},
                    {email: req.body.username},
                ]
            }
        });

        if (u1 === null) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UserError,
                errorMessage: 'Login/password is wrong!!',
                userData: null,
            });
        }

        if (!bcrypt.compareSync(req.body.password, u1.password)) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UserError,
                errorMessage: 'Login/password is wrong!',
                userData: null,
            });
        }

        req.session.userId = u1.id;

        const user = await getSignedInUser(req.session);

        if (user === null) {
            throw new Error('User is null after successful sign in.');
        }

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            userData: getUserData(user),
        });
    } catch (ex) {
        console.error('/sign-in/ caught ex', ex);
        next(ex);
        return;
    }
});


signIn.post('/google', async (req: Request<unknown, unknown, SignInGoogleRequest>, res : TypedResponse<BaseResponseData>, next) => {
    try {
        passport.authenticate('google-id-token', async (err, user) => {
            if (err) {
                throw new Error('Invalid Google ID token');
            }

            // At this point, user contains the email and name from Google
            // Handle session creation and user logic here

            // For example, creating your own session
            if (typeof user.email !== 'string' || user.email.length <= 0) {
                throw new Error('Email is required, got: ' + JSON.stringify(user));
            }

            const u1 = await prisma.user.findFirst({
                where: {
                    email: user.email,
                }
            });

            if (u1 === null) {
                // generate random password
                const randomPassword = Math.random().toString(36).slice(-8);


                if (typeof user.givenName !== 'string' || user.givenName.length <= 0) {
                    throw new Error('Given name is required, got: ' + JSON.stringify(user));
                }
                if (typeof user.familyName!== 'string' || user.familyName.length <= 0) {
                    throw new Error('Family name is required, got: ' + JSON.stringify(user));
                }

                // try to find a new username from the email. If it already exists, add a random number to the end
                let username = user.email.split('@')[0];
                let i = 1;
                while (await prisma.user.findFirst({where: {username: username}})) {
                    username = user.email.split('@')[0] + i.toString();
                    i++;
                }

                const newUser = await prisma.user.create({
                    data: {
                        firstName: user.givenName,
                        lastName: user.familyName,
                        username: username,
                        password: randomPassword,
                        email: user.email,
                    }
                });

                req.session.userId = newUser.id;
            } else {
                req.session.userId = u1.id;
            }



            const u2 = await getSignedInUser(req.session);

            if (u2 === null) {
                throw new Error('User is null after successful sign in.');
            }

            return res.json({
                dataType: true,
                status: ResponseStatus.Success,
                errorMessage: null,
            });

        })(req, res, next);
    } catch (ex) {
        console.error('/sign-in/google caught ex', ex);
        next(ex);
        return;
    }
});

signIn.post('/facebook', async (req: Request<unknown, unknown, SignInFacebookRequest>, res : TypedResponse<BaseResponseData>, next) => {
    try {
        passport.authenticate('facebook-token', async (err, user) => {
            if (err) {
                throw new Error('Invalid facebook access_token, err: ' + JSON.stringify(err));
            }

            //throw new Error(JSON.stringify(user));
            // At this point, user contains the email and name from Google
            // Handle session creation and user logic here

            // For example, creating your own session
            if (typeof user.email !== 'string' || user.email.length <= 0) {
                throw new Error('Email is required, got: ' + JSON.stringify(user));
            }

            const u1 = await prisma.user.findFirst({
                where: {
                    email: user.email,
                }
            });

            if (u1 === null) {
                // generate random password
                const randomPassword = Math.random().toString(36).slice(-8);

                // split name into firstname and lastname
                const name = user.name.split(' ');
                const firstName = name[0];
                const lastName = name.length > 2 ? name.slice(1).join(' ') : name[1];

                if (typeof firstName !== 'string' || firstName.length <= 0) {
                    throw new Error('First name is required, got: ' + JSON.stringify(user));
                }
                if (typeof lastName !== 'string' || lastName.length <= 0) {
                    throw new Error('Last name is required, got: ' + JSON.stringify(user));
                }

                // try to find a new username from the email. If it already exists, add a random number to the end
                let username = user.email.split('@')[0];
                let i = 1;
                while (await prisma.user.findFirst({where: {username: username}})) {
                    username = user.email.split('@')[0] + i.toString();
                    i++;
                }

                const newUser = await prisma.user.create({
                    data: {
                        firstName: firstName,
                        lastName: lastName,
                        username: username,
                        password: randomPassword,
                        email: user.email,
                    }
                });

                req.session.userId = newUser.id;
            } else {
                req.session.userId = u1.id;
            }



            const u2 = await getSignedInUser(req.session);

            if (u2 === null) {
                throw new Error('User is null after successful sign in.');
            }

            return res.json({
                dataType: true,
                status: ResponseStatus.Success,
                errorMessage: null,
            });
        })(req, res, next);
    } catch (ex) {
        console.error('/sign-in/facebook caught ex', ex);
        next(ex);
        return;
    }
});

export default signIn;