import { Context } from '..';
import {
    Card,
    CardSet,
    CardSetCard,
    Drill,
    DrillCardSet,
    DrillRun, DrillRunQuestion,
    User
} from "@elr0berto/robert-learns-shared/dist/api/models";

export const clean = ({state} : Context) => {
    // loop over cardSets and remove any cardSets that don't have a workspaceId in state.data.workspaces
    state.data.cardSets = state.data.cardSets.filter(cs => state.data.workspaces.find(w => w.id === cs.workspaceId));

    // loop over cardSetCards and remove any cardSetCards that don't have a cardSetId in state.data.cardSets
    state.data.cardSetCards = state.data.cardSetCards.filter(csc => state.data.cardSets.find(cs => cs.id === csc.cardSetId));

    // loop over cardSetCards and remove any cardSetCards that don't have a cardId in state.data.cards
    state.data.cardSetCards = state.data.cardSetCards.filter(csc => state.data.cards.find(c => c.id === csc.cardId));

    // loop over cards and remove any cards that don't have a cardId in state.data.cardSetCards
    state.data.cards = state.data.cards.filter(c => state.data.cardSetCards.find(csc => csc.cardId === c.id));

    // loop over workspaceUsers and remove any workspaceUser that doesn't have a workspaceId in state.data.workspaces
    state.data.workspaceUsers = state.data.workspaceUsers.filter(wu => state.data.workspaces.find(w => w.id === wu.workspaceId));
}
export const loadWorkspaces = async ({state,effects} : Context) => {
    state.data.loadingWorkspaces = true;

    const resp = await effects.api.workspaces.getWorkspaces();

    if (resp.workspaces === null) {
        throw new Error('resp.workspaces is null');
    }
    state.data.workspaces = resp.workspaces;
    state.data.loadingWorkspaces = false;
}

export const loadCardSets = async ({state,effects,actions} : Context, workspaceIds: number[]) => {
    state.data.loadingCardSets = true;

    const resp = await effects.api.cardSets.getCardSets({workspaceIds});

    if (resp.cardSets === null) {
        throw new Error('resp.cardSets is null');
    }

    actions.data.addOrUpdateCardSetsForWorkspaceIds({workspaceIds, cardSets: resp.cardSets});

    state.data.loadingCardSets = false;
}

export const loadCardSetCards = async ({state,effects,actions} : Context, request: {cardIds?: number[], cardSetIds?: number[]}) => {
    state.data.loadingCardSetCards = true;

    const resp = await effects.api.cardSetCards.getCardSetCards(request);

    if (resp.cardSetCards === null) {
        throw new Error('resp.cardSetCards is null');
    }

    if (typeof request.cardIds !== 'undefined') {
        // loop over cardIds
        request.cardIds.forEach(cardId => {
            if (resp.cardSetCards === null) {
                throw new Error('resp.cardSetCards is null');
            }
            actions.data.addOrUpdateCardSetCardsForCardId({cardId, cardSetCards: resp.cardSetCards.filter(csc => csc.cardId === cardId)});
        });
    } else if (typeof request.cardSetIds !== 'undefined') {
        // loop over cardSetIds
        request.cardSetIds.forEach(cardSetId => {

            if (resp.cardSetCards === null) {
                throw new Error('resp.cardSetCards is null');
            }
            actions.data.addOrUpdateCardSetCardsForCardSetId({cardSetId, cardSetCards: resp.cardSetCards.filter(csc => csc.cardSetId === cardSetId)});
        });
    }

    state.data.loadingCardSetCards = false;
}

export const loadCards = async ({state,effects,actions} : Context, cardIds: number[]) => {
    if (cardIds.length === 0) {
        return;
    }
    state.data.loadingCards = true;

    const resp = await effects.api.cards.getCards({cardIds});

    if (resp.cards === null) {
        throw new Error('resp.cards is null');
    }

    // loop over resp.cards and run addOrUpdateCard for each card
    resp.cards.forEach(c => actions.data.addOrUpdateCard(c));

    state.data.loadingCards = false;
}

export const loadCardsWithCardSets = async ({state,effects,actions} : Context, params: {workspaceId: number, cardIds: number[]}) => {
    await actions.data.loadCards(params.cardIds);
    await actions.data.loadCardSetCards({cardIds: params.cardIds});
    await actions.data.loadCardSets([params.workspaceId]);
    actions.data.clean();
}

export const loadWorkspaceUsers = async ({state,effects} : Context, workspaceIds: number[]) => {
    state.data.loadingWorkspaceUsers = true;

    const resp = await effects.api.workspaceUsers.getWorkspaceUsers({workspaceIds});

    if (resp.workspaceUsers === null) {
        throw new Error('resp.workspaceUsers is null');
    }
    state.data.workspaceUsers = resp.workspaceUsers;

    state.data.loadingWorkspaceUsers = false;
}

