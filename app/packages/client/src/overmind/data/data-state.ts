import {derived} from "overmind";
import {Card, User, Workspace, WorkspaceUser, CardSetCard, CardSet} from "@elr0berto/robert-learns-shared/dist/api/models";

export type CardSetWithCards = {
    cardSet: CardSet;
    cards: Card[];
}

export type CardWithCardSets = {
    card: Card;
    cardSets: CardSet[];
}

export type CardSetWithCardsWithCardSets = {
    cardSet: CardSet;
    cardsWithCardSets: CardWithCardSets[];
}

export type WorkspaceWithWorkspaceUsers = {
    workspace: Workspace;
    workspaceUsers: WorkspaceUser[];
}

export type WorkspaceWithCardSetsCount = {
    workspace: Workspace;
    cardSetsCount: number;
}

type DataState = {
    workspaces: Workspace[];
    loadingWorkspaces: boolean;
    workspaceUsers: WorkspaceUser[];
    loadingWorkspaceUsers: boolean;
    users: User[];
    loadingUsers: boolean;
    cards: Card[];
    loadingCards: boolean;
    cardSetCards: CardSetCard[];
    loadingCardSetCards: boolean;
    cardSets: CardSet[];
    loadingCardSets: boolean;

    readonly workspacesWithWorkspaceUsers: WorkspaceWithWorkspaceUsers[];
    readonly workspacesWithCardSetsCounts: WorkspaceWithCardSetsCount[];
    readonly cardSetsWithCards: CardSetWithCards[];
    readonly cardsWithCardSets: CardWithCardSets[];
    readonly cardSetsWithCardsWithCardSets: CardSetWithCardsWithCardSets[];
}

export const getInitialDataState = () : DataState => ({
    workspaces: [],
    loadingWorkspaces: false,
    workspaceUsers: [],
    loadingWorkspaceUsers: false,
    users: [],
    loadingUsers: false,
    cards: [],
    loadingCards: false,
    cardSetCards: [],
    loadingCardSetCards: false,
    cardSets: [],
    loadingCardSets: false,
    workspacesWithWorkspaceUsers: derived((state: DataState) => {
        return state.workspaces.map(w => ({
            workspace: w,
            workspaceUsers: state.workspaceUsers.filter(wu => wu.workspaceId === w.id),
        }));
    }),
    workspacesWithCardSetsCounts: derived((state: DataState) => {
        return state.workspaces.map(w => ({
            workspace: w,
            cardSetsCount: state.cardSets.filter(cs => cs.workspaceId === w.id).length,
        }));
    }),
    cardSetsWithCards: derived((state: DataState) => {
        return state.cardSetsWithCardsWithCardSets.map(cs => ({
            cardSet: cs.cardSet,
            cards: cs.cardsWithCardSets.map(cwcs => cwcs.card),
        }));
    }),
    cardsWithCardSets: derived((state: DataState) => {
        return state.cards.map(c => ({
            card: c,
            cardSets: state.cardSetCards.filter(csc => csc.cardId === c.id).map(csc => {
                const cardSet = state.cardSets.find(cs => cs.id === csc.cardSetId);
                if (cardSet === undefined) {
                    throw new Error(`CardSet with id ${csc.cardSetId} not found`);
                }
                return cardSet;
            }),
        }));
    }),
    cardSetsWithCardsWithCardSets: derived((state: DataState) => {
        return state.cardSets.map(cs => ({
            cardSet: cs,
            cardsWithCardSets: state.cardSetCards.filter(csc => csc.cardSetId === cs.id && state.cards.find(c => c.id === csc.cardId) !== undefined)
                .sort((a,b) => a.order - b.order)
                .reverse()
                .map(csc => {
                    const card = state.cards.find(c => c.id === csc.cardId);
                    if (card === undefined) {
                        throw new Error(`Card with id ${csc.cardId} not found`);
                    }
                    return {
                        card,
                        cardSets: state.cardSetCards.filter(csc => csc.cardId === card.id).map(csc => {
                            const cardSet = state.cardSets.find(cs => cs.id === csc.cardSetId);
                            if (cardSet === undefined) {
                                throw new Error(`CardSet with id ${csc.cardSetId} not found`);
                            }
                            return cardSet;
                        }),
                    };
                })
                .filter(c => c !== null),
        }));
    }),
});

export const state: DataState = getInitialDataState();