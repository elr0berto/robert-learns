import {derived} from "overmind";
import {config} from "..";
import {Capability, userCan} from "@elr0berto/robert-learns-shared/dist/permissions";
import {UserRole} from "@elr0berto/robert-learns-shared/dist/api/models/UserRole";

function _userCan(state: PermissionState, rootState: typeof config.state, capability: Capability): boolean {
    return userCan(rootState.signIn.userId !== null, rootState.page.workspace?.allowGuests ?? false, state.role, capability);
}

type PermissionState = {
    readonly role: UserRole | null;
    readonly createWorkspace: boolean;
    readonly editWorkspace: boolean;
}

export const getInitialPermissionState = (): PermissionState => ({
    role: derived((state: PermissionState, rootState: typeof config.state) => {
        return rootState.page.workspaceUser?.role ?? null;
    }),
    createWorkspace: derived((state: PermissionState, rootState: typeof config.state) => {
        return _userCan(state, rootState, Capability.CreateWorkspace);
    }),
    editWorkspace: derived((state: PermissionState, rootState: typeof config.state) => {
        return _userCan(state, rootState, Capability.EditWorkspace);
    }),
});

export const state: PermissionState = getInitialPermissionState();