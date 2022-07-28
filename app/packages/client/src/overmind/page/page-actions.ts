import { Context } from '..';
import {Pages} from "../../page-urls";

export const showFrontPage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.Front;
}

export const showSignInPage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.SignIn;
}

export const showSignUpPage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.SignUp;
}

export const showWorkspacePage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.Workspace;
}