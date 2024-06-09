import {derived} from "overmind";
import {config} from "../index";
import {CardSetLink} from "@elr0berto/robert-learns-shared/dist/api/models";

type LinkCardSetsModalState = {
    cardSetId: number | null;
    loading: boolean;
    saving: boolean;
    originalSelectedCardSetIds: number[];
    selectedCardSetIds: number[];
    readonly open: boolean;
    readonly disabled: boolean;
    readonly hasChanges: boolean;
    readonly parentCardSetIds: number[];
}

// Recursive function to find all ancestors
const findAllAncestors = (cardSetLinks: CardSetLink[], cardSetId: number, ancestors: Set<number> = new Set()): Set<number> => {
    const parents = cardSetLinks
        .filter(link => link.includedCardSetId === cardSetId)
        .map(link => link.parentCardSetId);

    parents.forEach(parentId => {
        if (!ancestors.has(parentId)) {
            ancestors.add(parentId);
            findAllAncestors(cardSetLinks, parentId, ancestors);
        }
    });

    return ancestors;
};

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
    }),
    parentCardSetIds: derived((state: LinkCardSetsModalState, rootState: typeof config.state) => {
        if (state.cardSetId === null) {
            return [];
        }
        return Array.from(findAllAncestors(rootState.data.cardSetLinks, state.cardSetId));
    }),
});

export const state: LinkCardSetsModalState = getInitialLinkCardSetsModalState(null);