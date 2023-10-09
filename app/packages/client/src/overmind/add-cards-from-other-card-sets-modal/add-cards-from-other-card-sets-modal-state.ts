import {CardSet} from "@elr0berto/robert-learns-shared/dist/api/models";
import {derived} from "overmind";
import {config} from "../index";
import {CardWithCardSets} from "../data/data-state";

type CardFromOtherCardSet = {
    cardWithCardSets: CardWithCardSets;
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

        return rootState.data.cardSetsWithCardsWithCardSets.filter(cs => cs.cardSet.id !== cardSet.id && cs.cardsWithCardSets.length > 0).map(cs => {
            return {
                cardSet: cs.cardSet,
                cards: cs.cardsWithCardSets.map(cwcs => {
                    if (rootState.page.cardSetWithCardsWithCardSets === null) {
                        throw new Error(`Could not find current card set with cards`);
                    }
                    return {
                        cardWithCardSets: cwcs,
                        selected: state.selectedCardIds.includes(cwcs.card.id),
                        alreadyInCurrentCardSet: rootState.page.cardSetWithCardsWithCardSets.cardsWithCardSets.map(c => c.card.id).includes(cwcs.card.id),
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