import { Context } from '..';
import {Pages} from "../../page-urls";
import queryString from "query-string";
import {getInitialSignUpState} from "../sign-up/sign-up-state";
import {getInitialSignInState} from "../sign-in/sign-in-state";
import {getInitialWorkspaceCreateState} from "../workspace-create/workspace-create-state";

export type Payload = {
    params: any,
    querystring: queryString.ParsedQuery<string>
}

export const _loadAllData = async ({ state, effects, actions }: Context) => {
    actions.workspaces.getWorkspaceList();
}

export const showFrontPage = async ({ state, effects, actions }: Context) => {
    actions.page._loadAllData();
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
        state.workspace.workspaceId = +payload.params.workspaceId;
        actions.workspace._loadCardSets();
    }
}

export const showWorkspacePage = async ({ state, effects, actions }: Context, payload: Payload) => {
    actions.page._loadAllData();
    actions.page._setWorkspacePage({payload, page: Pages.Workspace});
}

export const showWorkspaceCardSetCreatePage = async ({ state, effects, actions }: Context, payload: Payload) => {
    actions.page._loadAllData();
    actions.page._setWorkspacePage({payload, page: Pages.WorkspaceCardSetCreate});
}

export const showWorkspaceCardSetPage = async ({ state, effects, actions }: Context, payload: Payload) => {
    actions.page._loadAllData();
    actions.page._setWorkspacePage({payload, page: Pages.WorkspaceCardSet});
}

export const showWorkspaceCreatePage = async ({ state, effects, actions }: Context) => {
    actions.page._loadAllData();
    state.workspaceCreate = getInitialWorkspaceCreateState();
    state.page.current = Pages.WorkspaceCreate;
}