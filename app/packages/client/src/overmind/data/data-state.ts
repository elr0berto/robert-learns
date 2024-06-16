import {derived} from "overmind";
import {
    Card,
    User,
    Workspace,
    WorkspaceUser,
    CardSetCard,
    CardSet,
    Drill,
    DrillCardSet,
    DrillRun, DrillRunQuestion, CardSetLink,
} from "@elr0berto/robert-learns-shared/dist/api/models";

export type CardSetWithCards = {
    cardSet: CardSet;
    cards: Card[];
}

export type CardWithCardSets = {
    card: Card;
    cardSets: CardSet[];
}

export type CardSetWithCardsWithCardSets = {
    cardSet: CardSet;
    cardsWithCardSets: CardWithCardSets[];
}

export type WorkspaceWithWorkspaceUsers = {
    workspace: Workspace;
    workspaceUsers: WorkspaceUser[];
}

export type WorkspaceWithCardSetsCount = {
    workspace: Workspace;
    cardSetsCount: number;
}

export type WorkspaceWithCardSets = {
    workspace: Workspace;
    cardSets: CardSet[];
}

export type DrillWithDrillCardSets = {
    drill: Drill;
    drillCardSets: DrillCardSet[];
}

export type CardSetWithChildren = {
    cardSet: CardSet;
    children: CardSetWithChildren[];
}

export type WorkspaceWithCardSetsWithChildren = {
    workspace: Workspace;
    cardSetsWithChildren: CardSetWithChildren[];
}

export type WorkspaceWithCardSetsWithChildrenIds = {
    workspace: Workspace;
    cardSetsWithChildrenIds: CardSetWithChildrenIds[];
}

export type CardSetWithChildrenIds = {
    cardSet: CardSet;
    childrenIds: number[];
}

type DataState = {
    workspaces: Workspace[];
    loadingWorkspaces: boolean;
    workspaceUsers: WorkspaceUser[];
    loadingWorkspaceUsers: boolean;
    users: User[];
    loadingUsers: boolean;
    cards: Card[];
    loadingCards: boolean;
    cardSetCards: CardSetCard[];
    loadingCardSetCards: boolean;
    cardSets: CardSet[];
    loadingCardSets: boolean;
    cardSetLinks: CardSetLink[];
    loadingCardSetLinks: boolean;
    drills: Drill[];
    loadingDrills: boolean;
    drillCardSets: DrillCardSet[];
    loadingDrillCardSets: boolean;
    drillRuns: DrillRun[];
    loadingDrillRuns: boolean;
    drillRunQuestions: DrillRunQuestion[];
    loadingDrillRunQuestions: boolean;
    readonly workspacesWithWorkspaceUsers: WorkspaceWithWorkspaceUsers[];
    readonly workspacesWithCardSetsCounts: WorkspaceWithCardSetsCount[];
    readonly workspacesWithCardSets: WorkspaceWithCardSets[];
    readonly cardSetsWithCards: CardSetWithCards[];
    readonly cardsWithCardSets: CardWithCardSets[];
    readonly cardSetsWithCardsWithCardSets: CardSetWithCardsWithCardSets[];
    readonly drillsWithDrillCardSets: DrillWithDrillCardSets[];
    readonly cardSetsWithChildren: CardSetWithChildren[];
    readonly workspacesWithCardSetsWithChildren: WorkspaceWithCardSetsWithChildren[];
    readonly workspacesWithCardSetsWithChildrenIds: WorkspaceWithCardSetsWithChildrenIds[];
    readonly flatCardSetsWithChildren: CardSetWithChildren[];
    readonly flatCardSetsWithChildrenIds: CardSetWithChildrenIds[];
}

