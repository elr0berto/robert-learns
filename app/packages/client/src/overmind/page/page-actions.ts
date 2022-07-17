import { Context } from '..';
import { Pages } from "./page-state";


export const showFrontPage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.Front;

    if (state.login.loggedIn) {

    }
}

export const showRegisterPage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.Register;

    if (state.login.loggedIn) {
        effects.page.router.redirect('/');
    }
}