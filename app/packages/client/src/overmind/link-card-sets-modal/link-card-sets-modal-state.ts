import {derived} from "overmind";
import {config} from "../index";

type LinkCardSetsModalState = {
    cardSetId: number | null;
    loading: boolean;
    saving: boolean;
    originalSelectedCardSetIds: number[];
    selectedCardSetIds: number[];
    readonly open: boolean;
    readonly disabled: boolean;
    readonly hasChanges: boolean;
}

export const getInitialLinkCardSetsModalState = (cardSetId: number | null): LinkCardSetsModalState => ({
    cardSetId: cardSetId,
    loading: true,
    saving: false,
    originalSelectedCardSetIds: [],
    selectedCardSetIds: [],
    open: derived((state: LinkCardSetsModalState) => {
        return state.cardSetId !== null;
    }),
    disabled: derived((state: LinkCardSetsModalState) => {
        return state.loading || state.saving;
    }),
    hasChanges: derived((state: LinkCardSetsModalState) => {
        const originalIds = [...state.originalSelectedCardSetIds].sort();
        const currentIds = [...state.selectedCardSetIds].sort();

        return originalIds.join(',') !== currentIds.join(',');
    })
});

export const state: LinkCardSetsModalState = getInitialLinkCardSetsModalState(null);