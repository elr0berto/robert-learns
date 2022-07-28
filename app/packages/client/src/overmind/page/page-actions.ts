import { Context } from '..';
import {Pages} from "../../page-urls";


export const showFrontPage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.Front;
}

export const showSignInPage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.SignIn;

    if (state.login.user!.isGuest) {
        effects.page.router.redirect('/');
    }
}

export const showSignUpPage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.SignUp;

    if (state.login.user!.isGuest) {
        effects.page.router.redirect('/');
    }
}


export const showWorkspacePage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.Workspace;
}