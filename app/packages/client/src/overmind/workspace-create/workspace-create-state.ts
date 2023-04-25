import { validateCreateWorkspaceRequest } from '@elr0berto/robert-learns-shared/dist/api/workspaces';
import {derived} from 'overmind'
import {PermissionUser} from "@elr0berto/robert-learns-shared/dist/types";
import {Workspace} from "@elr0berto/robert-learns-shared/dist/api/models";

type WorkspaceCreateFormState = {
    name: string;
    description: string;
    allowGuests: boolean;
    selectedUsers: PermissionUser[];
    submitting: boolean;
    submitAttempted: boolean;
    submissionError: string;
    addUserOpen: boolean;
    readonly submitDisabled: boolean;
    readonly validationErrors: string[];
    readonly isValid: boolean;
    readonly showErrors: boolean;
    readonly allErrors: string[];
}
type WorkspaceCreateState = {
    form: WorkspaceCreateFormState;
}

export const getInitialWorkspaceCreateState = (workspace: Workspace | null): WorkspaceCreateState => ({
    form: {
        name: workspace?.name ?? '',
        description: workspace?.description ?? '',
        allowGuests: workspace?.allowGuests() ?? false,
        selectedUsers: workspace?.users.filter(u => !u.isGuest) ?? [],
        submitting: false,
        submitAttempted: false,
        submissionError: '',
        addUserOpen: false,
        submitDisabled: derived((state: WorkspaceCreateFormState) => {
            return state.submitting;
        }),
        validationErrors: derived((state: WorkspaceCreateFormState) => {
            let errors = validateCreateWorkspaceRequest({
                name: state.name.trim(),
                description: state.description.trim(),
                allowGuests: state.allowGuests,
                workspaceUsers: state.selectedUsers,
            });
            return errors;
        }),
        isValid: derived((state: WorkspaceCreateFormState) => {
            return state.validationErrors.length === 0;
        }),
        showErrors: derived((state: WorkspaceCreateFormState) => {
            return state.submitAttempted && state.allErrors.length > 0;
        }),
        allErrors: derived((state: WorkspaceCreateFormState) => {
            let errors = state.validationErrors;
            if (state.submissionError.length > 0) {
                errors.push(state.submissionError);
            }
            return errors;
        }),
    },
});

export const state: WorkspaceCreateState = getInitialWorkspaceCreateState(null);