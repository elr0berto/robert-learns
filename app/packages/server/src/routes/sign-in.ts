import {Router} from 'express';
import prisma from "../db/prisma";
import {BaseResponseData, ResponseStatus} from "@elr0berto/robert-learns-shared/src/api/models/BaseResponse";

const signIn = Router();

signIn.get('/check', async (req, res) => {
    if (!req.session.userId) {
        let guestUser = await prisma.user.findFirst({
            where: {
                isGuest: true
            }
        });

        if (guestUser === null) {
            guestUser = await prisma.user.create({
                data: {
                    firstName: 'Guest',
                    lastName: '',
                    username: 'guest',
                    password: '25uihdsfoi2345esfdoij23t',
                    email: 'guest@robert-learns.com',
                    isGuest: true,
                }
            });
        }

        req.session.userId = guestUser.id;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: req.session.userId!
        }
    });

    let resp : BaseResponseData;
    if (user === null) {
        resp = {
            status: ResponseStatus.UserError,
            errorMessage: "Login/password is wrong",
            user: null,
        };
        return res.json(resp);
    }

    resp = {
        status: ResponseStatus.Success,
        errorMessage: null,
        user: {
            id: user.id,
            email: user.email,
            firstName : user.firstName,
            lastName:user.lastName,
            username: user.username,
            isGuest : user.isGuest
        },
    };

    return res.json(resp);
});

export default signIn;