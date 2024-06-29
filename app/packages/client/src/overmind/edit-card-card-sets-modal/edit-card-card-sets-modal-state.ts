import {derived} from "overmind";
import {config} from "../index";
import {validateUpdateCardCardSetsRequest} from "@elr0berto/robert-learns-shared/dist/api/card-set-cards";
import {CardSetWithChildren, CardWithCardSetsWithFlatAncestorCardSets} from "../data/data-state";


type EditCardCardSetsModalState = {
    cardId: number | null;
    loading: boolean;
    submitting: boolean;
    submitError: string | null;
    selectedCardSetIds: number[];
    readonly cardWithCardSetsWithFlatAncestorCardSets: CardWithCardSetsWithFlatAncestorCardSets | null;
    readonly cardSetsWithChildren: CardSetWithChildren[];
    readonly open: boolean;
    readonly formDisabled: boolean;
    readonly submitDisabled: boolean;
    readonly closeDisabled: boolean;
    readonly validationError: string | null;
}

export const getInitialEditCardCardSetsModalState = (): EditCardCardSetsModalState => ({
    loading: false,
    cardId: null,
    submitting: false,
    submitError: null,
    selectedCardSetIds: [],
    cardWithCardSetsWithFlatAncestorCardSets: derived((state: EditCardCardSetsModalState, rootState: typeof config.state) => {
        if (state.cardId === null) {
            return null;
        }
        const ret = rootState.page.cardsWithCardSetsWithFlatAncestorCardSets.find(c => c.card.id === state.cardId);
        if (ret === undefined) {
            throw new Error('Card not found: ' + state.cardId);
        }
        return ret;
    }),
    cardSetsWithChildren: derived((state: EditCardCardSetsModalState, rootState: typeof config.state) => {
        return rootState.page.cardSetsWithChildren;
    }),
    open: derived((state: EditCardCardSetsModalState) => {
        return state.cardId !== null;
    }),
    formDisabled: derived((state: EditCardCardSetsModalState) => {
        return state.loading || state.submitting;
    }),
    submitDisabled: derived((state: EditCardCardSetsModalState) => {
        return state.loading || state.submitting || state.validationError !== null;
    }),
    closeDisabled: derived((state: EditCardCardSetsModalState) => {
        return state.loading || state.submitting;
    }),
    validationError: derived((state: EditCardCardSetsModalState) => {
        if (state.cardId === null) {
            console.warn('EditCardCardSetsModalState validationError derived state.cardId is null (this is ok during development)');
            return null;
        }
        const errors = validateUpdateCardCardSetsRequest({cardSetIds: state.selectedCardSetIds, cardId: state.cardId});
        if (errors.length === 0) {
            return null;
        }
        return errors.join(', ');
    })
});

export const state: EditCardCardSetsModalState = getInitialEditCardCardSetsModalState();