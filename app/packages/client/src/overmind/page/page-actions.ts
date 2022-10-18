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



export const showWorkspaceCreatePage = async ({ state, effects, actions }: Context) => {
    actions.page._loadAllData();
    state.workspaceCreate = getInitialWorkspaceCreateState();
    state.page.current = Pages.WorkspaceCreate;
}