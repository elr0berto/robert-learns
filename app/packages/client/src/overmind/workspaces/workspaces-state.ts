import {derived} from 'overmind'
import Workspace from "@elr0berto/robert-learns-shared/dist/api/models/Workspace";
import {ValidateWorkspaceCreateRequest} from "@elr0berto/robert-learns-shared/dist/api/workspace";

type WorkspaceCreateFormState = {
    name: string;
    submitting: boolean;
    submitAttempted: boolean;
    submissionError: string;
    readonly submitDisabled: boolean;
    readonly validationErrors: string[];
    readonly isValid: boolean;
    readonly showErrors: boolean;
    readonly allErrors: string[];
}
type WorkspacesState = {
    loading: boolean;
    list: Workspace[];
    createForm: WorkspaceCreateFormState;

}

export const getInitialWorkspacesState = (): WorkspacesState => ({
    loading: false,
    list: [],
    createForm: {
        name: '',
        submitting: false,
        submitAttempted: false,
        submissionError: '',
        submitDisabled: derived((state: WorkspaceCreateFormState) => {
            return state.submitting;
        }),
        validationErrors: derived((state: WorkspaceCreateFormState) => {
            let errors = ValidateWorkspaceCreateRequest({
                name: state.name.trim(),
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

export const state: WorkspacesState = getInitialWorkspacesState();