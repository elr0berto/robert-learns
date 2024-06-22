import {CardSet} from "@elr0berto/robert-learns-shared/dist/api/models";
import {derived} from "overmind";
import {config} from "../index";
import {CardSetWithChildren, CardWithCardSets} from "../data/data-state";

type CardFromOtherCardSet = {
    cardWithCardSets: CardWithCardSets;
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

        function getChildren(cardSetsWithChildren: CardSetWithChildren[]): CardSetWithCardsAndChildren[] {
            if (cardSet === null) {
                throw new Error('Card set is null');
            }
            return cardSetsWithChildren.filter(cs => cs.cardSet.id !== cardSet.id).map(cs => {
                const cardSetWithCardsWithCardSets = rootState.data.cardSetsWithCardsWithCardSets.find(cscwcs => cscwcs.cardSet.id === cs.cardSet.id);
                if (cardSetWithCardsWithCardSets === undefined) {
                    throw new Error(`Could not find card set with cards with card sets for card set ${cs.cardSet.id}`);
                }
                return {
                    cardSet: cs.cardSet,
                    cards: cardSetWithCardsWithCardSets.cardsWithCardSets.map(cwcs => {
                        if (rootState.page.cardSetWithCardsWithCardSets === null) {
                            throw new Error(`Could not find current card set with cards`);
                        }
                        return {
                            cardWithCardSets: cwcs,
                            alreadyInCurrentCardSet: rootState.page.cardSetWithCardsWithCardSets.cardsWithCardSets.map(c => c.card.id).includes(cwcs.card.id),
                        }
                    }),
                    children: getChildren(cs.children)
                };
            });
        }

        return getChildren(rootState.page.cardSetsWithChildren);
    }),
    disabled: derived((state: AddCardsFromOtherCardSetsModalState) => {
        return state.loading || state.submitting;
    }),
});

export const state: AddCardsFromOtherCardSetsModalState = getInitialAddCardsFromOtherCardSetsModalState();