export const getInitialDataState = () : DataState => ({
    workspaces: [],
    loadingWorkspaces: false,
    workspaceUsers: [],
    loadingWorkspaceUsers: false,
    users: [],
    loadingUsers: false,
    cards: [],
    loadingCards: false,
    cardSetCards: [],
    loadingCardSetCards: false,
    cardSets: [],
    loadingCardSets: false,
    cardSetLinks: [],
    loadingCardSetLinks: false,
    drills: [],
    loadingDrills: false,
    drillCardSets: [],
    loadingDrillCardSets: false,
    drillRuns: [],
    loadingDrillRuns: false,
    drillRunQuestions: [],
    loadingDrillRunQuestions: false,
    workspacesWithWorkspaceUsers: derived((state: DataState) => {
        return state.workspaces.map(w => ({
            workspace: w,
            workspaceUsers: state.workspaceUsers.filter(wu => wu.workspaceId === w.id),
        }));
    }),
    workspacesWithCardSetsCounts: derived((state: DataState) => {
        return state.workspaces.map(w => ({
            workspace: w,
            cardSetsCount: state.cardSets.filter(cs => cs.workspaceId === w.id).length,
        }));
    }),
    workspacesWithCardSets: derived((state: DataState) => {
        return state.workspaces.map(w => ({
            workspace: w,
            cardSets: state.cardSets.filter(cs => cs.workspaceId === w.id),
        }));
    }),
    cardSetsWithCards: derived((state: DataState) => {
        return state.cardSetsWithCardsWithCardSets.map(cs => ({
            cardSet: cs.cardSet,
            cards: cs.cardsWithCardSets.map(cwcs => cwcs.card),
        }));
    }),
    cardsWithCardSets: derived((state: DataState) => {
        return state.cards.map(c => ({
            card: c,
            cardSets: state.cardSetCards.filter(csc => csc.cardId === c.id).map(csc => {
                const cardSet = state.cardSets.find(cs => cs.id === csc.cardSetId);
                if (cardSet === undefined) {
                    throw new Error(`CardSet with id ${csc.cardSetId} not found`);
                }
                return cardSet;
            }),
        }));
    }),
    cardSetsWithCardsWithCardSets: derived((state: DataState) => {
        console.log('data-state cardSetsWithCardsWithCardSets');
        return state.cardSets.map(cs => ({
            cardSet: cs,
            cardsWithCardSets: state.cardSetCards.filter(csc => csc.cardSetId === cs.id && state.cards.find(c => c.id === csc.cardId) !== undefined)
                .sort((a,b) => a.order - b.order)
                .reverse()
                .map(csc => {
                    const card = state.cards.find(c => c.id === csc.cardId);
                    if (card === undefined) {
                        throw new Error(`Card with id ${csc.cardId} not found`);
                    }
                    return {
                        card,
                        cardSets: state.cardSetCards.filter(csc => csc.cardId === card.id).map(csc => {
                            const cardSet = state.cardSets.find(cs => cs.id === csc.cardSetId);
                            if (cardSet === undefined) {
                                throw new Error(`CardSet with id ${csc.cardSetId} not found`);
                            }
                            return cardSet;
                        }),
                    };
                })
                .filter(c => c !== null),
        }));
    }),
    drillsWithDrillCardSets: derived((state: DataState) => {
        return state.drills.map(d => ({
            drill: d,
            drillCardSets: state.drillCardSets.filter(dcs => dcs.drillId === d.id),
        }));
    }),
    cardSetsWithChildren: derived((state: DataState) => {
        console.log('data-state cardSetsWithChildren');
        return buildNestedCardSets(state.cardSets, state.cardSetLinks);
    }),
    workspacesWithCardSetsWithChildren: derived((state: DataState) => {
        console.log('data-state cardSetsWithChildrenworkspacesWithCardSetsWithChildren');
        return state.workspaces.map(w => ({
            workspace: w,
            cardSetsWithChildren: buildNestedCardSets(state.cardSets.filter(cs => cs.workspaceId === w.id), state.cardSetLinks),
        }));
    }),
    workspacesWithCardSetsWithChildrenIds: derived((state: DataState) => {
        return state.workspaces.map(w => ({
            workspace: w,
            cardSetsWithChildrenIds: state.flatCardSetsWithChildrenIds.filter(cs => cs.cardSet.workspaceId === w.id),
        }));
    }),
    flatCardSetsWithChildren: derived((state: DataState) => {
        console.log('data-state flatCardSetsWithChildren');
        const flattenCardSets = (cardSetsWithChildren: CardSetWithChildren[], uniqueIds: Set<number>): CardSetWithChildren[] => {
            return cardSetsWithChildren.reduce((acc, cs) => {
                if (!uniqueIds.has(cs.cardSet.id)) {
                    uniqueIds.add(cs.cardSet.id);
                    acc.push(cs);
                }
                return acc.concat(flattenCardSets(cs.children, uniqueIds));
            }, [] as CardSetWithChildren[]);
        };

        const uniqueIds = new Set<number>();
        return flattenCardSets(state.cardSetsWithChildren, uniqueIds);
    }),
    flatCardSetsWithChildrenIds: derived((state: DataState) => {
        console.log('data-state flatCardSetsWithChildrenIds');
        const flattenCardSets = (cardSetsWithChildren: CardSetWithChildren[], uniqueIds: Set<number>): CardSetWithChildrenIds[] => {
            return cardSetsWithChildren.reduce((acc, cs) => {
                if (!uniqueIds.has(cs.cardSet.id)) {
                    uniqueIds.add(cs.cardSet.id);
                    acc.push({
                        cardSet: cs.cardSet,
                        childrenIds: collectAllChildrenIds(cs)
                    });
                }
                return acc.concat(flattenCardSets(cs.children, uniqueIds));
            }, [] as CardSetWithChildrenIds[]);
        };

        const collectAllChildrenIds = (cardSetWithChildren: CardSetWithChildren): number[] => {
            const childrenIds: Set<number> = new Set();
            const collectIds = (cs: CardSetWithChildren) => {
                cs.children.forEach(child => {
                    if (!childrenIds.has(child.cardSet.id)) {
                        childrenIds.add(child.cardSet.id);
                        collectIds(child);
                    }
                });
            };
            collectIds(cardSetWithChildren);
            return Array.from(childrenIds);
        };

        const uniqueIds = new Set<number>();
        return flattenCardSets(state.cardSetsWithChildren, uniqueIds);
    }),
});

const buildNestedCardSets = (cardSets: CardSet[], cardSetLinks : CardSetLink[], parentId : number | null  = null) : CardSetWithChildren[] => {
    return cardSets
        .filter(cs => {
            if (parentId === null) {
                // Top-level card sets have no parent
                return !cardSetLinks.some(csl => csl.includedCardSetId === cs.id);
            }
            return cardSetLinks.some(csl => csl.parentCardSetId === parentId && csl.includedCardSetId === cs.id);
        })
        .map(cs => ({
            cardSet: cs,
            children: buildNestedCardSets(cardSets, cardSetLinks, cs.id)
        }))
        .sort((a, b) => b.children.length - a.children.length);
};

export const state: DataState = getInitialDataState();