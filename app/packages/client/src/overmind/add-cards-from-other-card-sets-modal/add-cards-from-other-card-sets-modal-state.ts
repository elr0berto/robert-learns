import {Card, CardSet, CardSetCard} from "@elr0berto/robert-learns-shared/dist/api/models";
import {derived} from "overmind";
import {config} from "../index";

type CardSetWithCards = CardSet & {
    cards: Card[];
}

type AddCardsFromOtherCardSetsModalState = {
    loading: boolean;
    cardSetId: number | null;
    cardSets: CardSet[];
    cardSetCards: CardSetCard[];
    cards: Card[];
    submitting: boolean;
    readonly otherCardSetsWithCards: CardSetWithCards[];
    readonly cardSet: CardSet | null;
    readonly open: boolean;
    readonly disabled: boolean;
}

export const getInitialAddCardsFromOtherCardSetsModalState = (): AddCardsFromOtherCardSetsModalState => ({
    loading: false,
    cardSetId: null,
    cardSets: [],
    cardSetCards: [],
    cards: [],
    submitting: false,
    otherCardSetsWithCards: derived((state: AddCardsFromOtherCardSetsModalState) => {
        if (state.cardSetId === null) {
            return [];
        }
        return state.cardSets.map(cs => {
            return {
                ...cs,
                cards: state.cardSetCards.filter(c => c.cardSetId === cs.id).map(csc => state.cards.filter(c => c.id === csc.cardId)[0]),
            };
        });
    }),
    cardSet: derived((state: AddCardsFromOtherCardSetsModalState, rootState: typeof config.state) => {
        if (state.cardSetId === null) {
            return null;
        }
        const found = rootState.workspace.cardSets.filter(cs => cs.id === state.cardSetId);
        if (found.length !== 1) {
            return null;
        }
        return found[0];
    }),
    open: derived((state: AddCardsFromOtherCardSetsModalState) => {
        return state.cardSetId !== null;
    }),
    disabled: derived((state: AddCardsFromOtherCardSetsModalState) => {
        return state.loading || state.submitting;
    }),
});

export const state: AddCardsFromOtherCardSetsModalState = getInitialAddCardsFromOtherCardSetsModalState();