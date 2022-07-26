import {Context} from '.';

import {pageUrls} from '../page-urls';
import {UnexpectedLogoutError} from "./login/login-state";
import {BaseResponse, ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models/BaseResponse";


export const onInitializeOvermind = async ({ actions, effects, state }: Context) => {

    effects.api.apiClient.initialize(() => {
    }, (resp: BaseResponse) => {
        if (resp.status !== ResponseStatus.Success) {
            switch(resp.status) {
                case ResponseStatus.LoggedOut:
                    actions.login.unexpectedlyLoggedOut(resp.user!);
                    throw UnexpectedLogoutError;
                case ResponseStatus.UserError:
                    break;
                default:
                    throw new Error(resp.status + ": " + (resp.errorMessage ?? ""));
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
