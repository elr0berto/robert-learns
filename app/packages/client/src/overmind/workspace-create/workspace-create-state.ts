import {derived} from 'overmind'
import {validateWorkspaceCreateRequest} from "@elr0berto/robert-learns-shared/dist/api/workspaces";

type WorkspaceCreateFormState = {
    name: string;
    description: string;
    submitting: boolean;
    submitAttempted: boolean;
    submissionError: string;
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
        submitting: false,
        submitAttempted: false,
        submissionError: '',
        submitDisabled: derived((state: WorkspaceCreateFormState) => {
            return state.submitting;
        }),
        validationErrors: derived((state: WorkspaceCreateFormState) => {
            let errors = validateWorkspaceCreateRequest({
                name: state.name.trim(),
                description: state.description.trim(),
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