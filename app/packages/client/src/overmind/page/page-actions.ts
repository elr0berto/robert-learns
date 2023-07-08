import { Context } from '..';
import {Pages} from "../../page-urls";
import queryString from "query-string";
import {getInitialSignUpState} from "../sign-up/sign-up-state";
import {getInitialSignInState} from "../sign-in/sign-in-state";
import {getInitialWorkspaceCreateState} from "../workspace-create/workspace-create-state";
import {getInitialWorkspaceCardSetCreateState} from "../workspace-card-set-create/workspace-card-set-create-state";

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

    if (params?.payload?.params?.workspaceId || state.page.workspaceId !== null) {
        if (params?.payload?.params?.workspaceId) {
            state.page.workspaceId = +params?.payload.params.workspaceId;
        }
        promises.push(actions.page.loadCardSets(state.page.workspaceId!));

        if (params?.payload?.params?.cardSetId || state.page.cardSetId !== null) {
            if (params?.payload?.params?.cardSetId) {
                state.page.cardSetId = +params?.payload.params.cardSetId;
            }
            promises.push(actions.page.loadCards([state.page.cardSetId!]));
        } else {
            state.page.cardSetId = null;
        }
    } else {
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
    await actions.data.loadWorkspaceUsers(state.data.workspaces.map(w => w.id));
    await actions.data.loadUsers(state.data.workspaceUsers.map(wu => wu.userId));

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