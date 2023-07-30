import { validateCreateWorkspaceRequest } from '@elr0berto/robert-learns-shared/dist/api/workspaces';
import {derived} from 'overmind'
import {WorkspaceWithWorkspaceUsers} from "../data/data-state";
import {UserRole} from "@elr0berto/robert-learns-shared/dist/api/models/UserRole";
import {config} from "..";
import {
    canUserChangeUserRole,
    canUserDeleteWorkspaceUser,
    getRolesUserCanChangeUser
} from "@elr0berto/robert-learns-shared/dist/permissions";
import {Pages} from "../../page-urls";

type SelectedUser = {
    userId: number;
    role: UserRole;
    name: string;
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
    readonly selectedUsersWithData: SelectedUser[];
    readonly submitDisabled: boolean;
    readonly validationErrors: string[];
    readonly isValid: boolean;
    readonly showErrors: boolean;
    readonly allErrors: string[];
    readonly scope: 'create' | 'edit';
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
    selectedUsersWithData: derived((state: WorkspaceCreateState, rootState : typeof config.state) => {
        return state.selectedUsers.map(u => {
            const user = rootState.data.users.find(u2 => u2.id === u.userId);
            if (user === undefined) {
                throw new Error('User not found: ' + u.userId);
            }
            return {
                userId: u.userId,
                role: u.role,
                name: user.name(),
                canRoleBeChanged: canUserChangeUserRole(state.scope === 'create' ? rootState.signIn.user : rootState.page.workspaceUser, u),
                availableRoles: getRolesUserCanChangeUser(rootState.page.workspaceUser, u),
                canBeRemoved: canUserDeleteWorkspaceUser(rootState.page.workspaceUser, u),
            };
        });
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
});

export const state: WorkspaceCreateState = getInitialWorkspaceCreateState(null);