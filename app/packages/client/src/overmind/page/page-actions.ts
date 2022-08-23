import { Context } from '..';
import {Pages} from "../../page-urls";
import queryString from "query-string";
import {getInitialSignUpState} from "../sign-up/sign-up-state";
import {getInitialSignInState} from "../sign-in/sign-in-state";

export type Payload = {
    params: any,
    querystring: queryString.ParsedQuery<string>
}

export const showFrontPage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.Front;
}

export const showSignInPage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.SignIn;
    state.signIn = getInitialSignInState();
}

export const showSignUpPage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.SignUp;
    state.signUp = getInitialSignUpState();
}

export const showWorkspacePage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.Workspace;
}

export const showWorkspaceCreatePage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.WorkspaceCreate;
}