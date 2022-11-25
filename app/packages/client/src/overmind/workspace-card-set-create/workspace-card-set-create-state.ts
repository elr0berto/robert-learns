import {derived} from 'overmind'
import {validateWorkspaceCardSetCreateRequest} from "@elr0berto/robert-learns-shared/dist/api/workspaces";
import {config} from "../index";

type WorkspaceCardSetCreateFormState = {
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
type WorkspaceCardSetCreateState = {
    form: WorkspaceCardSetCreateFormState;
}

export const getInitialWorkspaceCardSetCreateState = (): WorkspaceCardSetCreateState => ({
    form: {
        name: '',
        submitting: false,
        submitAttempted: false,
        submissionError: '',
        submitDisabled: derived((state: WorkspaceCardSetCreateFormState) => {
            return state.submitting;
        }),
        validationErrors: derived((state: WorkspaceCardSetCreateFormState, rootState: typeof config.state) => {
            let errors = validateWorkspaceCardSetCreateRequest({
                name: state.name.trim(),
                workspaceId: rootState.workspace.workspaceId!,
            });
            return errors;
        }),
        isValid: derived((state: WorkspaceCardSetCreateFormState) => {
            return state.validationErrors.length === 0;
        }),
        showErrors: derived((state: WorkspaceCardSetCreateFormState) => {
            return state.submitAttempted && state.allErrors.length > 0;
        }),
        allErrors: derived((state: WorkspaceCardSetCreateFormState) => {
            let errors = state.validationErrors;
            if (state.submissionError.length > 0) {
                errors.push(state.submissionError);
            }
            return errors;
        }),
    },
});

export const state: WorkspaceCardSetCreateState = getInitialWorkspaceCardSetCreateState();