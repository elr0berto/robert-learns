import { Context } from '..';
import { Pages } from "./page-state";


export const showFrontPage = async ({ state, effects, actions }: Context) => {
    state.page.current = Pages.Front;

    if (state.login.loggedIn) {

    }
}
