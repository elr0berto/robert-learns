import {CardSetWithChildren} from "../data/data-state";
import {derived} from "overmind";
import {config} from "../index";


type WorkspacePageState = {
    newSorting: CardSetIdsPerCardSetId | null;
    savingSorting: boolean;
    readonly sorting: boolean;
    readonly cardSetsWithChildren: CardSetWithChildren[];
}

export const getInitialWorkspacePageState = (): WorkspacePageState => ({
    newSorting: null,
    savingSorting: false,
    sorting: derived((state: WorkspacePageState) => {
        return state.newSorting !== null;
    }),
    cardSetsWithChildren: derived((state: WorkspacePageState, rootState: typeof config.state) => {
        if (state.sorting) {
            console.log('cardSetsWithChildren derived sorting');
            const sortChildren = (cardSetsWithChildren: CardSetWithChildren[], parentId: CardSetIdsPerCardSetIdKeyType) : CardSetWithChildren[] => {
                const ret : CardSetWithChildren[] = [];

                for (const cardSetWithChildren of cardSetsWithChildren) {
                    const newCardSetWithChildren : CardSetWithChildren = {
                        cardSet: cardSetWithChildren.cardSet,
                        children: []
                    };
                    if (cardSetWithChildren.children.length > 0) {
                        newCardSetWithChildren.children = sortChildren(cardSetWithChildren.children, cardSetWithChildren.cardSet.id);
                    }
                    ret.push(newCardSetWithChildren);
                }

                if (state.newSorting === null || !state.newSorting[parentId]) {
                    throw new Error('No newSorting for parentId ' + parentId);
                }
                const sorting = state.newSorting[parentId];
                // Sort the ret array here
                ret.sort((a,b) => {
                    return sorting.indexOf(a.cardSet.id) - sorting.indexOf(b.cardSet.id);
                });

                console.log('sorted parentId', parentId);
                console.log('sorted ret', ret);

                return ret;
            };

            const finalResult = sortChildren(rootState.page.cardSetsWithChildren, 0);
            console.log('finalResult', finalResult);
            return finalResult;
        } else {
            return rootState.page.cardSetsWithChildren;
        }
    }),
});

export const state: WorkspacePageState = getInitialWorkspacePageState();