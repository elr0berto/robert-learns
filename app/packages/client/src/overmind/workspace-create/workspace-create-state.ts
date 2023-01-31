import { validateWorkspaceCreateRequest } from '@elr0berto/robert-learns-shared/dist/api/workspaces';
import {derived} from 'overmind'
import {PermissionUser, UserRole} from "@elr0berto/robert-learns-shared/dist/types";

type WorkspaceCreateFormState = {
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
type WorkspaceCreateState = {
    form: WorkspaceCreateFormState;
}

export const getInitialWorkspaceCreateState = (): WorkspaceCreateState => ({
    form: {
        name: '',
        description: '',
        allowGuests: false,
        selectedUsers: [],
        submitting: false,
        submitAttempted: false,
        submissionError: '',
        addUserOpen: false,
        availableRoles: derived((state: WorkspaceCreateFormState) => {
            return Object.values(UserRole);
        }),
        submitDisabled: derived((state: WorkspaceCreateFormState) => {
            return state.submitting;
        }),
        validationErrors: derived((state: WorkspaceCreateFormState) => {
            let errors = validateWorkspaceCreateRequest({
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

export const state: WorkspaceCreateState = getInitialWorkspaceCreateState();