export const loadUsers = async ({state,effects,actions} : Context, userIds: number[]) => {
    state.data.loadingUsers = true;

    // get unique userIds
    const uniqueUserIds = userIds.filter((v, i, a) => a.indexOf(v) === i);

    const resp = await effects.api.users.getUsers({userIds: uniqueUserIds});

    if (resp.users === null) {
        throw new Error('resp.users is null');
    }

    // foreach user in resp.users, run addOrUpdateUser
    resp.users.forEach(u => actions.data.addOrUpdateUser(u));

    state.data.loadingUsers = false;
}

export const addOrUpdateUser = ({state} : Context, user: User) => {
    const index = state.data.users.findIndex(u => u.id === user.id);
    if (index === -1) {
        state.data.users.push(user);
    } else {
        state.data.users[index] = user;
    }
}

export const addOrUpdateCardSetsForWorkspaceIds = ({state} : Context, params: {cardSets: CardSet[], workspaceIds: number[]}) => {
    state.data.cardSets = state.data.cardSets.filter(cs => !params.workspaceIds.includes(cs.workspaceId));
    state.data.cardSets.push(...params.cardSets);
}

export const addOrUpdateCard = ({state} : Context, card: Card) => {
    const index = state.data.cards.findIndex(c => c.id === card.id);
    if (index === -1) {
        state.data.cards.push(card);
    } else {
        state.data.cards[index] = card;
    }
}

export const addOrUpdateCardSetCardsForCard = ({actions} : Context, {card, cardSetCards}: {card: Card, cardSetCards: CardSetCard[]}) => {
    actions.data.addOrUpdateCardSetCardsForCardId({cardId: card.id, cardSetCards});
}

export const addOrUpdateCardSetCardsForCardId = ({state} : Context, {cardId, cardSetCards}: {cardId: number, cardSetCards: CardSetCard[]}) => {
    // make a copy of state.data.cardSetCards
    let copy = [...state.data.cardSetCards];

    // remove all cardSetCards that have cardId and that is not in cardSetCards
    copy = copy.filter(csc => csc.cardId !== cardId || cardSetCards.find(csc2 => csc2.cardSetId === csc.cardSetId) !== undefined);

    // update the cardSetCards order property for all the existing cardSetCards
    copy = copy.map(csc => {
        if (csc.cardId !== cardId) {
            return csc;
        }
        const newCsc2 = cardSetCards.find(csc2 => csc2.cardSetId === csc.cardSetId);
        if (typeof newCsc2 !== 'undefined') {
            csc.order = newCsc2.order;
        }
        return csc;
    });

    // add new cardSetCards that are not in copy yet
    cardSetCards.forEach(csc => {
        if (copy.find(csc2 => csc2.cardSetId === csc.cardSetId && csc2.cardId === csc.cardId) === undefined) {
            copy.push(csc);
        }
    });

    state.data.cardSetCards = copy;
}

export const addOrUpdateCardSetCardsForCardSetId = ({state} : Context, {cardSetId, cardSetCards}: {cardSetId: number, cardSetCards: CardSetCard[]}) => {
    let copy = [...state.data.cardSetCards];

    // remove all cardSetCards that have cardSetId and that is not in cardSetCards
    copy = copy.filter(csc => csc.cardSetId !== cardSetId || cardSetCards.find(csc2 => csc2.cardId === csc.cardId) !== undefined);

    // update the order
    copy = copy.map(csc => {
        if (csc.cardSetId !== cardSetId) {
            return csc;
        }
        const newCsc2 = cardSetCards.find(csc2 => csc2.cardId === csc.cardId);
        if (typeof newCsc2 !== 'undefined') {
            csc.order = newCsc2.order;
        }
        return csc;
    });

    // add new
    cardSetCards.forEach(csc => {
        if (copy.find(csc2 => csc2.cardId === csc.cardId && csc2.cardSetId === csc.cardSetId) === undefined) {
            copy.push(csc);
        }
    });

    state.data.cardSetCards = copy;
}

export const deleteCard = ({state, actions} : Context, params: {cardId: number, cardSetId: number}) => {
    state.data.cardSetCards = state.data.cardSetCards.filter(csc => csc.cardId !== params.cardId || csc.cardSetId !== params.cardSetId);
    actions.data.clean();
}

export const deleteWorkspace = ({state} : Context, workspaceId: number) => {
    state.data.workspaceUsers = state.data.workspaceUsers.filter(wu => wu.workspaceId !== workspaceId);
    state.data.workspaces = state.data.workspaces.filter(w => w.id !== workspaceId);
}

