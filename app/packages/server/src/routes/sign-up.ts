import {Request, Router} from 'express';
import prisma from "../db/prisma";
import {BaseResponseData, ResponseStatus} from "@elr0berto/robert-learns-shared/src/api/models/BaseResponse";
import {SignUpRequest, validateSignUpRequest} from "@elr0berto/robert-learns-shared/src/api/sign-up";
import {getSignedInUser, getUserData, TypedResponse} from "../common";
import bcrypt from 'bcryptjs';
const signUp = Router();

signUp.post('/', async (req: Request<{}, {}, SignUpRequest>, res : TypedResponse<BaseResponseData>) => {
    const signedInUser = await getSignedInUser(req.session);

    if (!signedInUser.isGuest) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'already signed in, please sign out first.',
            user: null,
        });
    }

    let errors : string[] = validateSignUpRequest(req.body);

    if (errors.length > 0) {
        return res.json({
            status: ResponseStatus.UserError,
            errorMessage: errors.join('. '),
            user: null,
        });
    }

    let existingUser = await prisma.user.findFirst({
        where: {
            email:  req.body.email
        }
    });

    if (existingUser !== null) {
        return res.json({
            status: ResponseStatus.UserError,
            errorMessage: "User with email " + req.body.email + " already exists.",
            user: null,
        });
    }

    existingUser = await prisma.user.findFirst({
        where: {
            username:  req.body.username
        }
    });

    if (existingUser !== null) {
        return res.json({
            status: ResponseStatus.UserError,
            errorMessage: "User with email " + req.body.email + " already exists.",
            user: null,
        });
    }

    const newUser = await prisma.user.create({
        data: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
            email: req.body.email,
            isGuest: false,
        }
    });

    req.session.userId = newUser.id;
    return res.json({
        status: ResponseStatus.Success,
        user: getUserData(newUser),
        errorMessage: null,
    });
});

export default signUp;