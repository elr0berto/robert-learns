import {Context} from "..";
import {getInitialCreateCardModalState} from "./create-card-modal-state";
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import {ContentState, EditorState} from "draft-js";
import htmlToDraft from "html-to-draftjs";

function htmlStringToEditorState(html: string) : EditorState {
    const blocksFromHtml = htmlToDraft(html);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    return EditorState.createWithContent(contentState);
}
export const openCreateCardModal = ({ state }: Context, {cardSetId, card}: {cardSetId: number, card: Card|null}) => {
    state.createCardModal = getInitialCreateCardModalState();
    state.createCardModal.cardSetId = cardSetId;
    if (card === null) {
        state.createCardModal.cardId = null;
        state.createCardModal.frontEditorState = EditorState.createEmpty();
        state.createCardModal.backEditorState = EditorState.createEmpty();
    } else {
        state.createCardModal.cardId = card.id;
        state.createCardModal.frontEditorState = htmlStringToEditorState(card.front.content ?? '');
        state.createCardModal.backEditorState = htmlStringToEditorState(card.back.content ?? '');
    }
}

export const closeCreateCardModal = ({ state }: Context) => {
    state.createCardModal.cardSetId = null;
    state.createCardModal.cardId = null;
}

export const setActiveTab = ({state}: Context, activeTab: string | null) => {
    state.createCardModal.activeTab = activeTab;
}

export const setFrontEditorState = ({ state }: Context, editorState: EditorState) => {
    state.createCardModal.frontEditorState = editorState;
}

export const setBackEditorState = ({ state }: Context, editorState: EditorState) => {
    state.createCardModal.backEditorState = editorState;
}

export const uploadFile = async ({ state, effects }: Context, file: File) => {
    const resp = await effects.api.media.uploadFile(state.workspace.workspaceId!, file);
    return resp.url;
}

function readFileAsDataURLAsync(file: File) : Promise<string | null> {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
            resolve(typeof reader.result !== 'string' ? null : reader.result);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
    })
}

export const setAudioFile = async ({ state, effects }: Context, file: File|null) => {
    if (file === null) {
        window.audioFile = null;
        state.createCardModal.audioFileDataURL = null;
    } else {
        window.audioFile = file;
        state.createCardModal.audioFileDataURL = await readFileAsDataURLAsync(file);
    }
}

export const submit = async ({ state, effects, actions }: Context) => {
    state.createCardModal.submitting = true;
    const resp = await effects.api.cards.createCard({
        cardSetId: state.createCardModal.cardSetId!,
        front: state.createCardModal.frontHtml,
        back: state.createCardModal.backHtml,
        audio: window.audioFile ?? null,
    });

    state.workspaceCardSet.cards.push(resp.card!);

    actions.createCardModal.closeCreateCardModal();
    state.createCardModal.submitting = false;
}