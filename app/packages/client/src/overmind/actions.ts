import {Context} from '.';

import {pageUrls} from '../page-urls';
import {UnexpectedSignOutError} from "./sign-in/sign-in-state";
import {BaseResponse, ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models/BaseResponse";
import {Payload} from "./page/page-actions";


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

    await Promise.all([actions.signIn.check(), actions.workspaces.getWorkspaceList()]);

    let routes : {[key:string]: (payload : Payload) => Promise<void>} = {};

    for (const [, value] of Object.entries(pageUrls)) {
        routes[value.route] = value.getRouteCallback(actions);
    }
    effects.page.router.initialize(routes);
}
