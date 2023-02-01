import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {getSignedInUser, getUserData, TypedResponse} from "../common.js";
import bcrypt from 'bcryptjs';
import { SignUpRequest, validateSignUpRequest } from '@elr0berto/robert-learns-shared/api/sign-up';
import { BaseResponseData, ResponseStatus } from '@elr0berto/robert-learns-shared/api/models';
const users = Router();

users.get('/getByEmail', async (req: Request<{}, {}, sdsad>, res : TypedResponse<BaseResponseData>) => {

});

export default users;