export const deleteCardSet = ({state} : Context, cardSetId: number) => {
    state.data.cardSets = state.data.cardSets.filter(cs => cs.id !== cardSetId);
    // don't need to delete cardSetCards because card sets can only be deleted if it has no card-set-cards.
    // check if there's any card-set-cards that refer to the card set id
    const cardSetCards = state.data.cardSetCards.filter(csc => csc.cardSetId === cardSetId);
    if (cardSetCards.length > 0) {
        throw new Error('cardSetCards.length > 0 when deleting card set id: ' + cardSetId);
    }
}

export const loadDrills = async ({state,effects} : Context) => {
    state.data.loadingDrills = true;

    const resp = await effects.api.drills.getDrills({});

    if (resp.drills === null) {
        throw new Error('resp.drills is null');
    }
    state.data.drills = resp.drills;

    state.data.loadingDrills = false;
}

export const loadDrillCardSets = async ({state,effects} : Context, drillIds: number[]) => {
    state.data.loadingDrillCardSets = true;

    const resp = await effects.api.drillCardSets.getDrillCardSets({drillIds});

    if (resp.drillCardSets === null) {
        throw new Error('resp.drillCardSets is null, msg: ' + (resp.errorMessage ?? 'null'));
    }
    state.data.drillCardSets = resp.drillCardSets;

    state.data.loadingDrillCardSets = false;
}

export const addOrUpdateDrillCardSetsForDrillId = ({state} : Context, {drillId, drillCardSets}: {drillId: number, drillCardSets: DrillCardSet[]}) => {
    state.data.drillCardSets = state.data.drillCardSets.filter(dcs => dcs.drillId !== drillId);
    state.data.drillCardSets.push(...drillCardSets);
}

export const addOrUpdateDrills = ({state} : Context, drills: Drill[]) => {
    drills.forEach(d => {
        const index = state.data.drills.findIndex(dr => dr.id === d.id);
        if (index === -1) {
            state.data.drills.push(d);
        } else {
            state.data.drills[index] = d;
        }
    });
}

export const addOrUpdateDrillRuns = ({state} : Context, drillRuns: DrillRun[]) => {
    drillRuns.forEach(dr => {
        const index = state.data.drillRuns.findIndex(d => d.id === dr.id);
        if (index === -1) {
            state.data.drillRuns.push(dr);
        } else {
            state.data.drillRuns[index] = dr;
        }
    });
}

export const addOrUpdateDrillRunQuestions = ({state} : Context, drillRunQuestions: DrillRunQuestion[]) => {
    drillRunQuestions.forEach(drq => {
        const index = state.data.drillRunQuestions.findIndex(d => d.id === drq.id);
        if (index === -1) {
            state.data.drillRunQuestions.push(drq);
        } else {
            state.data.drillRunQuestions[index] = drq;
        }
    });
}

export const loadDrillRuns = async ({state,effects,actions} : Context, {drillRunIds}: {drillRunIds: number[]}) => {
    state.data.loadingDrillRuns = true;
    const resp = await effects.api.drillRuns.getDrillRuns({drillRunIds: drillRunIds});

    if (resp.drillRuns === null) {
        throw new Error('resp.drillRuns is null');
    }
    if (resp.drillRunQuestions === null) {
        throw new Error('resp.drillRunQuestions is null');
    }

    const drillIds = resp.drillRuns.map(dr => dr.drillId);
    const dResp = await effects.api.drills.getDrills({drillIds: drillIds});
    if (dResp.drills === null) {
        throw new Error('dResp.drills is null');
    }

    await actions.data.loadCards(resp.drillRunQuestions.map(drq => drq.cardId));

    actions.data.addOrUpdateDrills(dResp.drills);
    actions.data.addOrUpdateDrillRuns(resp.drillRuns);
    actions.data.addOrUpdateDrillRunQuestions(resp.drillRunQuestions);
}

export const answerDrillRunQuestion = async ({state,effects,actions} : Context, {drillRunQuestionId, correct}: {drillRunQuestionId: number, correct: boolean}) => {
    // find the drillRunQuestion
    const drillRunQuestion = state.data.drillRunQuestions.find(drq => drq.id === drillRunQuestionId);
    if (typeof drillRunQuestion === 'undefined') {
        throw new Error('drillRunQuestion not found');
    }
    // set the answer
    drillRunQuestion.correct = correct;
}

export const loadCardSetLinks = async ({state,effects} : Context, {cardSetIds}: {cardSetIds: number[]}) => {
    state.data.loadingCardSetLinks = true;

    const resp = await effects.api.cardSetLinks.getCardSetLinks({cardSetIds});

    if (resp.cardSetLinks === null) {
        throw new Error('resp.cardSetLinks is null');
    }
    state.data.cardSetLinks = resp.cardSetLinks;

    state.data.loadingCardSetLinks = false;
}