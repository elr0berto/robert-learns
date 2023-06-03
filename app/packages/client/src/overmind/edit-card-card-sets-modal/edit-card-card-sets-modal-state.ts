import {Card, CardSet} from "@elr0berto/robert-learns-shared/dist/api/models";
import {derived} from "overmind";
import {config} from "../index";
import {validateUpdateCardCardSetsRequest} from "@elr0berto/robert-learns-shared/dist/api/card-set-cards";


type EditCardCardSetsModalState = {
    cardId: number | null;
    loading: boolean;
    submitting: boolean;
    submitError: string | null;
    selectedCardSetIds: number[];
    cardSets: CardSet[];
    readonly card: Card | null;
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
    cardSets: [],
    card: derived((state: EditCardCardSetsModalState, rootState: typeof config.state) => {
        if (state.cardId === null) {
            return null;
        }
        return rootState.workspaceCardSet.cards.find(c => c.id === state.cardId)!;
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
        const errors = validateUpdateCardCardSetsRequest({cardSetIds: state.selectedCardSetIds, cardId: state.cardId!});
        if (errors.length === 0) {
            return null;
        }
        return errors.join(', ');
    })
});

export const state: EditCardCardSetsModalState = getInitialEditCardCardSetsModalState();