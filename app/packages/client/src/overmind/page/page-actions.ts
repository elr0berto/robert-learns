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

export const _loadAllData = async ({ state, effects, actions }: Context) => {
    await actions.workspaces.getWorkspaceList();
}

export const _resetAll = async ({state}: Context) => {
    state.workspace.workspaceId = null;
    state.workspaceCardSet.cardSetId = null;
}

export const showFrontPage = async ({ state, effects, actions }: Context) => {
    actions.page._loadAllData();
    actions.page._resetAll();
    state.page.current = Pages.Front;
}

export const showSignInPage = async ({ state, effects, actions }: Context) => {
    actions.page._loadAllData();
    state.signIn = getInitialSignInState(state.signIn.user);
    state.page.current = Pages.SignIn;
}

export const showSignUpPage = async ({ state, effects, actions }: Context) => {
    actions.page._loadAllData();
    state.signUp = getInitialSignUpState();
    state.page.current = Pages.SignUp;
}

export const _setWorkspacePage = async ({state, effects, actions}: Context, {payload, page} : {payload: Payload, page: Pages}) => {
    state.page.current = page;
    if (payload.params?.workspaceId) {
        console.log('payload.params?.workspaceId', payload.params?.workspaceId);
        state.workspace.workspaceId = +payload.params.workspaceId;
        await actions.workspace._loadCardSets();
        if (payload.params?.cardSetId) {
            state.workspaceCardSet.cardSetId = +payload.params.cardSetId;
            await actions.workspaceCardSet._loadCards();
        }
    }
}

export const showWorkspacePage = async ({ state, effects, actions }: Context, payload: Payload) => {
    await actions.page._loadAllData();
    state.workspaceCardSet.cardSetId = null;
    actions.page._setWorkspacePage({payload, page: Pages.Workspace});
}

export const showWorkspaceCreatePage = async ({ state, effects, actions }: Context) => {
    actions.page._loadAllData();
    state.workspaceCreate = getInitialWorkspaceCreateState(null);
    state.page.current = Pages.WorkspaceCreate;
}

export const showWorkspaceEditPage = async ({ state, effects, actions }: Context, payload: Payload) => {
    await actions.page._loadAllData();
    state.workspace.workspaceId = parseInt(payload.params?.workspaceId);
    state.workspaceCreate = getInitialWorkspaceCreateState(state.workspace.workspace);
    state.page.current = Pages.WorkspaceEdit;
}

export const showWorkspaceCardSetPage = async ({ state, effects, actions }: Context, payload: Payload) => {
    actions.page._loadAllData();
    actions.page._setWorkspacePage({payload, page: Pages.WorkspaceCardSet});
}

export const showWorkspaceCardSetCreatePage = async ({ state, effects, actions }: Context, payload: Payload) => {
    await actions.page._loadAllData();

    state.page.current = Pages.WorkspaceCardSetCreate;
    if (payload.params?.workspaceId) {
        state.workspace.workspaceId = +payload.params.workspaceId;
    }

    state.workspaceCardSetCreate = getInitialWorkspaceCardSetCreateState(null);
}

export const showWorkspaceCardSetEditPage = async ({ state, effects, actions }: Context, payload: Payload) => {
    await actions.page._loadAllData();

    state.page.current = Pages.WorkspaceCardSetEdit;
    if (payload.params?.workspaceId) {
        state.workspace.workspaceId = +payload.params.workspaceId;
        await actions.workspace._loadCardSets();
        if (payload.params?.cardSetId) {
            state.workspaceCardSet.cardSetId = +payload.params.cardSetId;
        }
    }

    state.workspaceCardSetCreate = getInitialWorkspaceCardSetCreateState(state.workspaceCardSet.cardSet);
}