import {Request, Router} from 'express';
import prisma from "../db/prisma";
import {BaseResponseData, ResponseStatus} from "@elr0berto/robert-learns-shared/src/api/models/BaseResponse";
import {SignUpSubmitRequest, ValidateSignUpRequest} from "@elr0berto/robert-learns-shared/src/api/sign-up";
import {getSignedInUser, TypedResponse} from "../common";

const signUp = Router();

signUp.post('/submit', async (req: Request<{}, {}, SignUpSubmitRequest>, res : TypedResponse<BaseResponseData>) => {
    const signedInUser = await getSignedInUser(req.session);

    if (!signedInUser.isGuest) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'already signed in, please sign out first.',
            user: null,
        });
    }

    let errors : string[] = ValidateSignUpRequest(req.body);

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

    return res.json({blah: true});
});

export default signUp;