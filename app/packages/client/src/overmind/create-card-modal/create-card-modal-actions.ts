import {Context} from "..";
import {getInitialCreateCardModalState} from "./create-card-modal-state";
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import {ContentState, EditorState, RawDraftContentState} from "draft-js";
import htmlToDraft from "html-to-draftjs";

function htmlStringToEditorState(html: string) : EditorState {
    const blocksFromHtml = htmlToDraft(html);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    return EditorState.createWithContent(contentState);
}
export const openCreateCardModal = ({ state }: Context, {cardSetId, card}: {cardSetId: number, card: Card|null}) => {
    console.log('openCreateCardModal', cardSetId, card);
    window.audioFile = null;
    state.createCardModal = getInitialCreateCardModalState(cardSetId, card);
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


    let audioUpdateStatus : 'new-card' | 'new-audio' | 'delete-audio' | 'no-change' = 'new-card';
    if (state.createCardModal.cardId !== null) {
        const card = state.workspaceCardSet.cards.find(c => c.id === state.createCardModal.cardId);
        if (card === undefined) {
            throw new Error('Card not found, id: ' + state.createCardModal.cardId);
        }

        const cardHadAudio = card.audio !== null;
        const cardHasNewAudio = window.audioFile !== null;
        const cardHasAudio = state.createCardModal.audioFileDataURL !== null;

        if (cardHasNewAudio) {
            audioUpdateStatus = 'new-audio';
        } else {
            if (cardHadAudio && !cardHasAudio) {
                audioUpdateStatus = 'delete-audio';
            } else {
                audioUpdateStatus = 'no-change';
            }
        }
    }

    const resp = await effects.api.cards.createCard({
        cardId: state.createCardModal.cardId,
        cardSetId: state.createCardModal.cardSetId!,
        front: state.createCardModal.frontHtml,
        back: state.createCardModal.backHtml,
        audio: window.audioFile ?? null,
        audioUpdateStatus: audioUpdateStatus,
    });

    if (state.createCardModal.cardId === null) {
        state.workspaceCardSet.cards.push(resp.card!);
    } else {
        const card = state.workspaceCardSet.cards.find(c => c.id === state.createCardModal.cardId);
        if (card === undefined) {
            throw new Error('Card not found, id: ' + state.createCardModal.cardId);
        }

        // replace the card in state.workspaceCardSet.cards with the new card
        const index = state.workspaceCardSet.cards.indexOf(card);
        // check that index is valid
        if (index === -1) {
            throw new Error('Card not found, id: ' + state.createCardModal.cardId);
        }
        state.workspaceCardSet.cards[index] = resp.card!;
    }

    actions.createCardModal.closeCreateCardModal();
    state.createCardModal.submitting = false;
}