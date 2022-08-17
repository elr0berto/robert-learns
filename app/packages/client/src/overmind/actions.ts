import {Context} from '.';

import {pageUrls} from '../page-urls';
import {UnexpectedSignOutError} from "./sign-in/sign-in-state";
import {BaseResponse, ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models/BaseResponse";
import {objectMap} from "../../../shared/src/common";


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

    let routes = {};

    for (let k in pageUrls) {
        routes[k.route] = k.getRouteCallback(actions),
    }
    effects.page.router.initialize(routes);

    effects.page.router.initialize({
        [pageUrls.front.route]: actions.page.showFrontPage,
        [pageUrls.signIn.route]: actions.page.showSignInPage,
        [pageUrls.signUp.route]: actions.page.showSignUpPage,
        [pageUrls.workspace.route]: actions.page.showWorkspacePage,
        [pageUrls.workspaceCreate.route]: actions.page.showWorkspaceCreatePage,
    });

    await actions.signIn.check();
}
