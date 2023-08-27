import { validateCreateWorkspaceRequest } from '@elr0berto/robert-learns-shared/dist/api/workspaces';
import {derived} from 'overmind'
import {WorkspaceWithWorkspaceUsers} from "../data/data-state";
import {UserRole} from "@elr0berto/robert-learns-shared/dist/api/models/UserRole";
import {config} from "..";
import {
    canUserChangeUserRole,
    canUserDeleteWorkspaceUser, getAllRoles,
    getRolesUserCanChangeUser
} from "@elr0berto/robert-learns-shared/dist/permissions";
import {Pages} from "../../page-urls";
import {UserRolesInOrder} from "@elr0berto/robert-learns-shared/dist/api/models";

type SelectedUser = {
    userId: number;
    role: UserRole;
    name: string;
    isMe: boolean;
    canRoleBeChanged: boolean;
    availableRoles: UserRole[];
    canBeRemoved: boolean;
}

type WorkspaceCreateState = {
    name: string;
    description: string;
    allowGuests: boolean;
    initialUsers: { userId: number, role: UserRole }[];
    selectedUsers: { userId: number, role: UserRole }[];
    submitting: boolean;
    submitAttempted: boolean;
    submissionError: string;
    addUserOpen: boolean;
    deleteWorkspaceModalOpen: boolean;
    deletingWorkspace: boolean;
    deleteWorkspaceError: string | null;
    readonly selectedUsersWithData: SelectedUser[];
    readonly submitDisabled: boolean;
    readonly validationErrors: string[];
    readonly isValid: boolean;
    readonly showErrors: boolean;
    readonly allErrors: string[];
    readonly scope: 'create' | 'edit';
    readonly canDelete: boolean;
}


export const getInitialWorkspaceCreateState = (workspace: WorkspaceWithWorkspaceUsers | null): WorkspaceCreateState => ({
    name: workspace?.workspace.name ?? '',
    description: workspace?.workspace.description ?? '',
    allowGuests: workspace?.workspace.allowGuests ?? false,
    initialUsers: workspace?.workspaceUsers.map(u => ({userId: u.userId, role: u.role })) ?? [],
    selectedUsers: workspace?.workspaceUsers.map(u => ({userId: u.userId, role: u.role })) ?? [],
    submitting: false,
    submitAttempted: false,
    submissionError: '',
    addUserOpen: false,
    deleteWorkspaceModalOpen: false,
    deletingWorkspace: false,
    deleteWorkspaceError: null,
    selectedUsersWithData: derived((state: WorkspaceCreateState, rootState : typeof config.state) => {
        return state.selectedUsers
            .filter(u => rootState.data.users.find(u2 => u2.id === u.userId) !== undefined)
            .map(u => {
                const user = rootState.data.users.find(u2 => u2.id === u.userId);
                if (user === undefined) {
                    throw new Error('User not found: ' + u.userId);
                }

                return {
                    userId: u.userId,
                    role: u.role,
                    name: user.name(),
                    isMe: state.scope === 'create' ? false : rootState.page.workspaceUser?.userId === u.userId,
                    canRoleBeChanged: state.scope === 'create' ? true : canUserChangeUserRole(rootState.page.workspaceUser, u),
                    availableRoles: state.scope === 'create' ? getAllRoles() : getRolesUserCanChangeUser(rootState.page.workspaceUser, u),
                    canBeRemoved: state.scope === 'create' ? true : canUserDeleteWorkspaceUser(rootState.page.workspaceUser, u),
                };
            });
            /*.sort((a, b) => { // commented out because it makes the users jump up and down when you change role. Moved the sorting server side.
                return UserRolesInOrder.indexOf(a.role) - UserRolesInOrder.indexOf(b.role)
            });*/
    }),
    submitDisabled: derived((state: WorkspaceCreateState) => {
        return state.submitting;
    }),
    validationErrors: derived((state: WorkspaceCreateState) => {
        return validateCreateWorkspaceRequest({
            name: state.name.trim(),
            description: state.description.trim(),
            allowGuests: state.allowGuests,
            workspaceUsers: state.selectedUsers,
        });
    }),
    isValid: derived((state: WorkspaceCreateState) => {
        return state.validationErrors.length === 0;
    }),
    showErrors: derived((state: WorkspaceCreateState) => {
        return state.submitAttempted && state.allErrors.length > 0;
    }),
    allErrors: derived((state: WorkspaceCreateState) => {
        let errors = state.validationErrors;
        if (state.submissionError.length > 0) {
            errors.push(state.submissionError);
        }
        return errors;
    }),
    scope: derived((state: WorkspaceCreateState, rootState : typeof config.state) => {
        return rootState.page.page === Pages.WorkspaceCreate ? 'create' : 'edit';
    }),
    canDelete: derived((state: WorkspaceCreateState, rootState : typeof config.state) => {
        return rootState.permission.deleteWorkspace;
    }),
});

export const state: WorkspaceCreateState = getInitialWorkspaceCreateState(null);