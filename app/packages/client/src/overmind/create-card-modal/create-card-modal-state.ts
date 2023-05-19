import {derived} from "overmind";
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import {config} from "../index";
import {ContentState, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import {stateToHTML} from 'draft-js-export-html';

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

function getEditorStateFromHtmlString(html: string) : EditorState {
    const contentBlock = htmlToDraft(html);
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks, contentBlock.entityMap);
    return EditorState.createWithContent(contentState);
}

function getHtmlStringFromEditorState(editorState: EditorState) : string {
    let contentState = editorState.getCurrentContent();
    return stateToHTML(contentState);
}

export const getInitialCreateCardModalState = (cardSetId: number | null, card: Card | null) : CreateCardModalState => {
    return {
        cardId: card?.id ?? null,
        cardSetId: cardSetId,
        activeTab: 'front',
        frontEditorState: getEditorStateFromHtmlString(card?.front.content ?? ''),
        backEditorState: getEditorStateFromHtmlString(card?.back.content ?? ''),
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
            return getHtmlStringFromEditorState(state.frontEditorState);
        }),
        backHtml: derived((state: CreateCardModalState) => {
            return getHtmlStringFromEditorState(state.backEditorState);
        }),
    };
}

export const state: CreateCardModalState = getInitialCreateCardModalState(null, null);