import { Context } from '..';

export const loadWorkspaces = async ({state,effects} : Context) => {
    state.data.loadingWorkspaces = true;

    const resp = await effects.api.workspaces.getWorkspaces();

    state.data.workspaces = resp.workspaces!;

    const workspaceIds = resp.workspaces!.map(w => w.id);

    state.data.loadingWorkspaces = false;
}

export const loadCardSets = async ({state,effects} : Context, workspaceId: number) => {
    state.data.loadingCardSets = true;

    const resp = await effects.api.cardSets.getCardSets({workspaceId});

    state.data.cardSets = resp.cardSets!;

    state.data.loadingCardSets = false;
}

export const loadCardSetCards = async ({state,effects} : Context, cardSetIds: number[]) => {
    state.data.loadingCardSetCards = true;

    const resp = await effects.api.cardSetCards.getCardSetCards({cardSetIds});

    state.data.cardSetCards = resp.cardSetCards!;

    state.data.loadingCardSetCards = false;
}

export const loadCards = async ({state,effects} : Context, cardIds: number[]) => {
    state.data.loadingCards = true;

    const resp = await effects.api.cards.getCards({cardIds});

    state.data.cards = resp.cards!;

    state.data.loadingCards = false;
}

export const loadWorkspaceUsers = async ({state,effects} : Context, workspaceIds: number[]) => {
    state.data.loadingWorkspaceUsers = true;

    const resp = await effects.api.workspaceUsers.getWorkspaceUsers({workspaceIds});

    state.data.workspaceUsers = resp.workspaceUsers!;

    state.data.loadingWorkspaceUsers = false;
}

export const loadUsers = async ({state,effects} : Context, userIds: number[]) => {
    state.data.loadingUsers = true;

    const resp = await effects.api.users.getUsers({userIds});

    state.data.users = resp.users!;

    state.data.loadingUsers = false;
}