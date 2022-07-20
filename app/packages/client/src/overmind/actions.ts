import {Context} from '.';

import {pageUrls} from '../page-urls';
import {UnexpectedLogoutError} from "./login/login-state";
import {BaseResponse, ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/response";


export const onInitializeOvermind = async ({ actions, effects, state }: Context) => {

    effects.api.apiClient.initialize(() => {
    }, (resp: BaseResponse) => {
        if (resp.Status !== ResponseStatus.Success) {
            switch(resp.Status) {
                case ResponseStatus.LoggedOut:
                    actions.login.unexpectedlyLoggedOut(resp.User!);
                    throw UnexpectedLogoutError;
                case ResponseStatus.UserError:
                    break;
                default:
                    throw new Error(resp.Status + ": " + (resp.ErrorMessage ?? ""));
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
