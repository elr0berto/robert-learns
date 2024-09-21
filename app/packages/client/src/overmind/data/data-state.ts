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

export type WorkspaceWithCardCount = {
    workspace: Workspace;
    cardCount: number;
}

export type CardSetWithCards = {
    cardSet: CardSet;
    cards: Card[];
}

export type CardWithCardSets = {
    card: Card;
    cardSets: CardSet[];
}

export type CardSetWithFlatAncestorCardSets = {
    cardSet: CardSet;
    flatAncestorCardSets: CardSet[];
}

export type CardWithCardSetsWithFlatAncestorCardSets = {
    card: Card;
    cardSetsWithFlatAncestorCardSets: CardSetWithFlatAncestorCardSets[];
}

export type CardSetWithCardsWithCardSets = {
    cardSet: CardSet;
    cardsWithCardSets: CardWithCardSets[];
}

export type CardSetWithCardsWithCardSetsWithFlatAncestorCardSets = {
    cardSet: CardSet;
    cardsWithCardSetsWithFlatAncestorCardSets: CardWithCardSetsWithFlatAncestorCardSets[];
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

export type CardSetWithChildrenAndCardCounts = {
    cardSet: CardSet;
    children: CardSetWithChildrenAndCardCounts[];
    cardCount: number;
}

export type WorkspaceWithCardCountAndCardSetsWithChildrenAndCardCounts = {
    workspaceWithCardCount: WorkspaceWithCardCount;
    cardSetsWithChildrenAndCardCounts: CardSetWithChildrenAndCardCounts[];
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
    readonly cardSetsWithFlatAncestorCardSets: CardSetWithFlatAncestorCardSets[];
    readonly cardsWithCardSetsWithFlatAncestorCardSets: CardWithCardSetsWithFlatAncestorCardSets[];
    readonly cardSetsWithCardsWithCardSets: CardSetWithCardsWithCardSets[];
    readonly cardSetsWithCardsWithCardSetsWithFlatAncestorCardSets: CardSetWithCardsWithCardSetsWithFlatAncestorCardSets[];
    readonly drillsWithDrillCardSets: DrillWithDrillCardSets[];
    readonly cardSetsWithChildrenAndCardCounts: CardSetWithChildrenAndCardCounts[];
    readonly workspacesWithCardCountsWithCardSetsWithChildrenAndCardCounts: WorkspaceWithCardCountAndCardSetsWithChildrenAndCardCounts[];
    readonly workspacesWithCardSetsWithChildrenIds: WorkspaceWithCardSetsWithChildrenIds[];
    readonly flatCardSetsWithChildrenAndCardCounts: CardSetWithChildrenAndCardCounts[];
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
    cardSetsWithFlatAncestorCardSets: derived((state: DataState) => {
        const getAncestorCardSets = (cardSetId: number, ancestors: CardSet[] = []): CardSet[] => {
            const parentLinks = state.cardSetLinks.filter(link => link.includedCardSetId === cardSetId);
            parentLinks.forEach(link => {
                const parentCardSet = state.cardSets.find(cs => cs.id === link.parentCardSetId);
                if (parentCardSet) {
                    ancestors.push(parentCardSet);
                    getAncestorCardSets(parentCardSet.id, ancestors);
                } else {
                    throw new Error(`Parent card set with id ${link.parentCardSetId} not found`);
                }
            });

            return ancestors;
        };

        return state.cardSets.map(cs => ({
            cardSet: cs,
            flatAncestorCardSets: getAncestorCardSets(cs.id),
        }));
    }),
    cardsWithCardSetsWithFlatAncestorCardSets: derived((state: DataState) => {
        return state.cardsWithCardSets.map(cwcs => ({
            card: cwcs.card,
            cardSetsWithFlatAncestorCardSets: cwcs.cardSets.map(cs => {
                const ancestorData = state.cardSetsWithFlatAncestorCardSets.find(csfacs => csfacs.cardSet.id === cs.id);
                if (ancestorData === undefined) {
                    throw new Error(`CardSet with id ${cs.id} not found`);
                }
                return ancestorData;
            }),
        }));
    }),
    cardSetsWithCardsWithCardSets: derived((state: DataState) => {
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
    cardSetsWithCardsWithCardSetsWithFlatAncestorCardSets: derived((state: DataState) => {
        return state.cardSetsWithCardsWithCardSets.map(cs => ({
            cardSet: cs.cardSet,
            cardsWithCardSetsWithFlatAncestorCardSets: cs.cardsWithCardSets.map(cwcs => {
                const ret = state.cardsWithCardSetsWithFlatAncestorCardSets.find(x => x.card.id === cwcs.card.id);
                if (ret === undefined) {
                    throw new Error('Card not found: ' + cwcs.card.id);
                }
                return ret;
            }),
        }));
    }),
    drillsWithDrillCardSets: derived((state: DataState) => {
        return state.drills.map(d => ({
            drill: d,
            drillCardSets: state.drillCardSets.filter(dcs => dcs.drillId === d.id),
        }));
    }),
    cardSetsWithChildrenAndCardCounts: derived((state: DataState) => {
        return buildNestedCardSetsWithCardCounts(state.cardSets, state.cardSetLinks, state.cardSetCards);
    }),
    workspacesWithCardCountsWithCardSetsWithChildrenAndCardCounts: derived((state: DataState) => {
        return state.workspaces.map(w => buildNestedWorkspaceWithCardCountAndCardSetsWithCardCounts(w, state.cardSets.filter(cs => cs.workspaceId === w.id), state.cardSetLinks, state.cardSetCards));
    }),
    workspacesWithCardSetsWithChildrenIds: derived((state: DataState) => {
        return state.workspaces.map(w => ({
            workspace: w,
            cardSetsWithChildrenIds: state.flatCardSetsWithChildrenIds.filter(cs => cs.cardSet.workspaceId === w.id),
        }));
    }),
    flatCardSetsWithChildrenAndCardCounts: derived((state: DataState) => {
        const flattenCardSets = (cardSetsWithChildrenAndCardCounts: CardSetWithChildrenAndCardCounts[], uniqueIds: Set<number>): CardSetWithChildrenAndCardCounts[] => {
            return cardSetsWithChildrenAndCardCounts.reduce((acc, cs) => {
                if (!uniqueIds.has(cs.cardSet.id)) {
                    uniqueIds.add(cs.cardSet.id);
                    acc.push(cs);
                }
                return acc.concat(flattenCardSets(cs.children, uniqueIds));
            }, [] as CardSetWithChildrenAndCardCounts[]);
        };

        const uniqueIds = new Set<number>();
        return flattenCardSets(state.cardSetsWithChildrenAndCardCounts, uniqueIds);
    }),
    flatCardSetsWithChildrenIds: derived((state: DataState) => {
        const flattenCardSets = (cardSetsWithChildren: CardSetWithChildrenAndCardCounts[], uniqueIds: Set<number>): CardSetWithChildrenIds[] => {
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

        const collectAllChildrenIds = (cardSetWithChildrenAndCardCounts: CardSetWithChildrenAndCardCounts): number[] => {
            const childrenIds: Set<number> = new Set();
            const collectIds = (cs: CardSetWithChildrenAndCardCounts) => {
                cs.children.forEach(child => {
                    if (!childrenIds.has(child.cardSet.id)) {
                        childrenIds.add(child.cardSet.id);
                        collectIds(child);
                    }
                });
            };
            collectIds(cardSetWithChildrenAndCardCounts);
            return Array.from(childrenIds);
        };

        const uniqueIds = new Set<number>();
        return flattenCardSets(state.cardSetsWithChildrenAndCardCounts, uniqueIds);
    }),
});

const buildNestedCardSetsWithCardCounts = (cardSets: CardSet[], cardSetLinks: CardSetLink[], cardSetCards: CardSetCard[], parentId: number | null = null): CardSetWithChildrenAndCardCounts[] => {
    const getUniqueCardCount = (cardSetId: number, uniqueCardIds: Set<number>): void => {
        const cardsInSet = cardSetCards.filter(csc => csc.cardSetId === cardSetId);
        cardsInSet.forEach(csc => uniqueCardIds.add(csc.cardId));

        const childLinks = cardSetLinks.filter(link => link.parentCardSetId === cardSetId);
        childLinks.forEach(link => getUniqueCardCount(link.includedCardSetId, uniqueCardIds));
    };

    return cardSets
        .filter(cs => {
            if (parentId === null) {
                return !cardSetLinks.some(csl => csl.includedCardSetId === cs.id);
            }
            return cardSetLinks.some(csl => csl.parentCardSetId === parentId && csl.includedCardSetId === cs.id);
        })
        .map(cs => {
            const uniqueCardIds = new Set<number>();
            getUniqueCardCount(cs.id, uniqueCardIds);
            return {
                cardSet: cs,
                children: buildNestedCardSetsWithCardCounts(cardSets, cardSetLinks, cardSetCards, cs.id),
                cardCount: uniqueCardIds.size
            };
        })
        .sort((a, b) => {
            if (parentId === null) {
                return b.cardSet.order - a.cardSet.order;
            }
            const aLink = cardSetLinks.find(csl => csl.parentCardSetId === parentId && csl.includedCardSetId === a.cardSet.id);
            const bLink = cardSetLinks.find(csl => csl.parentCardSetId === parentId && csl.includedCardSetId === b.cardSet.id);
            if (aLink === undefined || bLink === undefined) {
                throw new Error('CardSetLink not found');
            }
            return bLink.order - aLink.order;
        });
}

/* returns a WorkspaceWithCardCountAndCardSetsWithChildrenAndCardCounts
the cardSetsWithChildrenAndCardCounts is built like buildNestedCardSets above. but also include card-counts of all the unique cards in each card set and its descendants.
card counts must be unique and include all descendant card sets */
const buildNestedWorkspaceWithCardCountAndCardSetsWithCardCounts = (workspace: Workspace, cardSets: CardSet[], cardSetLinks : CardSetLink[], cardSetCards: CardSetCard[], parentId : number | null = null) : WorkspaceWithCardCountAndCardSetsWithChildrenAndCardCounts => {
    const getUniqueCardCount = (cardSetId: number, uniqueCardIds: Set<number>): void => {
        const cardsInSet = cardSetCards.filter(csc => csc.cardSetId === cardSetId);
        cardsInSet.forEach(csc => uniqueCardIds.add(csc.cardId));

        const childLinks = cardSetLinks.filter(link => link.parentCardSetId === cardSetId);
        childLinks.forEach(link => getUniqueCardCount(link.includedCardSetId, uniqueCardIds));
    };

    const buildNestedCardSetsWithCardCounts = (
        cardSets: CardSet[],
        cardSetLinks: CardSetLink[],
        cardSetCards: CardSetCard[],
        parentId: number | null = null
    ): CardSetWithChildrenAndCardCounts[] => {
        return cardSets
            .filter(cs => {
                if (parentId === null) {
                    return !cardSetLinks.some(csl => csl.includedCardSetId === cs.id);
                }
                return cardSetLinks.some(csl => csl.parentCardSetId === parentId && csl.includedCardSetId === cs.id);
            })
            .map(cs => {
                const uniqueCardIds = new Set<number>();
                getUniqueCardCount(cs.id, uniqueCardIds);
                return {
                    cardSet: cs,
                    children: buildNestedCardSetsWithCardCounts(cardSets, cardSetLinks, cardSetCards, cs.id),
                    cardCount: uniqueCardIds.size
                };
            })
            .sort((a, b) => {
                if (parentId === null) {
                    return b.cardSet.order - a.cardSet.order;
                }
                const aLink = cardSetLinks.find(csl => csl.parentCardSetId === parentId && csl.includedCardSetId === a.cardSet.id);
                const bLink = cardSetLinks.find(csl => csl.parentCardSetId === parentId && csl.includedCardSetId === b.cardSet.id);
                if (aLink === undefined || bLink === undefined) {
                    throw new Error('CardSetLink not found');
                }
                return bLink.order - aLink.order;
            });
    };

    const uniqueCardIds = new Set<number>();
    cardSets.forEach(cs => getUniqueCardCount(cs.id, uniqueCardIds));

    return {
        workspaceWithCardCount: {
            workspace,
            cardCount: uniqueCardIds.size
        },
        cardSetsWithChildrenAndCardCounts: buildNestedCardSetsWithCardCounts(cardSets, cardSetLinks, cardSetCards, parentId)
    };
}

export const state: DataState = getInitialDataState();