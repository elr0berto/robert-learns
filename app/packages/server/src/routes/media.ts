import {Router} from 'express';
import { getSignedInUser } from '../common.js';
import prisma from "../db/prisma.js";


const media = Router();

media.get('/:mediaId/*', async (req, res) => {
    const user = await getSignedInUser(req.session);

    const media = await prisma.media.findFirst({
        where: {
            id: parseInt(req.params.mediaId)
        }
    });

    if (media === null) {
        throw new Error('missing media: ' + req.params.mediaId);
    }

    res.download(media.path, media.name);
});

export default media;