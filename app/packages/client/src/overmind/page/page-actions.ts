import { Context } from '..';
import {Pages} from "../../page-urls";
import queryString from "query-string";
import {getInitialSignUpState} from "../sign-up/sign-up-state";
import {getInitialSignInState} from "../sign-in/sign-in-state";
import {getInitialWorkspaceCreateState} from "../workspace-create/workspace-create-state";
import {getInitialWorkspaceCardSetCreateState} from "../workspace-card-set-create/workspace-card-set-create-state";
import {getInitialAdminLogsPageState} from "../admin-logs-page/admin-logs-page-state";

export type Payload = {
    params: any,
    querystring: queryString.ParsedQuery<string>
}

export const load = async ({state, actions}: Context, params?: {payload?: Payload, page?: Pages, onSuccessCallback?: () => void}) => {
    state.page.initializing = true;

    if (params?.page) {
        state.page.page = params.page;
    }

    let promises : Promise<void>[] = [];

    promises.push(actions.page.loadWorkspaces());

    console.log('load 1');
    if (params?.payload?.params?.workspaceId/* || state.page.workspaceId !== null Removed because otherwise deleting workspace doesnt work.*/) {
        console.log('load 2');
        if (params?.payload?.params?.workspaceId) {
            state.page.workspaceId = +params?.payload.params.workspaceId;
        }
        if (typeof state.page.workspaceId !== 'number') {
            throw new Error('workspaceId is ' + typeof state.page.workspaceId);
        }
        promises.push(actions.page.loadCardSets(state.page.workspaceId));

        if (params?.payload?.params?.cardSetId/* || state.page.cardSetId !== null: COMMENTED OUT BECAUSE OTHERWISE it gets weird when changing from a cardset-page to the workspace-page. menu thinks cardset is still selected!*/) {
            if (params?.payload?.params?.cardSetId) {
                state.page.cardSetId = +params?.payload.params.cardSetId;
            }
            if (typeof state.page.cardSetId !== 'number') {
                throw new Error('cardSetId is ' + typeof state.page.cardSetId);
            }
            promises.push(actions.page.loadCards([state.page.cardSetId]));
        } else {
            state.page.cardSetId = null;
        }
    } else {
        console.log('load 3');
        state.page.workspaceId = null;
        state.page.cardSetId = null;
    }

    state.page.initializing = false;

    await Promise.all(promises);

    if (params?.onSuccessCallback) {
        params.onSuccessCallback();
    }
}

export const loadWorkspaces = async ({state,actions} : Context) => {
    state.page.loadingWorkspaces = true;

    await actions.data.loadWorkspaces();
    if (state.data.workspaces.length > 0) {
        await actions.data.loadWorkspaceUsers(state.data.workspaces.map(w => w.id));
        if (state.data.workspaceUsers.length > 0) {
            await actions.data.loadUsers(state.data.workspaceUsers.map(wu => wu.userId));
        }
    }

    state.page.loadingWorkspaces = false;
}

export const loadCardSets = async ({state,actions} : Context, workspaceId: number) => {
    state.page.loadingCardSets = true;

    await actions.data.loadCardSets(workspaceId);

    state.page.loadingCardSets = false;
}

export const loadCards = async ({state,actions} : Context, cardSetIds: number[]) => {
    state.page.loadingCards = true;

    await actions.data.loadCardSetCards({cardSetIds: cardSetIds});
    await actions.data.loadCards(state.data.cardSetCards.filter(csc => cardSetIds.includes(csc.cardSetId)).map(csc => csc.cardId));

    state.page.loadingCards = false;
}

export const showAdminLogsPage = async ({ actions, state, effects }: Context) => {
    actions.page.load({page: Pages.AdminLogs});
    state.adminLogsPage = getInitialAdminLogsPageState();
    if ((state.signIn.user?.admin ?? false) === true) {
        await actions.adminLogsPage.loadMore();
    }
}

export const showFrontPage = async ({ actions }: Context) => {
    actions.page.load({page: Pages.Front});
}

export const showSignInPage = async ({ state, actions }: Context) => {
    actions.page.load({page: Pages.SignIn});
    state.signIn = getInitialSignInState(state.signIn.userId);
}

export const showSignUpPage = async ({ state, actions }: Context) => {
    actions.page.load({page: Pages.SignUp});
    state.signUp = getInitialSignUpState();
}

export const showWorkspacePage = async ({ actions }: Context, payload: Payload) => {
    actions.page.load({page: Pages.Workspace, payload: payload});
}

export const showWorkspaceCreatePage = async ({ state, actions }: Context) => {
    actions.page.load({page: Pages.WorkspaceCreate});
    state.workspaceCreate = getInitialWorkspaceCreateState(null);
}

export const showWorkspaceEditPage = async ({ state, actions }: Context, payload: Payload) => {
    await actions.page.load({page: Pages.WorkspaceEdit, payload: payload});
    state.workspaceCreate = getInitialWorkspaceCreateState(state.page.workspaceWithWorkspaceUsers);
}

export const showWorkspaceCardSetPage = async ({ actions }: Context, payload: Payload) => {
    actions.page.load({page: Pages.WorkspaceCardSet, payload: payload});
}

export const showWorkspaceCardSetCreatePage = async ({ state, actions }: Context, payload: Payload) => {
    actions.page.load({page: Pages.WorkspaceCardSetCreate, payload: payload});
    state.workspaceCardSetCreate = getInitialWorkspaceCardSetCreateState(null);
}

export const showWorkspaceCardSetEditPage = async ({ state, effects, actions }: Context, payload: Payload) => {
    await actions.page.load({page: Pages.WorkspaceCardSetEdit, payload: payload});
    state.workspaceCardSetCreate = getInitialWorkspaceCardSetCreateState(state.page.cardSet);
}