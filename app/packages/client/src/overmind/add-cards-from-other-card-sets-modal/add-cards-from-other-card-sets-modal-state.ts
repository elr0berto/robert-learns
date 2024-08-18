import {CardSet} from "@elr0berto/robert-learns-shared/dist/api/models";
import {derived} from "overmind";
import {config} from "../index";
import {CardSetWithChildrenAndCardCounts, CardWithCardSetsWithFlatAncestorCardSets} from "../data/data-state";

type CardFromOtherCardSet = {
    cardWithCardSetsWithFlatAncestorCardSets: CardWithCardSetsWithFlatAncestorCardSets;
    alreadyInCurrentCardSet: boolean;
}

export type CardSetWithCardsAndChildren = {
    cardSet: CardSet;
    cards: CardFromOtherCardSet[];
    children: CardSetWithCardsAndChildren[];
}

type AddCardsFromOtherCardSetsModalState = {
    loading: boolean;
    open: boolean;
    submitting: boolean;
    submitError: string | null;
    selectedCardIds: number[];
    readonly otherCardSetsWithCardsAndChildren: CardSetWithCardsAndChildren[];
    readonly disabled: boolean;
}

export const getInitialAddCardsFromOtherCardSetsModalState = (): AddCardsFromOtherCardSetsModalState => ({
    loading: false,
    open: false,
    submitting: false,
    submitError: null,
    selectedCardIds: [],
    otherCardSetsWithCardsAndChildren: derived((state: AddCardsFromOtherCardSetsModalState, rootState: typeof config.state) => {
        const cardSet = rootState.page.cardSet;
        if (cardSet === null) {
            return [];
        }

        function getChildren(cardSetsWithChildrenAndCardCounts: CardSetWithChildrenAndCardCounts[]): CardSetWithCardsAndChildren[] {
            if (cardSet === null) {
                throw new Error('Card set is null');
            }
            return cardSetsWithChildrenAndCardCounts.filter(cs => cs.cardSet.id !== cardSet.id).map(cs => {
                const cardSetWithCardsWithCardSetsWithFlatAncestorCardSets = rootState.data.cardSetsWithCardsWithCardSetsWithFlatAncestorCardSets.find(cscwcs => cscwcs.cardSet.id === cs.cardSet.id);
                if (cardSetWithCardsWithCardSetsWithFlatAncestorCardSets === undefined) {
                    throw new Error(`Could not find card set with cards with card sets for card set ${cs.cardSet.id}`);
                }
                return {
                    cardSet: cs.cardSet,
                    cards: cardSetWithCardsWithCardSetsWithFlatAncestorCardSets.cardsWithCardSetsWithFlatAncestorCardSets.map(cwcs => {
                        if (rootState.page.cardSetWithCardsWithCardSetsWithFlatAncestorCardSets === null) {
                            throw new Error(`Could not find current card set with cards`);
                        }
                        return {
                            cardWithCardSetsWithFlatAncestorCardSets: cwcs,
                            alreadyInCurrentCardSet: rootState.page.cardSetWithCardsWithCardSetsWithFlatAncestorCardSets.cardsWithCardSetsWithFlatAncestorCardSets.map(c => c.card.id).includes(cwcs.card.id),
                        }
                    }),
                    children: getChildren(cs.children)
                };
            });
        }

        return getChildren(rootState.page.cardSetsWithChildrenAndCardCounts);
    }),
    disabled: derived((state: AddCardsFromOtherCardSetsModalState) => {
        return state.loading || state.submitting;
    }),
});

export const state: AddCardsFromOtherCardSetsModalState = getInitialAddCardsFromOtherCardSetsModalState();