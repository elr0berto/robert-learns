import {derived} from "overmind";
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import {config} from "../index";
import {convertToRaw, EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";

type CreateCardModalState = {
    cardId: number | null;
    cardSetId: number | null;
    activeTab: string | null;
    frontEditorState: EditorState;
    backEditorState: EditorState;
    audioFileDataURL: string | null;
    submitting: boolean;
    readonly isOpen: boolean;
    readonly edit: boolean;
    readonly card: Card | null;
    readonly frontHtml: string;
    readonly backHtml: string;
}

export const getInitialCreateCardModalState = (): CreateCardModalState => ({
    cardId: null,
    cardSetId: null,
    activeTab: 'front',
    frontEditorState: EditorState.createEmpty(),
    backEditorState: EditorState.createEmpty(),
    audioFileDataURL: null,
    submitting: false,
    isOpen: derived((state: CreateCardModalState) => {
        return state.cardSetId !== null;
    }),
    edit: derived((state: CreateCardModalState) => {
        return state.cardId !== null;
    }),
    card: derived((state: CreateCardModalState, rootState: typeof config.state) => {
        if (state.cardId === null) {
            return null;
        }
        const card = rootState.workspaceCardSet.cards.find(card => card.id === state.cardId);
        if (card === undefined || card === null) {
            throw new Error(`Card with id ${state.cardId} not found`);
        }
        return card;
    }),
    frontHtml: derived((state: CreateCardModalState) => {
        const contentState = state.frontEditorState.getCurrentContent();
        const rawContentState = convertToRaw(contentState);
        return draftToHtml(rawContentState);
    }),
    backHtml: derived((state: CreateCardModalState) => {
        const contentState = state.backEditorState.getCurrentContent();
        const rawContentState = convertToRaw(contentState);
        return draftToHtml(rawContentState);
    }),
});

export const state: CreateCardModalState = getInitialCreateCardModalState();