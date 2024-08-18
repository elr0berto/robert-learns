import { Context } from '..';
import {CardSetWithChildrenAndCardCounts} from "../data/data-state";
import {SortDirection, sortWithDirection} from "@elr0berto/robert-learns-shared/dist/common";
import {
    CardSetIdsPerCardSetId,
    CardSetIdsPerCardSetIdKeyType
} from "@elr0berto/robert-learns-shared/dist/api/card-sets";

const convertCardSetIdsPerCardSetId = (cardSetsWithChildrenAndCardCounts: CardSetWithChildrenAndCardCounts[]): CardSetIdsPerCardSetId => {
    const result: CardSetIdsPerCardSetId = {0: []};

    const processCardSets = (cardSetsWithChildrenAndCardCounts: CardSetWithChildrenAndCardCounts[], parentCardSetId: CardSetIdsPerCardSetIdKeyType) => {
        if (cardSetsWithChildrenAndCardCounts.length === 0) {
            return;
        }
        if (parentCardSetId !== 0 && result[parentCardSetId]) {
            return;
        } else {
            result[parentCardSetId] = [];
        }

        for (const cardSetWithChildrenAndCardCounts of cardSetsWithChildrenAndCardCounts) {
            result[parentCardSetId].push(cardSetWithChildrenAndCardCounts.cardSet.id);

            if (cardSetWithChildrenAndCardCounts.children.length > 0) {
                processCardSets(cardSetWithChildrenAndCardCounts.children, cardSetWithChildrenAndCardCounts.cardSet.id);
            }
        }
    };

    processCardSets(cardSetsWithChildrenAndCardCounts, 0);
    return result;
};

export const sortCardSets = async ({ state }: Context) => {
    state.workspacePage.newSorting = convertCardSetIdsPerCardSetId(state.page.cardSetsWithChildrenAndCardCounts);
}

export const sortCardSet = async ({ state }: Context, {cardSetId, parentId, direction}: {cardSetId: number, parentId: number, direction: SortDirection}) => {
    if (state.workspacePage.newSorting === null || state.workspacePage.newSorting[parentId] === undefined) {
        throw new Error('newSorting is null or undefined for parentId ' + parentId);
    }
    const newId = sortWithDirection(state.workspacePage.newSorting[parentId], cardSetId, direction);
    state.workspacePage.newSorting = {...state.workspacePage.newSorting, [parentId]: newId};
}

export const sortCardSetsSave = async ({ state, effects, actions }: Context) => {
    if (state.workspacePage.newSorting === null) {
        throw new Error('newSorting is null');
    }
    state.workspacePage.savingSorting = true;
    await effects.api.cardSets.updateCardSetsOrder({
        newSorting: state.workspacePage.newSorting,
    });
    effects.page.reloadPage();
}

export const sortCardSetsCancel = async ({ state }: Context) => {
    state.workspacePage.newSorting = null;
}