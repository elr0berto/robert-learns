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

export const load = async ({state, effects, actions}: Context, payload?: Payload) => {
    await actions.page.loadWorkspaces();
    if (payload?.params?.workspaceId || state.page.workspaceId !== null) {
        if (payload?.params?.workspaceId) {
            state.page.workspaceId = +payload.params.workspaceId;
        }
        await actions.page.loadCardSets(state.page.workspaceId!);
        if (payload?.params?.cardSetId || state.page.cardSetId !== null) {
            if (payload?.params?.cardSetId) {
                state.page.cardSetId = +payload.params.cardSetId;
            }
            await actions.page.loadCards([state.page.cardSetId!]);
        }
    }
}

export const loadWorkspaces = async ({state,effects,actions} : Context) => {
    state.page.loadingWorkspaces = true;

    await actions.data.loadWorkspaces();

    state.page.loadingWorkspaces = false;
}

export const loadCardSets = async ({state,effects,actions} : Context, workspaceId: number) => {
    state.page.loadingCardSets = true;

    await actions.data.loadCardSets(workspaceId);

    state.page.loadingCardSets = false;
}

export const loadCards = async ({state,effects,actions} : Context, cardSetIds: number[]) => {
    state.page.loadingCards = true;

    await actions.data.loadCards(cardSetIds);

    state.page.loadingCards = false;
}



export const resetNav = async ({state}: Context) => {
    state.page.workspaceId = null;
    state.page.cardSetId = null;
}

export const showFrontPage = async ({ state, effects, actions }: Context) => {
    state.page.page = Pages.Front;
    actions.page.load();
    actions.page.resetNav();
}

export const showSignInPage = async ({ state, effects, actions }: Context) => {
    state.page.page = Pages.SignIn;
    actions.page.load();
    state.signIn = getInitialSignInState(state.signIn.userId);
}

export const showSignUpPage = async ({ state, effects, actions }: Context) => {
    state.page.page = Pages.SignUp;
    actions.page.load();
    state.signUp = getInitialSignUpState();
}

export const showWorkspacePage = async ({ state, effects, actions }: Context, payload: Payload) => {
    state.page.page = Pages.Workspace;
    state.page.cardSetId = null;
    actions.page.load(payload);
}

export const showWorkspaceCreatePage = async ({ state, effects, actions }: Context) => {
    state.page.page = Pages.WorkspaceCreate;
    actions.page.load();
    state.workspaceCreate = getInitialWorkspaceCreateState(null);
}

export const showWorkspaceEditPage = async ({ state, effects, actions }: Context, payload: Payload) => {
    state.page.page = Pages.WorkspaceEdit;
    await actions.page.load(payload);
    state.workspaceCreate = getInitialWorkspaceCreateState(state.page.workspaceWithWorkspaceUsers);
}

export const showWorkspaceCardSetPage = async ({ state, effects, actions }: Context, payload: Payload) => {
    state.page.page = Pages.WorkspaceCardSet;
    actions.page.load(payload);
}

export const showWorkspaceCardSetCreatePage = async ({ state, effects, actions }: Context, payload: Payload) => {
    state.page.page = Pages.WorkspaceCardSetCreate;
    actions.page.load(payload);
    state.workspaceCardSetCreate = getInitialWorkspaceCardSetCreateState(null);
}

export const showWorkspaceCardSetEditPage = async ({ state, effects, actions }: Context, payload: Payload) => {
    state.page.page = Pages.WorkspaceCardSetEdit;
    await actions.page.load(payload);
    state.workspaceCardSetCreate = getInitialWorkspaceCardSetCreateState(state.page.cardSet);
}