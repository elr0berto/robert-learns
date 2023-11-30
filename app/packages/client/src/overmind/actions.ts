import {Context} from '.';

import {UnexpectedSignOutError} from "./sign-in/sign-in-state";
import {Payload} from "./page/page-actions";
import {pageUrls} from "../page-urls";
import {BaseResponse, ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models";

export const onInitializeOvermind = async ({ actions, effects, state }: Context) => {

    effects.api.apiClient.initialize(() => {},
(resp: BaseResponse) => {
                if (resp.status !== ResponseStatus.Success) {
                    switch(resp.status) {
                        case ResponseStatus.LoggedOut:
                            actions.signIn.unexpectedlySignedOut();
                            throw UnexpectedSignOutError;
                        case ResponseStatus.UserError:
                            break;
                        default:
                            throw new Error(resp.status + ": " + (resp.errorMessage ?? ""));
                    }
                }
            }
    );

    await Promise.all([actions.signIn.check()]);

    let routes : {[key:string]: (payload : Payload) => Promise<void>} = {};

    for (const [, value] of Object.entries(pageUrls)) {
        routes[value.route] = value.getRouteCallback(actions);
    }
    effects.page.router.initialize(routes);
}
