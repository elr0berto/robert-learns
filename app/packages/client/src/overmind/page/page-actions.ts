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

export const showFrontPage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.Front;
}

export const showSignInPage = async ({ state, effects, actions }: Context) => {
    state.signIn = getInitialSignInState(state.signIn.user);
    state.page.current = Pages.SignIn;
}

export const showSignUpPage = async ({ state, effects, actions }: Context) => {
    state.signUp = getInitialSignUpState();
    state.page.current = Pages.SignUp;
}

export const showWorkspacePage = async ({ state, effects, actions }: Context, payload: Payload) => {
    state.page.current = Pages.Workspace
    console.log('showWorkspacePage', payload.params?.id);
    if (payload.params?.id) {
        state.workspace.id = +payload.params.id;
    }
}

export const showWorkspaceCreatePage = async ({ state, effects, actions }: Context) => {
    state.workspaceCreate = getInitialWorkspaceCreateState();
    state.page.current = Pages.WorkspaceCreate;
}