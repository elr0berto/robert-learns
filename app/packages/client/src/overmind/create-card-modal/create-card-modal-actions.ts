import {Context} from "..";
import {getInitialCreateCardModalState} from "./create-card-modal-state";

export const openCreateCardModal = ({ state }: Context, cardSetId: number) => {
    state.createCardModal = getInitialCreateCardModalState();
    state.createCardModal.cardSetId = cardSetId;
}

export const closeCreateCardModal = ({ state }: Context) => {
    state.createCardModal.cardSetId = null;
}

export const setActiveTab = ({state}: Context, activeTab: string | null) => {
    state.createCardModal.activeTab = activeTab;
}

export const setFrontHtml = ({ state }: Context, html: string) => {
    state.createCardModal.frontHtml = html;
}

export const setBackHtml = ({ state }: Context, html: string) => {
    state.createCardModal.backHtml = html;
}

export const uploadFile = async ({ state, effects }: Context, file: File) => {
    const resp = await effects.api.cardSets.cardSetUploadFile(state.createCardModal.cardSetId!, file);
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

export const submit = async ({ state, effects }: Context) => {
    state.createCardModal.submitting = true;
    const resp = await effects.api.cards.cardCreate({
        cardSetId: state.createCardModal.cardSetId!,
        front: state.createCardModal.frontHtml,
        back: state.createCardModal.backHtml,
        audio: window.audioFile ?? null,
    });

}