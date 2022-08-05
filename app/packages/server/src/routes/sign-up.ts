import {Router} from 'express';
import prisma from "../db/prisma";
import {BaseResponseData, ResponseStatus} from "@elr0berto/robert-learns-shared/src/api/models/BaseResponse";

const signUp = Router();

signUp.post('/submit', async (_req, res) => {
    return res.json({blah: true});
});

export default signUp;