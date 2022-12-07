import {Context} from './index.js';

import {pageUrls} from '../page-urls/index.js';
import {UnexpectedSignOutError} from "./sign-in/sign-in-state.js";
import {Payload} from "./page/page-actions.js";
import {BaseResponse, ResponseStatus} from "../../../shared/src/api/models/BaseResponse.js";


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
