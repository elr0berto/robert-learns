import {Card, CardSet} from "@elr0berto/robert-learns-shared/dist/api/models";
import {derived} from "overmind";
import {config} from "../index";


type EditCardCardSetsModalState = {
    cardId: number | null;
    loading: boolean;
    submitting: boolean;
    submitError: string | null;
    selectedCardSetIds: number[];
    cardSets: CardSet[];
    readonly card: Card | null;
    readonly open: boolean;
    readonly disabled: boolean;
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
        return rootState.workspaceCardSet.cards.find(c => c.id)!;
    }),
    open: derived((state: EditCardCardSetsModalState) => {
        return state.cardId !== null;
    }),
    disabled: derived((state: EditCardCardSetsModalState) => {
        return state.loading || state.submitting;
    }),
});

export const state: EditCardCardSetsModalState = getInitialEditCardCardSetsModalState();