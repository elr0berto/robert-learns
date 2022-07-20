import { Context } from '..';
import { Pages } from "./page-state";


export const showFrontPage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.Front;
}

export const showLoginPage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.Login;

    if (state.login.user!.isGuest) {
        effects.page.router.redirect('/');
    }
}
export const showRegisterPage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.Register;

    if (!state.login.user!.isGuest) {
        effects.page.router.redirect('/');
    }
}