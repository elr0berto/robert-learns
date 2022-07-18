import {Context} from '.';
import {BaseResponse, Status} from "@elr0berto/robert-learns-shared/src/api/response";

import {pageUrls} from '../page-urls';
import {UnexpectedLogoutError} from "./login/login-state";


export const onInitializeOvermind = async ({ actions, effects, state }: Context) => {

    effects.api.apiClient.initialize(() => {
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
        [pageUrls.register.getRoute()]: actions.page.showRegisterPage,
        [pageUrls.login.getRoute()]: actions.page.showLoginPage,
    });

    await actions.login.check();
}
