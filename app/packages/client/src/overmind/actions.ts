import {Context} from '.';

import {pageUrls} from '../page-urls';
import {UnexpectedSignOutError} from "./sign-in/sign-in-state";
import {BaseResponse, ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models/BaseResponse";
import {objectMap} from "@elr0berto/robert-learns-shared/dist/common";


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

    const routes = objectMap<typeof pageUrls, {getRouteCallback: () => () => void}, () => void>(pageUrls, route => route.getRouteCallback());

    effects.page.router.initialize(routes);

    await actions.signIn.check();
}
