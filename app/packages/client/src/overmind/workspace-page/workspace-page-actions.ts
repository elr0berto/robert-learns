import { Context } from '..';
import {CardSetWithChildren} from "../data/data-state";
import {SortDirection, sortWithDirection} from "@elr0berto/robert-learns-shared/dist/common";
import {
    CardSetIdsPerCardSetId,
    CardSetIdsPerCardSetIdKeyType
} from "@elr0berto/robert-learns-shared/dist/api/card-sets";

const convertCardSetIdsPerCardSetId = (cardSetsWithChildren: CardSetWithChildren[]): CardSetIdsPerCardSetId => {
    const result: CardSetIdsPerCardSetId = {0: []};

    const processCardSets = (cardSetsWithChildren: CardSetWithChildren[], parentCardSetId: CardSetIdsPerCardSetIdKeyType) => {
        console.log('parentCardSetId', parentCardSetId);
        if (cardSetsWithChildren.length === 0) {
            console.log('parentCardSetId a', parentCardSetId);
            return;
        }
        if (parentCardSetId !== 0 && result[parentCardSetId]) {
            console.log('parentCardSetId b', parentCardSetId);
            return;
        } else {
            console.log('parentCardSetId c', parentCardSetId);
            result[parentCardSetId] = [];
        }

        for (const cardSetWithChildren of cardSetsWithChildren) {
            console.log('parentCardSetId d', parentCardSetId);
            console.log('parentCardSetId cardSetWithChildren.cardSet.id', cardSetWithChildren.cardSet.id);
            result[parentCardSetId].push(cardSetWithChildren.cardSet.id);

            if (cardSetWithChildren.children.length > 0) {
                console.log('parentCardSetId e', parentCardSetId);
                processCardSets(cardSetWithChildren.children, cardSetWithChildren.cardSet.id);
            }
        }
    };

    processCardSets(cardSetsWithChildren, 0);
    return result;
};

export const sortCardSets = async ({ state }: Context) => {
    state.workspacePage.newSorting = convertCardSetIdsPerCardSetId(state.page.cardSetsWithChildren);
}

export const sortCardSet = async ({ state }: Context, {cardSetId, parentId, direction}: {cardSetId: number, parentId: number, direction: SortDirection}) => {
    console.log('sortCardSet parentId', parentId);
    console.log('sortCardSet cardSetId', cardSetId);
    console.log('sortCardSet direction', direction);
    if (state.workspacePage.newSorting === null || state.workspacePage.newSorting[parentId] === undefined) {
        throw new Error('newSorting is null or undefined for parentId ' + parentId);
    }
    const test = sortWithDirection(state.workspacePage.newSorting[parentId], cardSetId, direction);
    console.log('test', test);
    state.workspacePage.newSorting = {...state.workspacePage.newSorting, [parentId]: test};
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