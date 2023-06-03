import {createStateHook, createActionsHook, createEffectsHook} from 'overmind-react';
import * as actions from './actions';
import { IContext } from 'overmind';
import * as error from './error';
import * as page from './page';
import * as api from './api';
import * as data from './data';
import * as signIn from './sign-in';
import * as signUp from './sign-up/';
import * as workspaceCreate from './workspace-create/';
import * as workspaceCardSetCreate from './workspace-card-set-create/';
import * as workspaces from './workspaces/';
import * as workspace from './workspace/';
import * as workspaceCardSet from './workspace-card-set/';
import * as createCardModal from './create-card-modal/';
import * as addUserModal from './add-user-modal/';
import * as addCardsFromOtherCardSetsModal from './add-cards-from-other-card-sets-modal';
import * as editCardCardSetsModal from './edit-card-card-sets-modal';

import {merge, namespaced} from "overmind/es/config";

export const config = merge(
    {
        actions
    },
    namespaced({
        error,
        //log,
        page,
        api,
        data,
        signIn,
        signUp,
        workspaceCreate,
        workspaceCardSetCreate,
        workspaces,
        workspace,
        workspaceCardSet,
        createCardModal,
        addUserModal,
        addCardsFromOtherCardSetsModal,
        editCardCardSetsModal
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