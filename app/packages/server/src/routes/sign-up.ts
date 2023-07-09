import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {getSignedInUser, getUserData, TypedResponse} from "../common.js";
import bcrypt from 'bcryptjs';
import {SignUpRequest, SignUpResponseData, validateSignUpRequest} from '@elr0berto/robert-learns-shared/api/sign-up';
import { ResponseStatus } from '@elr0berto/robert-learns-shared/api/models';
const signUp = Router();

signUp.post('/', async (req: Request<unknown, unknown, SignUpRequest>, res : TypedResponse<SignUpResponseData>) => {
    const signedInUser = await getSignedInUser(req.session);

    if (signedInUser !== null) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'already signed in, please sign out first.',
            userData: null,
        });
    }

    const errors : string[] = validateSignUpRequest(req.body);

    if (errors.length > 0) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UserError,
            errorMessage: errors.join('. '),
            userData: null,
        });
    }

    let existingUser = await prisma.user.findFirst({
        where: {
            email:  req.body.email
        }
    });

    if (existingUser !== null) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UserError,
            errorMessage: "User with email " + req.body.email + " already exists.",
            userData: null,
        });
    }

    existingUser = await prisma.user.findFirst({
        where: {
            username:  req.body.username
        }
    });

    if (existingUser !== null) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UserError,
            errorMessage: "User with email " + req.body.email + " already exists.",
            userData: null,
        });
    }

    const newUser = await prisma.user.create({
        data: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
            email: req.body.email,
        }
    });

    req.session.userId = newUser.id;
    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        userData: getUserData(newUser),
        errorMessage: null,
    });
});

export default signUp;