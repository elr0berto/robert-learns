import {Context} from '.';
import {Pages} from "./page/page-state";
import {BaseResponse, Status} from "@elr0berto/robert-learns-shared/src/api/response";

import {pageUrls} from '../page-urls';
import {UnexpectedLogoutError} from "./login/login-state";


export const onInitializeOvermind = ({ actions, effects, state }: Context) => {

    effects.api.myPagesApi.initialize(() => {
    }, (resp: BaseResponse) => {
        if (!resp.Success) {
            switch(resp.ResponseStatus) {
                case Status.LoggedOut:
                    actions.login.unexpectedlyLoggedOut();
                    throw UnexpectedLogoutError;
                case Status.UserError:
                    break;
                default:
                    throw new Error(resp.ResponseStatus + ": " + (resp.ErrorMessage ?? ""));
            }
        }
    })

    effects.page.router.initialize({
        [pageUrls.front.getRoute()]: actions.page.showFrontPage,
    });

    if (!state.login.loggedIn && state.page.current !== Pages.Front) {
        effects.page.router.redirect('/');
    }
}
