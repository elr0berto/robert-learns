import {Router} from 'express';
import prisma from "../db/prisma";
import {
    ResponseStatus
} from "@elr0berto/robert-learns-shared/src/api/models/BaseResponse";
import {getSignedInUser, getUserData, TypedResponse} from "../common";
import { CardSide, CardFace as PrismaCardFace, Media as PrismaMedia } from '@prisma/client';
import {CardSetCardListResponseData} from "@elr0berto/robert-learns-shared/dist/api/models/CardSetCardListResponse";
import CardFace, {CardFaceData} from "@elr0berto/robert-learns-shared/dist/api/models/CardFace";
import Media, {MediaData} from "@elr0berto/robert-learns-shared/dist/api/models/Media";
import {upload} from "../multer";
import {
    CardSetUploadFileResponse,
    CardSetUploadFileResponseData
} from "@elr0berto/robert-learns-shared/dist/api/models/CardSetUploadFileResponse";

const cardSets = Router();

cardSets.get('/:cardSetId/cards', async (req, res : TypedResponse<CardSetCardListResponseData>) => {
    let user = await getSignedInUser(req.session);

    const cardSetCards = await prisma.cardSetCard.findMany({
        where: {
            cardSetId: {
                equals: parseInt(req.params.cardSetId)
            }
        },
        include: {
            card : {
                include: {
                    faces: {
                        include: {
                            media: true,
                        }
                    },
                    audio: true,
                },
            },
        },
    });

    function getMediaData(media: PrismaMedia | null) : MediaData | null {
        if (media === null) {
            return null;
        }
        return {
            id: media.id,
            path: media.path,
            name: media.name,
        };
    }

    function getFaceData(face: PrismaCardFace & { media : PrismaMedia} | null) : CardFaceData | null {
        if (face === null) {
            return null;
        }
        return {
            content: face.content,
            side: face.side,
            media: getMediaData(face.media),
        };
    }

    return res.json({
        status: ResponseStatus.Success,
        user: getUserData(user),
        errorMessage: null,
        cards: cardSetCards.map(csc => {
            const front = csc.card.faces.filter(f => f.side === CardSide.FRONT)[0];
            const backs = csc.card.faces.filter(f => f.side === CardSide.BACK);
            const back = backs.length === 1 ? backs[0] : null;
            return {
                id: csc.card.id,
                front: getFaceData(front)!,
                back: getFaceData(back),
                audio: getMediaData(csc.card.audio)
            };
        })
    })
});

cardSets.post('/:cardSetId/uploadFile', upload.single('file'), async (req, res : TypedResponse<CardSetUploadFileResponseData>) => {
    let user = await getSignedInUser(req.session);

    return res.json({
        status: ResponseStatus.Success,
        user: getUserData(user),
        errorMessage: null,
        url: req.file!.path,
    });
});

export default cardSets;