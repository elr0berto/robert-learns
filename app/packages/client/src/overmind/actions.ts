import {Context} from '.';

import {PageUrlConfigKeys, pageUrls} from '../page-urls';
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

    let routes : {[key: string]: () => void};

    for (let k in pageUrls) {
        console.log(pageUrls[k].route);
        routes[pageUrls[k].route] = pageUrls[k].getRouteCallback(actions);
    }
    effects.page.router.initialize(routes);

    pageUrls.workspacesdsds.url();
    await actions.signIn.check();
}
