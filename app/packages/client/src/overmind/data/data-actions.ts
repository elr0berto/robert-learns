import { Context } from '..';
import {Card, CardSet, CardSetCard, Drill, User} from "@elr0berto/robert-learns-shared/dist/api/models";
import {GetCardSetsResponse} from "@elr0berto/robert-learns-shared/dist/api/card-sets";

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

export const addOrUpdateCardSetCardsForCard = ({state} : Context, {card, cardSetCards}: {card: Card, cardSetCards: CardSetCard[]}) => {
    state.data.cardSetCards = state.data.cardSetCards.filter(csc => csc.cardId !== card.id);
    state.data.cardSetCards.push(...cardSetCards);
}

export const addOrUpdateCardSetCardsForCardId = ({state} : Context, {cardId, cardSetCards}: {cardId: number, cardSetCards: CardSetCard[]}) => {
    state.data.cardSetCards = state.data.cardSetCards.filter(csc => csc.cardId !== cardId);
    state.data.cardSetCards.push(...cardSetCards);
}

export const addOrUpdateCardSetCardsForCardSetId = ({state} : Context, {cardSetId, cardSetCards}: {cardSetId: number, cardSetCards: CardSetCard[]}) => {
    state.data.cardSetCards = state.data.cardSetCards.filter(csc => csc.cardSetId !== cardSetId);
    state.data.cardSetCards.push(...cardSetCards);
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

    const resp = await effects.api.drills.getDrills();

    if (resp.drills === null) {
        throw new Error('resp.drills is null');
    }
    state.data.drills = resp.drills;

    state.data.loadingDrills = false;
}

export const addOrUpdateDrill = ({state} : Context, drill: Drill) => {
    const index = state.data.drills.findIndex(d => d.id === drill.id);
    if (index === -1) {
        state.data.drills.push(drill);
    } else {
        state.data.drills[index] = drill;
    }
}