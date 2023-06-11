import {Card, CardSet, CardSetCard} from "@elr0berto/robert-learns-shared/dist/api/models";
import {derived} from "overmind";
import {config} from "../index";

type CardFromOtherCardSet = {
    card: Card;
    selected: boolean;
    alreadyInCurrentCardSet: boolean;
}

type CardSetWithCards = {
    cardSet: CardSet;
    cards: CardFromOtherCardSet[];
}

type AddCardsFromOtherCardSetsModalState = {
    loading: boolean;
    open: boolean;
    submitting: boolean;
    submitError: string | null;
    selectedCardIds: number[];
    readonly otherCardSetsWithCards: CardSetWithCards[];
    readonly disabled: boolean;
}

export const getInitialAddCardsFromOtherCardSetsModalState = (): AddCardsFromOtherCardSetsModalState => ({
    loading: false,
    open: false,
    submitting: false,
    submitError: null,
    selectedCardIds: [],
    otherCardSetsWithCards: derived((state: AddCardsFromOtherCardSetsModalState, rootState: typeof config.state) => {
        const cardSet = rootState.page.cardSet;
        if (cardSet === null) {
            return [];
        }

        return rootState.data.cardSetsWithCards.filter(cs => cs.cardSet.id !== cardSet.id && cs.cards.length > 0).map(cs => {
            return {
                cardSet: cs.cardSet,
                cards: cs.cards.map(c => {
                    return {
                        card: c,
                        selected: state.selectedCardIds.includes(c.id),
                        alreadyInCurrentCardSet: rootState.page.cardSetWithCards!.cards.map(c => c.id).includes(c.id),
                    }
                }),
            };
        });
    }),
    disabled: derived((state: AddCardsFromOtherCardSetsModalState) => {
        return state.loading || state.submitting;
    }),
});

export const state: AddCardsFromOtherCardSetsModalState = getInitialAddCardsFromOtherCardSetsModalState();