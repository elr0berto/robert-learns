import {createStateHook, createActionsHook, createEffectsHook} from 'overmind-react';
import { merge, namespaced } from 'overmind/config';
import * as actions from './actions';
import { IContext } from 'overmind';
import * as error from './error';
import * as page from './page';
import * as api from './api';
import * as signIn from './sign-in';
import * as signUp from './sign-up';
import * as workspaces from './workspaces';


export const config = merge(
    {
        actions
    },
    namespaced({
        error,
        //log,
        page,
        api,
        signIn,
        signUp,
        workspaces,
    })
)

export type Context = IContext<{
    state: typeof config.state;
    actions: typeof config.actions;
    effects: typeof config.effects;
}>;

export const useAppState = createStateHook<Context>();
export const useActions = createActionsHook<Context>();
export const useEffects = createEffectsHook<Context>();