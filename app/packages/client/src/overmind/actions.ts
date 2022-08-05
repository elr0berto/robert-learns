import {Context} from '.';

import {pageUrls} from '../page-urls';
import {UnexpectedSignOutError} from "./sign-in/sign-in-state";
import {BaseResponse, ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models/BaseResponse";


export const onInitializeOvermind = async ({ actions, effects, state }: Context) => {

    effects.api.apiClient.initialize(() => {
    }, (resp: BaseResponse) => {
        if (resp.status !== ResponseStatus.Success) {
            switch(resp.status) {
                case ResponseStatus.LoggedOut:
                    actions.signIn.unexpectedlySignedOut(resp.user!);
                    throw UnexpectedSignOutError;
                case ResponseStatus.UserError:
                    break;
                default:
                    throw new Error(resp.status + ": " + (resp.errorMessage ?? ""));
            }
        }
    })

    effects.page.router.initialize({
        [pageUrls.front.route]: actions.page.showFrontPage,
        [pageUrls.signIn.route]: actions.page.showSignInPage,
        [pageUrls.signUp.route]: actions.page.showSignUpPage,
        [pageUrls.workspace.route]: actions.page.showWorkspacePage,
    });

    await actions.signIn.check();
}
