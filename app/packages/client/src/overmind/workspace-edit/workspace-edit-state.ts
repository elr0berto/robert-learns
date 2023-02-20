import { validateWorkspaceEditRequest } from '@elr0berto/robert-learns-shared/dist/api/workspaces';
import {derived} from 'overmind'
import {PermissionUser, UserRole} from "@elr0berto/robert-learns-shared/dist/types";
import {Workspace} from "@elr0berto/robert-learns-shared/dist/api/models";
import {config} from "../index";

type WorkspaceEditFormState = {
    name: string;
    description: string;
    allowGuests: boolean;
    selectedUsers: PermissionUser[];
    submitting: boolean;
    submitAttempted: boolean;
    submissionError: string;
    addUserOpen: boolean;
    readonly availableRoles: UserRole[];
    readonly submitDisabled: boolean;
    readonly validationErrors: string[];
    readonly isValid: boolean;
    readonly showErrors: boolean;
    readonly allErrors: string[];
}

type WorkspaceEditState = {
    form: WorkspaceEditFormState;
}

export const getInitialWorkspaceEditState = (workspace: Workspace | null): WorkspaceEditState => ({
    form: {
        name: workspace?.name ?? '',
        description: workspace?.description ?? '',
        allowGuests: workspace?.allowGuests ?? false,
        selectedUsers: workspace?.selectedUsers ?? [],
        submitting: false,
        submitAttempted: false,
        submissionError: '',
        addUserOpen: false,
        availableRoles: derived((state: WorkspaceEditFormState) => {
            return Object.values(UserRole);
        }),
        submitDisabled: derived((state: WorkspaceEditFormState) => {
            return state.submitting;
        }),
        validationErrors: derived((state: WorkspaceEditFormState) => {
            let errors = validateWorkspaceEditRequest({
                name: state.name.trim(),
                description: state.description.trim(),
                allowGuests: state.allowGuests,
                workspaceUsers: state.selectedUsers,
            });
            return errors;
        }),
        isValid: derived((state: WorkspaceEditFormState) => {
            return state.validationErrors.length === 0;
        }),
        showErrors: derived((state: WorkspaceEditFormState) => {
            return state.submitAttempted && state.allErrors.length > 0;
        }),
        allErrors: derived((state: WorkspaceEditFormState) => {
            let errors = state.validationErrors;
            if (state.submissionError.length > 0) {
                errors.push(state.submissionError);
            }
            return errors;
        }),
    }
});

export const state: WorkspaceEditState = getInitialWorkspaceEditState(null);