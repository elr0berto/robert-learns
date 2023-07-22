import {derived} from 'overmind'
import {validateCreateCardSetRequest} from "@elr0berto/robert-learns-shared/dist/api/card-sets";
import {config} from "..";
import {CardSet} from "@elr0berto/robert-learns-shared/dist/api/models";
import {overmind} from "../../index";

type WorkspaceCardSetCreateFormState = {
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
type WorkspaceCardSetCreateState = {
    form: WorkspaceCardSetCreateFormState;
}

export const getInitialWorkspaceCardSetCreateState = (cardSet: CardSet | null): WorkspaceCardSetCreateState => ({
    form: {
        name: cardSet?.name ?? '',
        description: cardSet?.description ?? '',
        submitting: false,
        submitAttempted: false,
        submissionError: '',
        submitDisabled: derived((state: WorkspaceCardSetCreateFormState) => {
            return state.submitting;
        }),
        validationErrors: derived((state: WorkspaceCardSetCreateFormState, rootState: typeof config.state) => {
            if (rootState.page.workspaceId === null) {
                console.warn("WorkspaceCardSetCreateFormState validationErrors derived state.page.workspaceId is null (this is ok during development)");
                return [];
            }
            let errors = validateCreateCardSetRequest({
                name: state.name.trim(),
                description: state.description.trim(),
                workspaceId: rootState.page.workspaceId,
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

export const state: WorkspaceCardSetCreateState = getInitialWorkspaceCardSetCreateState(null);