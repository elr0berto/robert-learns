import {CardSetWithChildrenAndCardCounts} from "../data/data-state";
import {derived} from "overmind";
import {config} from "../index";
import {
    CardSetIdsPerCardSetId,
    CardSetIdsPerCardSetIdKeyType
} from "@elr0berto/robert-learns-shared/dist/api/card-sets";


type WorkspacePageState = {
    newSorting: CardSetIdsPerCardSetId | null;
    savingSorting: boolean;
    readonly sorting: boolean;
    readonly cardSetsWithChildrenAndCardCounts: CardSetWithChildrenAndCardCounts[];
}

export const getInitialWorkspacePageState = (): WorkspacePageState => ({
    newSorting: null,
    savingSorting: false,
    sorting: derived((state: WorkspacePageState) => {
        return state.newSorting !== null;
    }),
    cardSetsWithChildrenAndCardCounts: derived((state: WorkspacePageState, rootState: typeof config.state) => {
        if (state.sorting) {
            const sortChildren = (cardSetsWithChildrenAndCardCounts: CardSetWithChildrenAndCardCounts[], parentId: CardSetIdsPerCardSetIdKeyType) : CardSetWithChildrenAndCardCounts[] => {
                const ret : CardSetWithChildrenAndCardCounts[] = [];

                for (const cardSetWithChildrenAndCardCounts of cardSetsWithChildrenAndCardCounts) {
                    const newCardSetWithChildrenAndCardCounts : CardSetWithChildrenAndCardCounts = {
                        cardSet: cardSetWithChildrenAndCardCounts.cardSet,
                        children: [],
                        cardCount: cardSetWithChildrenAndCardCounts.cardCount,
                    };
                    if (cardSetWithChildrenAndCardCounts.children.length > 0) {
                        newCardSetWithChildrenAndCardCounts.children = sortChildren(cardSetWithChildrenAndCardCounts.children, cardSetWithChildrenAndCardCounts.cardSet.id);
                    }
                    ret.push(newCardSetWithChildrenAndCardCounts);
                }

                if (state.newSorting === null || !state.newSorting[parentId]) {
                    throw new Error('No newSorting for parentId ' + parentId);
                }
                const sorting = state.newSorting[parentId];
                // Sort the ret array here
                ret.sort((a,b) => {
                    return sorting.indexOf(a.cardSet.id) - sorting.indexOf(b.cardSet.id);
                });


                return ret;
            };

            return sortChildren(rootState.page.cardSetsWithChildrenAndCardCounts, 0);
        } else {
            return rootState.page.cardSetsWithChildrenAndCardCounts;
        }
    }),
});

export const state: WorkspacePageState = getInitialWorkspacePageState();