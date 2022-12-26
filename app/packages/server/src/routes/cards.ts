import {Request, Router} from 'express';
import {getSignedInUser, TypedResponse} from '../common.js';
import prisma from "../db/prisma.js";
import {upload} from "../multer.js";
import {CardCreateResponse} from "@elr0berto/robert-learns-shared/api/models";
import {CardCreateRequest} from "@elr0berto/robert-learns-shared/api/cards";


const cards = Router();

cards.post('/card-create',  upload.single('file'), async (req: Request<{}, {}, CardCreateRequest>, res: TypedResponse<CardCreateResponse>) => {
    const user = await getSignedInUser(req.session);


});

export default cards;